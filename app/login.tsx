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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../services/authService";
import { router } from "expo-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await loginUser(email.trim(), password);
      router.replace("/");
    } catch (err: any) {
      alert(err.message);
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
            style={[styles.input, { marginRight: 40 }]} // space for eye icon
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 25,
    marginTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#EAEAEA",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    elevation: 3,
    position: "relative",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
  },
  button: {
    backgroundColor: "#3F51B5",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  link: {
    marginTop: 25,
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});
