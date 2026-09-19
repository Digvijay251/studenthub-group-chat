import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type User = {
  id: number;
  username: string;
  name: string;
  yearofstudy: string | number;
  program: string;
};

export type ChatGroup = {
  id: number;
  yearofstudy: number;
  course_code: string;
  course_name: string;
};

type Props = {
  user: User;
  groups: ChatGroup[];
  onSelectGroup: (group: ChatGroup) => void;
  onProfile: () => void;
};

const ordinalYear = (value: string | number) => {
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

export default function HomeScreen({
  user,
  groups,
  onSelectGroup,
  onProfile,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>SH</Text>
            </View>

            <Text style={styles.brand}>
              Student
              <Text style={styles.brandAccent}>
                HUB
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatar}
            onPress={onProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>
              {initials(user.name)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            STUDENT COMMUNITY
          </Text>

          <Text style={styles.greeting}>
            Welcome back,{"\n"}
            {user.name.split(" ")[0]}.
          </Text>

          <Text style={styles.heroText}>
            Jump back into your course communities
            and continue the conversation.
          </Text>

          <View style={styles.profileSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>
                PROGRAM
              </Text>

              <Text
                style={styles.summaryValue}
                numberOfLines={1}
              >
                {user.program}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.yearSummary}>
              <Text style={styles.summaryLabel}>
                YEAR
              </Text>

              <Text style={styles.summaryValue}>
                {ordinalYear(user.yearofstudy)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Your Groups
            </Text>

            <Text style={styles.sectionSubtitle}>
              {groups.length} course
              {groups.length === 1 ? "" : "s"} available
            </Text>
          </View>
        </View>

        {groups.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>◎</Text>

            <Text style={styles.emptyTitle}>
              No groups yet
            </Text>

            <Text style={styles.emptyText}>
              Your course communities will appear
              here when they're available.
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.courseCard}
              activeOpacity={0.8}
              onPress={() => onSelectGroup(group)}
            >
              <View style={styles.courseBadge}>
                <Text style={styles.courseBadgeText}>
                  {group.course_code
                    .split(" ")[0]
                    .slice(0, 4)}
                </Text>
              </View>

              <View style={styles.courseContent}>
                <Text style={styles.courseCode}>
                  {group.course_code}
                </Text>

                <Text
                  style={styles.courseName}
                  numberOfLines={2}
                >
                  {group.course_name}
                </Text>

                <View style={styles.courseMeta}>
                  <View style={styles.dot} />

                  <Text style={styles.courseMetaText}>
                    {ordinalYear(group.yearofstudy)}
                  </Text>

                  <Text style={styles.courseMetaDivider}>
                    •
                  </Text>

                  <Text style={styles.courseMetaText}>
                    Group Chat
                  </Text>
                </View>
              </View>

              <View style={styles.arrow}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={styles.navigation}>
        <View style={styles.navItem}>
          <Text style={styles.navIconActive}>⌂</Text>
          <Text style={styles.navTextActive}>
            Groups
          </Text>
        </View>

        <TouchableOpacity
          style={styles.navItem}
          onPress={onProfile}
        >
          <Text style={styles.navIcon}>○</Text>
          <Text style={styles.navText}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  content: {
    paddingHorizontal: 20,
  },

  header: {
    minHeight: 74,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#2457C5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  logoText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },

  brand: {
    color: "#102A56",
    fontWeight: "800",
    fontSize: 20,
  },

  brandAccent: {
    color: "#356AE6",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E4EBFB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CFDAF4",
  },

  avatarText: {
    color: "#2457C5",
    fontWeight: "800",
    fontSize: 14,
  },

  hero: {
    backgroundColor: "#173D87",
    borderRadius: 24,
    padding: 22,
    marginTop: 4,
    marginBottom: 28,
  },

  eyebrow: {
    color: "#AFC8FF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  greeting: {
    color: "#FFFFFF",
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "800",
    marginTop: 9,
    letterSpacing: -0.5,
  },

  heroText: {
    color: "#D6E2FA",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    maxWidth: "90%",
  },

  profileSummary: {
    flexDirection: "row",
    marginTop: 23,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.18)",
  },

  summaryItem: {
    flex: 1,
    paddingRight: 12,
  },

  yearSummary: {
    paddingLeft: 17,
    minWidth: 100,
  },

  divider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  summaryLabel: {
    color: "#9DB8ED",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  summaryValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#14213D",
    fontSize: 21,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: "#8A94A6",
    fontSize: 12,
    marginTop: 3,
  },

  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5EAF2",
  },

  courseBadge: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#EAF0FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  courseBadgeText: {
    color: "#2457C5",
    fontSize: 11,
    fontWeight: "900",
  },

  courseContent: {
    flex: 1,
  },

  courseCode: {
    color: "#356AE6",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  courseName: {
    color: "#17243C",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
    lineHeight: 19,
  },

  courseMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#46B980",
    marginRight: 6,
  },

  courseMetaText: {
    color: "#8A94A6",
    fontSize: 11,
  },

  courseMetaDivider: {
    color: "#CBD1DA",
    marginHorizontal: 6,
  },

  arrow: {
    marginLeft: 8,
  },

  arrowText: {
    color: "#A2ADBD",
    fontSize: 28,
    fontWeight: "300",
  },

  empty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5EAF2",
  },

  emptyIcon: {
    color: "#356AE6",
    fontSize: 30,
  },

  emptyTitle: {
    color: "#17243C",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
  },

  emptyText: {
    color: "#8A94A6",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },

  bottomSpace: {
    height: 25,
  },

  navigation: {
    height: 68,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5EAF2",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
  },

  navIconActive: {
    color: "#2457C5",
    fontSize: 21,
  },

  navIcon: {
    color: "#9AA5B5",
    fontSize: 21,
  },

  navTextActive: {
    color: "#2457C5",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },

  navText: {
    color: "#9AA5B5",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
});
