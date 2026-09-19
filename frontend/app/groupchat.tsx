import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "../constants/api";
import { ChatGroup, User } from "./home";

type Message = {
  id: number;
  senderid: number;
  sendername: string;
  senderyear: string;
  senderprogram: string;
  content: string;
  timestamp: string;
  group_id: number;
};

type Props = {
  user: User;
  group: ChatGroup;
  onBack: () => void;
  onLogout: () => void;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }

  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== today.getFullYear()
        ? "numeric"
        : undefined,
  });
};

const sameDay = (
  first: string,
  second: string
) => {
  const a = new Date(first);
  const b = new Date(second);

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export default function GroupChatScreen({
  user,
  group,
  onBack,
  onLogout,
}: Props) {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [connected, setConnected] =
    useState(false);

  const socketRef =
    useRef<Socket | null>(null);

  const listRef =
    useRef<FlatList<Message>>(null);

  useEffect(() => {
    let active = true;

    const startChat = async () => {
      try {
        const token =
          await AsyncStorage.getItem(
            "authToken"
          );

        if (!token) {
          onLogout();
          return;
        }

        const response = await fetch(
          `${BACKEND_URL}/api/chat/messages?group_id=${group.id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          onLogout();
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Failed to load messages"
          );
        }

        const data = await response.json();

        if (active) {
          setMessages(data);
          setLoading(false);
        }

        const socket = io(BACKEND_URL, {
          transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);

          socket.emit(
            "group:join",
            group.id
          );
        });

        socket.on("disconnect", () => {
          setConnected(false);
        });

        socket.on(
          "message:new",
          (newMessage: Message) => {
            if (
              newMessage.group_id !==
              group.id
            ) {
              return;
            }

            setMessages((current) => {
              const exists =
                current.some(
                  (item) =>
                    item.id ===
                    newMessage.id
                );

              if (exists) {
                return current;
              }

              return [
                ...current,
                newMessage,
              ];
            });
          }
        );
      } catch (error) {
        console.error(
          "Chat loading error:",
          error
        );

        if (active) {
          setLoading(false);
        }
      }
    };

    startChat();

    return () => {
      active = false;

      if (socketRef.current) {
        socketRef.current.emit(
          "group:leave",
          group.id
        );

        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [group.id, onLogout]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    }
  }, [messages.length]);

  const sendMessage = async () => {
    const cleanMessage = message.trim();

    if (!cleanMessage || sending) {
      return;
    }

    setSending(true);

    try {
      const token =
        await AsyncStorage.getItem(
          "authToken"
        );

      if (!token) {
        onLogout();
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/chat/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            content: cleanMessage,
            group_id: group.id,
          }),
        }
      );

      if (response.status === 401) {
        onLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to send message"
        );
      }

      const newMessage: Message =
        await response.json();

      setMessages((current) => {
        const exists = current.some(
          (item) =>
            item.id === newMessage.id
        );

        if (exists) {
          return current;
        }

        return [
          ...current,
          newMessage,
        ];
      });

      setMessage("");
    } catch (error) {
      console.error(
        "Message sending error:",
        error
      );
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: Message;
    index: number;
  }) => {
    const mine =
      item.senderid === user.id;

    const previous =
      index > 0
        ? messages[index - 1]
        : null;

    const showDate =
      !previous ||
      !sameDay(
        previous.timestamp,
        item.timestamp
      );

    const samePreviousSender =
      previous &&
      previous.senderid ===
        item.senderid &&
      sameDay(
        previous.timestamp,
        item.timestamp
      );

    return (
      <>
        {showDate && (
          <View
            style={
              styles.dateSeparator
            }
          >
            <View
              style={
                styles.dateLine
              }
            />

            <Text
              style={
                styles.dateText
              }
            >
              {formatDate(
                item.timestamp
              )}
            </Text>

            <View
              style={
                styles.dateLine
              }
            />
          </View>
        )}

        <View
          style={[
            styles.messageRow,
            mine
              ? styles.myMessageRow
              : styles.otherMessageRow,
            samePreviousSender &&
              styles.compactMessage,
          ]}
        >
          {!mine && (
            <View
              style={
                styles.avatarColumn
              }
            >
              {!samePreviousSender ? (
                <View
                  style={
                    styles.messageAvatar
                  }
                >
                  <Text
                    style={
                      styles.messageAvatarText
                    }
                  >
                    {initials(
                      item.sendername
                    )}
                  </Text>
                </View>
              ) : (
                <View
                  style={
                    styles.avatarPlaceholder
                  }
                />
              )}
            </View>
          )}

          <View
            style={[
              styles.messageContainer,
              mine &&
                styles.myMessageContainer,
            ]}
          >
            {!mine &&
              !samePreviousSender && (
                <Text
                  style={
                    styles.senderName
                  }
                >
                  {item.sendername}
                </Text>
              )}

            <View
              style={[
                styles.bubble,
                mine
                  ? styles.myBubble
                  : styles.otherBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  mine &&
                    styles.myMessageText,
                ]}
              >
                {item.content}
              </Text>
            </View>

            <Text
              style={[
                styles.time,
                mine &&
                  styles.myTime,
              ]}
            >
              {mine ? "You • " : ""}
              {formatTime(
                item.timestamp
              )}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.back}>
              ‹
            </Text>
          </TouchableOpacity>

          <View
            style={
              styles.headerContent
            }
          >
            <Text
              style={
                styles.courseName
              }
              numberOfLines={1}
            >
              {group.course_name}
            </Text>

            <View
              style={
                styles.statusRow
              }
            >
              <View
                style={[
                  styles.statusDot,
                  !connected &&
                    styles.statusDotOffline,
                ]}
              />

              <Text
                style={
                  styles.courseCode
                }
              >
                {group.course_code}
                {"  •  "}
                {connected
                  ? "Live"
                  : "Connecting"}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.headerBadge
            }
          >
            <Text
              style={
                styles.headerBadgeText
              }
            >
              {group.course_code
                .split(" ")[0]
                .slice(0, 4)}
            </Text>
          </View>
        </View>

        {loading ? (
          <View
            style={
              styles.loadingContainer
            }
          >
            <ActivityIndicator
              size="large"
              color="#2457C5"
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading conversation...
            </Text>
          </View>
        ) : messages.length === 0 ? (
          <View
            style={
              styles.emptyContainer
            }
          >
            <View
              style={
                styles.emptyIcon
              }
            >
              <Text
                style={
                  styles.emptyIconText
                }
              >
                ✦
              </Text>
            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              Start the conversation
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Be the first to send a
              message to your{" "}
              {group.course_code} group.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) =>
              String(item.id)
            }
            renderItem={
              renderMessage
            }
            contentContainerStyle={
              styles.messageList
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd(
                {
                  animated: false,
                }
              )
            }
          />
        )}

        <View
          style={
            styles.composerContainer
          }
        >
          <View
            style={styles.composer}
          >
            <TextInput
              style={styles.input}
              placeholder={`Message ${group.course_code}`}
              placeholderTextColor="#98A2B3"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={2000}
              returnKeyType="default"
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                (!message.trim() ||
                  sending) &&
                  styles.sendButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={sendMessage}
              disabled={
                !message.trim() ||
                sending
              }
            >
              {sending ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Text
                  style={
                    styles.sendText
                  }
                >
                  ↑
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  header: {
    minHeight: 70,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5EAF2",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  back: {
    color: "#2457C5",
    fontSize: 34,
    lineHeight: 35,
  },

  headerContent: {
    flex: 1,
  },

  courseName: {
    color: "#17243C",
    fontSize: 16,
    fontWeight: "800",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#3CB878",
    marginRight: 6,
  },

  statusDotOffline: {
    backgroundColor: "#B8C0CC",
  },

  courseCode: {
    color: "#8A94A6",
    fontSize: 11,
    fontWeight: "600",
  },

  headerBadge: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#EAF0FC",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  headerBadgeText: {
    color: "#2457C5",
    fontSize: 9,
    fontWeight: "900",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#8A94A6",
    fontSize: 13,
    marginTop: 12,
  },

  messageList: {
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: 20,
  },

  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E1E6EE",
  },

  dateText: {
    color: "#98A2B3",
    fontSize: 10,
    fontWeight: "700",
    marginHorizontal: 12,
  },

  messageRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  compactMessage: {
    marginTop: -7,
  },

  myMessageRow: {
    justifyContent: "flex-end",
  },

  otherMessageRow: {
    justifyContent: "flex-start",
  },

  avatarColumn: {
    width: 40,
    marginRight: 8,
  },

  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5ECFA",
    alignItems: "center",
    justifyContent: "center",
  },

  messageAvatarText: {
    color: "#2457C5",
    fontSize: 11,
    fontWeight: "900",
  },

  avatarPlaceholder: {
    width: 36,
  },

  messageContainer: {
    maxWidth: "76%",
  },

  myMessageContainer: {
    alignItems: "flex-end",
  },

  senderName: {
    color: "#56657A",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 5,
    marginLeft: 3,
  },

  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  myBubble: {
    backgroundColor: "#2457C5",
    borderBottomRightRadius: 5,
  },

  otherBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F0",
    borderBottomLeftRadius: 5,
  },

  messageText: {
    color: "#24334B",
    fontSize: 15,
    lineHeight: 21,
  },

  myMessageText: {
    color: "#FFFFFF",
  },

  time: {
    color: "#A0A8B5",
    fontSize: 9,
    marginTop: 4,
    marginLeft: 3,
  },

  myTime: {
    textAlign: "right",
    marginRight: 3,
  },

  emptyContainer: {
    flex: 1,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#EAF0FC",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIconText: {
    color: "#2457C5",
    fontSize: 24,
  },

  emptyTitle: {
    color: "#17243C",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 17,
  },

  emptyText: {
    color: "#8A94A6",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
  },

  composerContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5EAF2",
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom:
      Platform.OS === "ios" ? 7 : 10,
  },

  composer: {
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: "#F2F5F9",
    borderWidth: 1,
    borderColor: "#E1E6EE",
    paddingLeft: 16,
    paddingRight: 5,
    flexDirection: "row",
    alignItems: "flex-end",
  },

  input: {
    flex: 1,
    color: "#17243C",
    fontSize: 15,
    maxHeight: 110,
    minHeight: 46,
    paddingTop: 13,
    paddingBottom: 11,
    paddingRight: 8,
  },

  sendButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "#2457C5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  sendButtonDisabled: {
    backgroundColor: "#B9C5D9",
  },

  sendText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 24,
  },
});
