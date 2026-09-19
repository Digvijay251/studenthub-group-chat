import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";

import AuthScreen from "./app/auth";
import HomeScreen, {
  ChatGroup,
  User,
} from "./app/home";
import ProfileScreen from "./app/profile";
import GroupChatScreen from "./app/groupchat";

import { BACKEND_URL } from "./constants/api";

type Screen = "home" | "chat" | "profile";

export default function App() {
  const [loading, setLoading] = useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  const [screen, setScreen] =
    useState<Screen>("home");

  const [user, setUser] =
    useState<User | null>(null);

  const [groups, setGroups] =
    useState<ChatGroup[]>([]);

  const [selectedGroup, setSelectedGroup] =
    useState<ChatGroup | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const values =
        await AsyncStorage.multiGet([
          "currentUser",
          "authToken",
        ]);

      const storedUser = values[0][1];
      const token = values[1][1];

      if (!storedUser || !token) {
        setAuthenticated(false);
        setUser(null);
        return;
      }

      const parsedUser: User =
        JSON.parse(storedUser);

      setUser(parsedUser);
      setAuthenticated(true);
    } catch (error) {
      console.error(
        "Session loading failed:",
        error
      );

      setAuthenticated(false);
      setUser(null);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        "currentUser",
        "authToken",
      ]);

      setUser(null);
      setGroups([]);
      setSelectedGroup(null);
      setScreen("home");
      setAuthenticated(false);
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }, []);

  const loadGroups = useCallback(async () => {
    try {
      const token =
        await AsyncStorage.getItem(
          "authToken"
        );

      if (!token) {
        await handleLogout();
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/chat/groups`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        await handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to load groups"
        );
      }

      const data = await response.json();

      setGroups(data);
    } catch (error) {
      console.error(
        "Group loading failed:",
        error
      );

      Alert.alert(
        "Unable to load groups",
        "StudentHUB couldn't load your course groups. Make sure the server is running and try again."
      );
    }
  }, [handleLogout]);

  useEffect(() => {
    const start = async () => {
      await loadSession();
      setLoading(false);
    };

    start();
  }, [loadSession]);

  useEffect(() => {
    if (authenticated) {
      loadGroups();
    }
  }, [authenticated, loadGroups]);

  const handleAuthenticated =
    useCallback(async () => {
      await loadSession();
      setScreen("home");
    }, [loadSession]);

  const openGroup = useCallback(
    (group: ChatGroup) => {
      setSelectedGroup(group);
      setScreen("chat");
    },
    []
  );

  const returnHome = useCallback(() => {
    setSelectedGroup(null);
    setScreen("home");
  }, []);

  const openProfile = useCallback(() => {
    setScreen("profile");
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#2457C5"
        />
      </SafeAreaView>
    );
  }

  if (!authenticated || !user) {
    return (
      <AuthScreen
        onAuthenticated={
          handleAuthenticated
        }
      />
    );
  }

  if (screen === "profile") {
    return (
      <ProfileScreen
        user={user}
        onBack={returnHome}
        onLogout={handleLogout}
      />
    );
  }

  if (
  screen === "chat" &&
  selectedGroup
) {
  return (
    <GroupChatScreen
      user={user}
      group={selectedGroup}
      onBack={returnHome}
      onLogout={handleLogout}
    />
  );
}

  return (
    <HomeScreen
      user={user}
      groups={groups}
      onSelectGroup={openGroup}
      onProfile={openProfile}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
  },
});
