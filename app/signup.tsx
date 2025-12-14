// app/signup.tsx
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
import { registerUser } from "../services/authService";
import { router } from "expo-router";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react-native";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await registerUser(
        fullName.trim(),
        email.trim(),
        password
      );
      router.replace("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <LinearGradient colors={["#8F94FB", "#4E54C8"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up to start planning amazing trips
        </Text>

        {/* Full Name Field */}
        <View style={styles.inputContainer}>
          <User size={20} color="#555" />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#777"
            onChangeText={setFullName}
            style={styles.input}
          />
        </View>

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <Mail size={20} color="#555" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
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

        {/* Create Account Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Redirect */}
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 25, marginTop: 80 },
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
