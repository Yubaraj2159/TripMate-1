// app/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { loginUser } from "../services/authService";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(email.trim(), password);
      router.replace("/");  // redirect to home
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 100 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        autoCapitalize="none"
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
          backgroundColor: "blue",
          padding: 14,
          borderRadius: 8,
          marginTop: 10,
        }}
        onPress={handleLogin}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={{ marginTop: 20, color: "blue" }}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
