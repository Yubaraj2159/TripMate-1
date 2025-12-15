import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Stack } from "expo-router";
import { PartyPopper } from "lucide-react-native";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";
import { auth } from "../config/firebaseConfig"; // Make sure you have firebase configured
import { onAuthStateChanged } from "firebase/auth";

export default function Index() {
  const router = useRouter();

  const handleStart = () => {
    const user = auth.currentUser;
    if (user) {
      router.push("/planner");
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Animated.Text
            entering={FadeInUp.delay(200).duration(900)}
            style={styles.heroTitle}
          >
            Reunite. Relive. Rediscover.
          </Animated.Text>

          <Animated.Text
            entering={FadeInUp.delay(400).duration(900)}
            style={styles.heroSubtitle}
          >
            From childhood memories to adult adventures — plan the next trip
            with the people who matter most.
          </Animated.Text>

          <TouchableOpacity activeOpacity={0.8} onPress={handleStart}>
            <Animated.View
              entering={FadeInUp.delay(600)}
              style={styles.planButton}
            >
              <PartyPopper size={22} color="white" />
              <Text style={styles.planButtonText}>Start Planning</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Floating Background Circles */}
        <Animated.View
          entering={FadeInUp.delay(800)}
          style={styles.bgCirclePurple}
        />
        <Animated.View
          entering={FadeInUp.delay(1000)}
          style={styles.bgCirclePink}
        />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },

  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    marginTop: 50,
  },

  heroTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },

  heroSubtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 320,
  },

  planButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    gap: 10,
  },

  planButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  bgCirclePurple: {
    position: "absolute",
    top: -60,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(128,0,128,0.3)",
  },

  bgCirclePink: {
    position: "absolute",
    bottom: -80,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,105,180,0.3)",
  },
});
