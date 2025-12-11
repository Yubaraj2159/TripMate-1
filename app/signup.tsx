// app/signup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { registerUser } from "../services/authService";
import { router } from "expo-router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await registerUser(email.trim(), password);
      router.replace("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 100 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign Up</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "green",
          padding: 14,
          borderRadius: 8,
          marginTop: 10,
        }}
        onPress={handleSignup}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={{ marginTop: 20, color: "blue" }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
