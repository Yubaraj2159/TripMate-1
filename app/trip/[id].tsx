import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react-native";

interface Trip {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  members: number;
  budget?: number;
}

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        const docRef = doc(db, "trips", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setTrip(snapshot.data() as Trip);
        } else {
          setTrip(null);
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{trip.name}</Text>
      </View>

      {/* Trip Info */}
      <View style={styles.card}>
        <View style={styles.row}>
          <MapPin size={18} />
          <Text style={styles.text}>{trip.destination}</Text>
        </View>

        <View style={styles.row}>
          <CalendarDays size={18} />
          <Text style={styles.text}>
            {trip.startDate} → {trip.endDate}
          </Text>
        </View>

        <View style={styles.row}>
          <Users size={18} />
          <Text style={styles.text}>{trip.members} members</Text>
        </View>

        {trip.budget !== undefined && (
          <Text style={styles.budget}>Budget: NPR {trip.budget}</Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/budget/${id}`)}
        >
          <Text style={styles.actionText}>Manage Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/planner/${id}`)}
        >
          <Text style={styles.actionText}>Open Planner</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "white",
    fontSize: 16,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#1e293b",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    color: "white",
    fontSize: 15,
  },
  budget: {
    marginTop: 8,
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
