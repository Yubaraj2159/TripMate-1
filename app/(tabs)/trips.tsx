
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { MapPin, CalendarDays, Users, Plane } from "lucide-react-native";

type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  friends: string;
  type: string;
};

export default function Trips(): JSX.Element {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const tripsRef = collection(db, "users", user.uid, "trips");
    const q = query(tripsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripList: Trip[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Trip, "id">),
      }));

      setTrips(tripList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Loading trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Plane color="white" size={26} />
        <Text style={styles.headerTitle}>My Trips</Text>
      </View>

      {trips.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No trips planned yet</Text>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/planner")}
          >
            <Text style={styles.createButtonText}>Create Your First Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => <TripCard trip={item} />}
        />
      )}
    </View>
  );
}

/* ---------- Trip Card ---------- */

function TripCard({ trip }: { trip: Trip }) {
  return (
    <View style={styles.card}>
      <Text style={styles.tripName}>{trip.name}</Text>

      <View style={styles.row}>
        <MapPin size={16} color="#2563eb" />
        <Text style={styles.text}>{trip.destination}</Text>
      </View>

      <View style={styles.row}>
        <CalendarDays size={16} color="#2563eb" />
        <Text style={styles.text}>
          {trip.startDate} → {trip.endDate}
        </Text>
      </View>

      <View style={styles.row}>
        <Users size={16} color="#2563eb" />
        <Text style={styles.text}>
          {trip.friends || "No friends added"}
        </Text>
      </View>

      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>{trip.type}</Text>
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef6ff",
    padding: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },

  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 14,
  },

  createButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
  },

  tripName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  text: {
    marginLeft: 8,
    fontSize: 15,
    color: "#334155",
  },

  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dbeafe",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginTop: 10,
  },

  typeText: {
    color: "#1d4ed8",
    fontSize: 13,
    fontWeight: "600",
  },
});
