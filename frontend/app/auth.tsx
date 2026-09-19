import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BACKEND_URL } from "../constants/api";
import ProgramSelector from "../components/ProgramSelector";
import YearSelector from "../components/YearSelector";

type Props = {
  onAuthenticated: () => void;
};

export default function AuthScreen({
  onAuthenticated,
}: Props) {
  const [mode, setMode] =
    useState<"login" | "register">("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [program, setProgram] = useState("");

  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const submit = async () => {
    if (!username.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your username and password."
      );
      return;
    }

    if (
      isRegister &&
      (!name.trim() || !yearOfStudy || !program)
    ) {
      Alert.alert(
        "Complete your profile",
        "Please enter your name and select your year and program."
      );
      return;
    }

    if (isRegister && username.trim().length < 4) {
      Alert.alert(
        "Username too short",
        "Your username must be at least 4 characters."
      );
      return;
    }

    if (isRegister && password.length < 8) {
      Alert.alert(
        "Password too short",
        "Your password must be at least 8 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister
        ? `${BACKEND_URL}/api/auth/register`
        : `${BACKEND_URL}/api/auth/login`;

      const body = isRegister
        ? {
            username: username.trim(),
            password,
            name: name.trim(),
            yearofstudy: yearOfStudy,
            program,
          }
        : {
            username: username.trim(),
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          isRegister
            ? "Registration failed"
            : "Login failed",
          data.error || "Something went wrong."
        );
        return;
      }

      await AsyncStorage.multiSet([
        [
          "currentUser",
          JSON.stringify(data.user),
        ],
        ["authToken", data.token],
      ]);

      onAuthenticated();
    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      Alert.alert(
        "Connection error",
        "StudentHUB could not connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(
      mode === "login"
        ? "register"
        : "login"
    );

    setPassword("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <View style={styles.logoMark}>
              <Text style={styles.logoLetters}>
                SH
              </Text>
            </View>

            <Text style={styles.logo}>
              Student
              <Text style={styles.logoAccent}>
                HUB
              </Text>
            </Text>

            <Text style={styles.tagline}>
              Connect. Learn. Collaborate.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>
              {isRegister
                ? "Create your account"
                : "Welcome back"}
            </Text>

            <Text style={styles.description}>
              {isRegister
                ? "Join your courses and connect with other students."
                : "Sign in to continue to your student community."}
            </Text>

            {isRegister && (
              <>
                <Text style={styles.label}>
                  Display Name
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="e.g. Digvijay Vaghela"
                  placeholderTextColor="#8A94A6"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </>
            )}

            <Text style={styles.label}>
              Username
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#8A94A6"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <Text style={styles.label}>
              Password
            </Text>

            <TextInput
              style={styles.input}
              placeholder={
                isRegister
                  ? "At least 8 characters"
                  : "Enter your password"
              }
              placeholderTextColor="#8A94A6"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType={
                isRegister ? "next" : "done"
              }
              onSubmitEditing={
                isRegister ? undefined : submit
              }
            />

            {isRegister && (
              <>
                <Text style={styles.label}>
                  Year of Study
                </Text>

                <YearSelector
                  value={yearOfStudy}
                  onChange={setYearOfStudy}
                />

                <View style={styles.fieldGap} />

                <Text style={styles.label}>
                  Program
                </Text>

                <ProgramSelector
                  value={program}
                  onChange={setProgram}
                />
              </>
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                loading &&
                  styles.primaryButtonDisabled,
              ]}
              activeOpacity={0.85}
              onPress={submit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text
                  style={styles.primaryButtonText}
                >
                  {isRegister
                    ? "Create Account"
                    : "Log In"}
                </Text>
              )}
            </TouchableOpacity>

            {isRegister && (
              <Text style={styles.terms}>
                By creating an account, you agree
                to use StudentHUB respectfully as
                part of the student community.
              </Text>
            )}

            <View style={styles.switchRow}>
              <Text style={styles.switchPrompt}>
                {isRegister
                  ? "Already have an account?"
                  : "New to StudentHUB?"}
              </Text>

              <TouchableOpacity
                onPress={switchMode}
              >
                <Text style={styles.switchAction}>
                  {isRegister
                    ? " Log in"
                    : " Create account"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>
            StudentHUB • Student collaboration
            made simple
          </Text>
        </ScrollView>
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
    backgroundColor: "#F4F7FC",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 32,
  },

  brand: {
    alignItems: "center",
    marginBottom: 26,
  },

  logoMark: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#2457C5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,

    shadowColor: "#1D4ED8",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  logoLetters: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  logo: {
    fontSize: 31,
    fontWeight: "800",
    color: "#102A56",
    letterSpacing: -0.7,
  },

  logoAccent: {
    color: "#356AE6",
  },

  tagline: {
    marginTop: 6,
    fontSize: 14,
    color: "#738096",
    letterSpacing: 0.15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,

    borderWidth: 1,
    borderColor: "#E5EAF2",

    shadowColor: "#102A56",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  heading: {
    fontSize: 25,
    fontWeight: "800",
    color: "#14213D",
    letterSpacing: -0.4,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7A8699",
    marginTop: 6,
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#40516D",
    marginBottom: 8,
    marginTop: 3,
  },

  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#D9E0EA",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",

    paddingHorizontal: 16,

    fontSize: 16,
    color: "#14213D",

    marginBottom: 16,
  },

  fieldGap: {
    height: 16,
  },

  primaryButton: {
    minHeight: 55,
    borderRadius: 14,
    backgroundColor: "#2457C5",

    alignItems: "center",
    justifyContent: "center",

    marginTop: 24,

    shadowColor: "#2457C5",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  primaryButtonDisabled: {
    opacity: 0.65,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  terms: {
    textAlign: "center",
    color: "#929BAB",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 14,
    paddingHorizontal: 8,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  switchPrompt: {
    color: "#7A8699",
    fontSize: 14,
  },

  switchAction: {
    color: "#2457C5",
    fontSize: 14,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    color: "#A0A8B5",
    fontSize: 11,
    marginTop: 22,
  },
});
