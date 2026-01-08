import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import {
  MapPin,
  CalendarDays,
  Users,
  Plane,
  Wallet,
  Pencil,
  Trash2,
} from "lucide-react-native";

type Trip = {
  name: string;
  destination: string;
  startDate: any;
  endDate: any;
  friends?: string;
  type: string;
};

export default function TripDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user || !id) return;

    const ref = doc(db, "users", user.uid, "trips", id);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setTrip(null);
        } else {
          setTrip(snap.data() as Trip);
        }
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [id, user?.uid]);

  const parseDate = (d: any) => (d?.toDate ? d.toDate() : new Date(d));

  const getStatus = () => {
    if (!trip) return "";
    const now = new Date();
    const start = parseDate(trip.startDate);
    const end = parseDate(trip.endDate);

    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Ongoing";
  };

  const deleteTrip = async () => {
    if (!user || !id) return;

    Alert.alert("Delete Trip", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "users", user.uid, "trips", id));
          router.replace("/trips");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Loading trip...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          Trip not found
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#2563eb", marginTop: 10 }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Plane color="white" size={26} />
        <Text style={styles.headerTitle}>{trip.name}</Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{getStatus()}</Text>
      </View>

      <InfoRow icon={<MapPin size={18} color="#2563eb" />} text={trip.destination} />
      <InfoRow
        icon={<CalendarDays size={18} color="#2563eb" />}
        text={`${parseDate(trip.startDate).toDateString()} → ${parseDate(
          trip.endDate
        ).toDateString()}`}
      />
      <InfoRow
        icon={<Users size={18} color="#2563eb" />}
        text={trip.friends || "No friends added"}
      />

      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>{trip.type}</Text>
      </View>

      <TouchableOpacity
        style={styles.action}
        onPress={() => router.push(`/budget/${id}`)}
      >
        <Wallet size={18} color="white" />
        <Text style={styles.actionText}>View Budget</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={() => router.push(`/planner?id=${id}`)}
      >
        <Pencil size={18} color="white" />
        <Text style={styles.actionText}>Edit Trip</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.action, { backgroundColor: "#dc2626" }]}
        onPress={deleteTrip}
      >
        <Trash2 size={18} color="white" />
        <Text style={styles.actionText}>Delete Trip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <View style={styles.row}>
      {icon}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eef6ff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeText: {
    color: "#1d4ed8",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  text: {
    marginLeft: 10,
    color: "#334155",
  },
  typeBadge: {
    backgroundColor: "#bfdbfe",
    padding: 8,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  typeText: {
    color: "#1e40af",
    fontWeight: "600",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
  },
});
