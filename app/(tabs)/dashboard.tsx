import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Map, Wallet } from "lucide-react-native";
import { router } from "expo-router";

export default function Dashboard() {
  return (
    <LinearGradient
      colors={["#4E54C8", "#8F94FB"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Text style={styles.appName}>TripMate</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>Welcome back 👋</Text>
          <Text style={styles.subtitle}>
            Plan trips, manage budgets, and relive memories together.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.cardGrid}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(tabs)/planner")}
          >
            <Calendar size={28} color="#4E54C8" />
            <Text style={styles.cardTitle}>Planner</Text>
            <Text style={styles.cardDesc}>Organize your trip schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(tabs)/trips")}
          >
            <Map size={28} color="#4E54C8" />
            <Text style={styles.cardTitle}>Trips</Text>
            <Text style={styles.cardDesc}>View all your journeys</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(tabs)/budget")}
          >
            <Wallet size={28} color="#4E54C8" />
            <Text style={styles.cardTitle}>Budget</Text>
            <Text style={styles.cardDesc}>Split and track expenses</Text>
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

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },

  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },

  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  welcomeBox: {
    marginTop: 20,
    marginBottom: 30,
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#E0E7FF",
    lineHeight: 20,
  },

  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  cardTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  cardDesc: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
});
