// app/signup.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const userData = { name, email, password };
    await AsyncStorage.setItem("user", JSON.stringify(userData));

    Alert.alert("Success", "Account created!");
    router.push("/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={["#4C6EF5", "#15AABF"]}
        style={styles.header}
      >
        <Animated.Text
          entering={FadeInUp.delay(200)}
          style={styles.title}
        >
          Create Account
        </Animated.Text>
      </LinearGradient>

      <View style={styles.form}>
        {/* Name */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.inputBox}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter your name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </Animated.View>

        {/* Email */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.inputBox}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </Animated.View>

        {/* Password */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.inputBox}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </Animated.View>

        {/* Signup Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "#1971C2", fontSize: 16 }}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 80,
    paddingBottom: 60,
    alignItems: "center",
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  form: {
    padding: 25,
  },
  inputBox: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: "#495057",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CED4DA",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4C6EF5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
