import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Stack } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function Index() {
  const router = useRouter();

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
            entering={FadeInUp.delay(200).duration(800)}
            style={styles.heroTitle}
          >
            Reunite. Relive. Rediscover.
          </Animated.Text>

          <Animated.Text
            entering={FadeInUp.delay(350).duration(800)}
            style={styles.heroSubtitle}
          >
            From childhood memories to adult adventures — plan the next trip
            with the people who matter most.
          </Animated.Text>

          {/* Feature Highlights */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(800)}
            style={styles.featuresRow}
          >
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🗺️</Text>
              <Text style={styles.featureText}>Plan Trips</Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💰</Text>
              <Text style={styles.featureText}>Split Budget</Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📅</Text>
              <Text style={styles.featureText}>Organize Plans</Text>
            </View>
          </Animated.View>

          {/* Sign In CTA */}
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.secondaryAction}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>

          {/* Trust Line */}
          <Text style={styles.trustText}>
            Built for friends who travel together
          </Text>
        </View>

        {/* Background Decorations */}
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
    marginTop: 40,
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
    color: "#e5e7eb",
    textAlign: "center",
    marginBottom: 28,
    maxWidth: 320,
    lineHeight: 22,
  },

  featuresRow: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 26,
  },

  featureItem: {
    alignItems: "center",
  },

  featureIcon: {
    fontSize: 22,
    marginBottom: 6,
  },

  featureText: {
    color: "#f3f4f6",
    fontSize: 13,
    fontWeight: "500",
  },

  secondaryAction: {
    marginTop: 18,
    color: "#d1d5db",
    fontSize: 14,
    textDecorationLine: "underline",
  },

  trustText: {
    marginTop: 22,
    color: "#c7d2fe",
    fontSize: 13,
    opacity: 0.9,
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
