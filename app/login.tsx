// app/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { User, Lock } from "lucide-react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter both email and password.");
      return;
    }

    try {
      const usersRaw = await AsyncStorage.getItem("users");
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        await AsyncStorage.setItem("loggedInUser", JSON.stringify(user));
        Alert.alert("Success", `Welcome back, ${user.name}!`, [
          { text: "Go to Planner", onPress: () => router.push("/planner") },
        ]);
      } else {
        Alert.alert("Error", "Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>TripMate Login</Text>
      <Text style={styles.subtitle}>Plan and manage your trips easily ✨</Text>

      <View style={styles.inputWrapper}>
        <User color="#2563eb" size={20} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Lock color="#2563eb" size={20} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.signUpText}>
          Don't have an account? <Text style={{ color: "#2563eb" }}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#eef6ff",
    padding: 20,
    justifyContent: "center",
  },
  title: { fontSize: 28, fontWeight: "700", color: "#2563eb", marginBottom: 6 },
  subtitle: { fontSize: 16, color: "#334155", marginBottom: 24 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0f172a",
    marginLeft: 8,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: { color: "white", fontSize: 17, fontWeight: "600", textAlign: "center" },

  signUpText: { color: "#334155", textAlign: "center", fontSize: 15 },
})
