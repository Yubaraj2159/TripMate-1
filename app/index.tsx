// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Stack } from "expo-router";
import { Users, PartyPopper } from "lucide-react-native";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";

export default function Index() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/planner"); // Navigates to planner screen
  };

  return (
    <>
      {/* Hide the default Expo Router header */}
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#FEF9C3", "#FFEDD5", "#DBEAFE"]}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Navbar */}
        <View style={styles.navbar}>
          <View style={styles.brand}>
            <Users size={28} color="#1D4ED8" />
            <Text style={styles.brandText}>ReunionTrips</Text>
          </View>

          <TouchableOpacity onPress={handleStart} style={styles.navButton}>
            <Text style={styles.navButtonText}>Plan Now</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Animated.Text
            entering={FadeInUp.duration(800)}
            style={styles.heroTitle}
          >
            Reunite. Relive. Rediscover.
          </Animated.Text>

          <Animated.Text
            entering={FadeIn.delay(300).duration(900)}
            style={styles.heroSubtitle}
          >
            From childhood laughter to grown-up adventures — plan the next trip
            with those who matter most.
          </Animated.Text>

          <TouchableOpacity activeOpacity={0.8} onPress={handleStart}>
            <Animated.View
              entering={FadeInUp.delay(400)}
              style={styles.startButton}
            >
              <PartyPopper size={20} color="white" />
              <Text style={styles.startButtonText}>Start Planning</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Background circles */}
        <View style={styles.bgCirclePink} />
        <View style={styles.bgCircleBlue} />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            “True friendship isn’t about being inseparable — it’s about being
            separated and nothing changes.” 💛
          </Text>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  navbar: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(255,255,255,0.7)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  brandText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1D4ED8",
  },

  navButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  navButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  heroTitle: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 10,
  },

  heroSubtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#4B5563",
    marginBottom: 20,
    maxWidth: 320,
  },

  startButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
  },

  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  bgCirclePink: {
    position: "absolute",
    top: 120,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(244, 114, 182, 0.35)",
  },

  bgCircleBlue: {
    position: "absolute",
    bottom: 120,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(147, 197, 253, 0.35)",
  },

  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  footerText: {
    fontSize: 12,
    textAlign: "center",
    color: "#6B7280",
  },
});
