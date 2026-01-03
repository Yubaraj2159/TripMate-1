import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { loginUser, resetPassword } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter email and password.");
      return;
    }

    try {
      await loginUser(email.trim(), password);
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Email Required", "Please enter your email first.");
      return;
    }

    try {
      setSendingReset(true);
      await resetPassword(email.trim());
      Alert.alert(
        "Reset Email Sent",
        "A password reset link has been sent to your email."
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <LinearGradient colors={["#4E54C8", "#8F94FB"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Login to continue planning your trips
        </Text>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Mail size={20} color="#555" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Lock size={20} color="#555" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { marginRight: 40 }]}
          />

          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color="#555" />
            ) : (
              <Eye size={20} color="#555" />
            )}
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          disabled={sendingReset}
        >
          <Text style={styles.forgotText}>
            {sendingReset ? "Sending reset email..." : "Forgot Password?"}
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Signup */}
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.link}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#E0E7FF",
    textAlign: "center",
    marginBottom: 28,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 52,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111827",
  },

  eyeIcon: {
    padding: 8,
  },

  forgotText: {
    color: "#fff",
    textAlign: "right",
    marginBottom: 22,
    fontSize: 14,
    textDecorationLine: "underline",
  },

  button: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },

  buttonText: {
    color: "#4E54C8",
    fontSize: 16,
    fontWeight: "700",
  },

  link: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
