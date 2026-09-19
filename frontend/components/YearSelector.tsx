import React, { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const YEARS = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
  { value: "5", label: "5th+ Year" },
];

export default function YearSelector({
  value,
  onChange,
}: Props) {
  const [visible, setVisible] = useState(false);

  const selected = YEARS.find(
    (year) => year.value === value
  );

  return (
    <>
      <TouchableOpacity
        style={styles.field}
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
      >
        <Text
          style={
            selected
              ? styles.value
              : styles.placeholder
          }
        >
          {selected?.label || "Select year"}
        </Text>

        <Text style={styles.chevron}>⌄</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                Year of Study
              </Text>

              <Text style={styles.modalSubtitle}>
                Select your current year
              </Text>
            </View>

            <Pressable
              style={styles.close}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.options}>
            {YEARS.map((year) => {
              const active =
                year.value === value;

              return (
                <TouchableOpacity
                  key={year.value}
                  style={[
                    styles.option,
                    active && styles.activeOption,
                  ]}
                  onPress={() => {
                    onChange(year.value);
                    setVisible(false);
                  }}
                >
                  <View
                    style={[
                      styles.yearIcon,
                      active &&
                        styles.activeYearIcon,
                    ]}
                  >
                    <Text
                      style={[
                        styles.yearNumber,
                        active &&
                          styles.activeYearNumber,
                      ]}
                    >
                      {year.value === "5"
                        ? "5+"
                        : year.value}
                    </Text>
                  </View>

                  <Text style={styles.optionText}>
                    {year.label}
                  </Text>

                  {active && (
                    <Text style={styles.check}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
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
    justifyContent: "space-between",
  },

  value: {
    fontSize: 16,
    color: "#14213D",
  },

  placeholder: {
    fontSize: 16,
    color: "#8A94A6",
  },

  chevron: {
    fontSize: 22,
    color: "#64748B",
  },

  modal: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },

  modalHeader: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#102A56",
  },

  modalSubtitle: {
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

  options: {
    paddingHorizontal: 18,
  },

  option: {
    minHeight: 68,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6EAF0",
  },

  activeOption: {
    borderColor: "#356AE6",
    backgroundColor: "#F4F7FF",
  },

  yearIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  activeYearIcon: {
    backgroundColor: "#356AE6",
  },

  yearNumber: {
    fontWeight: "800",
    color: "#40516D",
  },

  activeYearNumber: {
    color: "#FFFFFF",
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#17243C",
  },

  check: {
    color: "#356AE6",
    fontSize: 19,
    fontWeight: "800",
  },
});
