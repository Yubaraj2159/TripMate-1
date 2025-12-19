// app/profile.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, User, LogOut } from "lucide-react-native";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Image
            source={{
              uri: user?.photoURL || "https://i.pravatar.cc/300",
            }}
            style={styles.avatar}
          />

          <Text style={styles.name}>{user?.displayName || "TripMate User"}</Text>

          <View style={styles.infoRow}>
            <User size={18} color="#555" />
            <Text style={styles.infoText}>User ID: {user?.uid}</Text>
          </View>

          <View style={styles.infoRow}>
            <Mail size={18} color="#555" />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {user?.emailVerified ? "Email Verified" : "Email Not Verified"}
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#222",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  infoText: {
    marginLeft: 8,
    color: "#555",
    fontSize: 14,
  },
  badge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#e0f2fe",
    borderRadius: 20,
  },
  badgeText: {
    color: "#0369a1",
    fontSize: 13,
    fontWeight: "600",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 24,
    width: "100%",
  },
  logoutText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
});
