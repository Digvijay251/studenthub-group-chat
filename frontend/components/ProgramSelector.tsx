import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { PROGRAMS } from "../constants/programs";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function ProgramSelector({
  value,
  onChange,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return PROGRAMS;
    }

    return PROGRAMS.filter((program) =>
      program.toLowerCase().includes(query)
    );
  }, [search]);

  const close = () => {
    setVisible(false);
    setSearch("");
  };

  return (
    <>
      <TouchableOpacity
        style={styles.field}
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
      >
        <Text
          numberOfLines={1}
          style={
            value
              ? styles.value
              : styles.placeholder
          }
        >
          {value || "Search and select program"}
        </Text>

        <Text style={styles.searchIcon}>⌕</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={close}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                Select Program
              </Text>

              <Text style={styles.subtitle}>
                Find your academic program
              </Text>
            </View>

            <Pressable
              style={styles.close}
              onPress={close}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <Text style={styles.searchSymbol}>
              ⌕
            </Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search programs..."
              placeholderTextColor="#8A94A6"
              value={search}
              onChangeText={setSearch}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
            />

            {!!search && (
              <TouchableOpacity
                onPress={() => setSearch("")}
              >
                <Text style={styles.clear}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredPrograms}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.listContent
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>
                  No programs found
                </Text>

                <Text style={styles.emptyText}>
                  Try a different search.
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const selected = item === value;

              return (
                <TouchableOpacity
                  style={[
                    styles.program,
                    selected &&
                      styles.selectedProgram,
                  ]}
                  onPress={() => {
                    onChange(item);
                    close();
                  }}
                >
                  <View style={styles.programIcon}>
                    <Text
                      style={styles.programInitial}
                    >
                      {item.charAt(0)}
                    </Text>
                  </View>

                  <Text
                    style={styles.programName}
                  >
                    {item}
                  </Text>

                  {selected && (
                    <Text style={styles.check}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#D9E0EA",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  value: {
    flex: 1,
    fontSize: 16,
    color: "#14213D",
  },

  placeholder: {
    flex: 1,
    fontSize: 16,
    color: "#8A94A6",
  },

  searchIcon: {
    fontSize: 22,
    color: "#64748B",
  },

  modal: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#102A56",
  },

  subtitle: {
    fontSize: 14,
    color: "#7A8699",
    marginTop: 4,
  },

  close: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E8EDF5",
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 27,
    color: "#40516D",
    lineHeight: 29,
  },

  searchContainer: {
    marginHorizontal: 18,
    marginBottom: 14,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE3EC",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  searchSymbol: {
    fontSize: 21,
    color: "#64748B",
    marginRight: 9,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#17243C",
    paddingVertical: 12,
  },

  clear: {
    fontSize: 23,
    color: "#8A94A6",
    paddingLeft: 10,
  },

  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  program: {
    minHeight: 62,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6EAF0",
    marginBottom: 9,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedProgram: {
    borderColor: "#356AE6",
    backgroundColor: "#F4F7FF",
  },

  programIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#EAF0FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  programInitial: {
    color: "#356AE6",
    fontSize: 15,
    fontWeight: "800",
  },

  programName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#17243C",
  },

  check: {
    color: "#356AE6",
    fontWeight: "800",
    fontSize: 19,
  },

  empty: {
    alignItems: "center",
    paddingTop: 60,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#17243C",
  },

  emptyText: {
    color: "#7A8699",
    marginTop: 5,
  },
});
