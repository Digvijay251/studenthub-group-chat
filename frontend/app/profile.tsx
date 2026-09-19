import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { User } from "./home";

type Props = {
  user: User;
  onBack: () => void;
  onLogout: () => void;
};

const yearLabel = (value: string | number) => {
  const year = Number(value);

  if (year === 1) return "1st Year";
  if (year === 2) return "2nd Year";
  if (year === 3) return "3rd Year";
  if (year === 4) return "4th Year";

  return `${year}th Year`;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function ProfileScreen({
  user,
  onBack,
  onLogout,
}: Props) {
  const confirmLogout = () => {
    Alert.alert(
      "Log out?",
      "You'll need to sign in again to access your course groups.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: onLogout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Profile
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initials(user.name)}
            </Text>
          </View>

          <Text style={styles.name}>
            {user.name}
          </Text>

          <Text style={styles.username}>
            @{user.username}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              StudentHUB Member
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          ACADEMIC PROFILE
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>P</Text>
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>
                Program
              </Text>

              <Text style={styles.rowValue}>
                {user.program}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>Y</Text>
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>
                Year of Study
              </Text>

              <Text style={styles.rowValue}>
                {yearLabel(user.yearofstudy)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          ACCOUNT
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>@</Text>
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>
                Username
              </Text>

              <Text style={styles.rowValue}>
                {user.username}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={confirmLogout}
        >
          <Text style={styles.logoutText}>
            Log Out
          </Text>
        </TouchableOpacity>

        <Text style={styles.version}>
          StudentHUB • Portfolio Edition
        </Text>
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={onBack}
        >
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navText}>
            Groups
          </Text>
        </TouchableOpacity>

        <View style={styles.navItem}>
          <Text style={styles.navIconActive}>
            ○
          </Text>
          <Text style={styles.navTextActive}>
            Profile
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF2",
  },

  backButton: {
    width: 40,
  },

  back: {
    fontSize: 32,
    color: "#2457C5",
    lineHeight: 34,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#17243C",
  },

  headerSpacer: {
    width: 40,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 30,
  },

  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#2457C5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2457C5",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },

  name: {
    color: "#14213D",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 15,
  },

  username: {
    color: "#8A94A6",
    fontSize: 14,
    marginTop: 4,
  },

  badge: {
    marginTop: 12,
    backgroundColor: "#E8F0FF",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },

  badgeText: {
    color: "#2457C5",
    fontSize: 11,
    fontWeight: "800",
  },

  sectionLabel: {
    color: "#8A94A6",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginLeft: 4,
    marginBottom: 9,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5EAF2",
    marginBottom: 24,
    overflow: "hidden",
  },

  row: {
    minHeight: 75,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EAF0FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  iconText: {
    color: "#2457C5",
    fontSize: 14,
    fontWeight: "900",
  },

  rowContent: {
    flex: 1,
  },

  rowLabel: {
    color: "#8A94A6",
    fontSize: 11,
    fontWeight: "600",
  },

  rowValue: {
    color: "#17243C",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },

  separator: {
    height: 1,
    backgroundColor: "#EEF1F5",
    marginLeft: 68,
  },

  logoutButton: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: "#FFF1F1",
    borderWidth: 1,
    borderColor: "#FFDADA",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  logoutText: {
    color: "#D64545",
    fontSize: 15,
    fontWeight: "800",
  },

  version: {
    color: "#A2ABBA",
    textAlign: "center",
    fontSize: 10,
    marginTop: 20,
  },

  navigation: {
    height: 68,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5EAF2",
    flexDirection: "row",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    color: "#9AA5B5",
    fontSize: 21,
  },

  navIconActive: {
    color: "#2457C5",
    fontSize: 21,
  },

  navText: {
    color: "#9AA5B5",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },

  navTextActive: {
    color: "#2457C5",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
});
