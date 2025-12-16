// app/login.tsx
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
import { loginUser, resetPassword } from "../services/authService";
import { router } from "expo-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 8,
  },
  forgotText: {
    color: "#fff",
    textAlign: "right",
    marginBottom: 20,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#4E54C8",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const handleLogin = async () => {
    try {
      await loginUser(email.trim(), password);
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Login Failed", err.message);
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
    } catch (err: any) {
      Alert.alert("Error", err.message);
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
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to continue planning your trips</Text>

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <Mail size={20} color="#555" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Lock size={20} color="#555" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry={!showPassword}
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

        {/* Signup Link */}
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
