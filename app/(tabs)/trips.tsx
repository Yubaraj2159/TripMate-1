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
import {
  MapPin,
  CalendarDays,
  Users,
  Plane,
  Wallet,
} from "lucide-react-native";

type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  friends: string;
  type: string;
};

export default function Trips() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, "users", user.uid, "trips");
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setTrips(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Trip, "id">),
        }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Loading trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Plane color="white" size={26} />
        <Text style={styles.headerTitle}>My Trips</Text>
      </View>

      {trips.length === 0 ? (
        <View style={styles.center}>
          <Text>No trips planned yet</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/planner")}
          >
            <Text style={styles.createButtonText}>Create Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              onBudget={() => router.push(`/budget/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

function TripCard({
  trip,
  onBudget,
}: {
  trip: Trip;
  onBudget: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.tripName}>{trip.name}</Text>
        <TouchableOpacity onPress={onBudget}>
          <Wallet size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>

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
        <Text style={styles.text}>{trip.friends || "No friends added"}</Text>
      </View>

      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>{trip.type}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#eef6ff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "700", marginLeft: 10 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  createButton: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
  },
  createButtonText: { color: "white", fontWeight: "600" },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripName: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  text: { marginLeft: 8, color: "#334155" },
  typeBadge: {
    marginTop: 10,
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  typeText: { color: "#1d4ed8", fontWeight: "600", fontSize: 13 },
});
