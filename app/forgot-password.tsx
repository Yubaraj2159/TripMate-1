import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { resetPassword } from "../services/authService";
import { router } from "expo-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    try {
      setLoading(true);
      await resetPassword(email.trim());
      Alert.alert(
        "Email Sent",
        "Password reset link has been sent to your email."
      );
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 12,
      padding: 24,
      width: "100%",
      maxWidth: 320,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: "#ccc",
      marginBottom: 20,
      textAlign: "center",
    },
    input: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
      color: "#fff",
      fontSize: 14,
    },
    button: {
      backgroundColor: "#ff6b6b",
      borderRadius: 8,
      paddingVertical: 12,
      marginBottom: 16,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    backText: {
      color: "#87ceeb",
      fontSize: 14,
      textAlign: "center",
      textDecorationLine: "underline",
    },
  });

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email to receive a reset link
        </Text>

        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
