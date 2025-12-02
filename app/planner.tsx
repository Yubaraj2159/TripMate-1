// app/planner.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MapPin,
  UserPlus,
  PlaneTakeoff,
  Image as ImageIcon,
} from "lucide-react-native";

const UNSPLASH_ACCESS_KEY = "your_unsplash_key_here"; // <-- replace

type Trip = {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  friends: string;
  type: string;
};

export default function Planner(): JSX.Element {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip>({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    friends: "",
    type: "",
  });
  const [imageUrl, setImageUrl] = useState<string>("");
  const fetchTimeout = useRef<number | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (fetchTimeout.current) {
        clearTimeout(fetchTimeout.current);
      }
    };
  }, []);

  const updateField = (field: keyof Trip, value: string) => {
    setTrip((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!trip.name || !trip.destination || !trip.startDate || !trip.endDate || !trip.type) {
      Alert.alert("Missing info", "Please fill all required fields.");
      return;
    }

    try {
      const existingRaw = await AsyncStorage.getItem("plannedTrips");
      const existing: Trip[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(trip);
      await AsyncStorage.setItem("plannedTrips", JSON.stringify(existing));

      Alert.alert("Success", "🎉 Trip successfully created!", [
        {
          text: "View Trips",
          onPress: () => {
            // ensure the route exists in your app: maybe "/Trips" or "/trips"
            router.push("/Trips");
          },
        },
      ]);
    } catch (err) {
      console.error("AsyncStorage error:", err);
      Alert.alert("Error", "Could not save trip. Try again.");
    }
  };

  // Debounced Unsplash search
  useEffect(() => {
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);

    if (!trip.destination.trim()) {
      setImageUrl("");
      return;
    }

    fetchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            trip.destination
          )}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`
        );
        const data = await res.json();

        if (!isMounted.current) return;

        if (data && Array.isArray(data.results) && data.results.length > 0) {
          setImageUrl(data.results[0].urls.regular);
        } else {
          setImageUrl("");
        }
      } catch (e) {
        console.warn("Image fetch failed:", e);
        if (isMounted.current) setImageUrl("");
      }
    }, 500);

    // cleanup handled by outer effect/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.destination]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <PlaneTakeoff color="#2563eb" size={28} />
        <Text style={styles.title}>Plan Your Trip</Text>
      </View>

      <Input label="Trip Name" value={trip.name} onChange={(t) => updateField("name", t)} />

      <SelectTripType value={trip.type} onChange={(v) => updateField("type", v)} />

      <Input
        label="Destination"
        icon={<MapPin color="#555" size={18} />}
        value={trip.destination}
        onChange={(t) => updateField("destination", t)}
      />

      <Input
        label="Start Date (YYYY-MM-DD)"
        value={trip.startDate}
        onChange={(t) => updateField("startDate", t)}
        placeholder="2025-12-20"
      />
      <Input
        label="End Date (YYYY-MM-DD)"
        value={trip.endDate}
        onChange={(t) => updateField("endDate", t)}
        placeholder="2025-12-25"
      />

      <Input
        label="Invite Friends (Optional)"
        icon={<UserPlus color="#555" size={18} />}
        value={trip.friends}
        onChange={(t) => updateField("friends", t)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Trip ✨</Text>
      </TouchableOpacity>

      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Trip Preview</Text>
        <Preview label="Type" value={trip.type} />
        <Preview label="Destination" value={trip.destination} />
        <Preview label="Dates" value={`${trip.startDate || "—"} → ${trip.endDate || "—"}`} />
        <Preview label="Friends" value={trip.friends || "—"} />

        <View style={styles.imageBox}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imageFallback}>
              <ImageIcon color="#999" size={28} />
              <Text style={{ color: "#666", marginTop: 6 }}>No image preview</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------- Small components ---------- */

function Input({
  label,
  value,
  onChange,
  icon,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder ?? label}
          placeholderTextColor="#888"
        />
      </View>
    </View>
  );
}

function SelectTripType({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const types = [
    "Road Trip",
    "Beach Vacation",
    "City Escape",
    "Hiking Adventure",
    "International – Southeast Asia",
    "International – Europe",
  ];

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>Trip Type</Text>
      <View>
        {types.map((t) => {
          const selected = t === value;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => onChange(t)}
              style={[
                styles.typeBtn,
                selected ? { backgroundColor: "#bfdbfe", borderColor: "#93c5fd" } : null,
              ]}
            >
              <Text>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function Preview({ label, value }: { label: string; value: string }) {
  return (
    <Text style={{ fontSize: 14, marginBottom: 6 }}>
      <Text style={{ fontWeight: "600" }}>{label}: </Text>
      {value || "—"}
    </Text>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#eef6ff",
    flexGrow: 1,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: "700", color: "#2563eb", marginLeft: 8 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  textInput: { flex: 1, paddingVertical: 10, fontSize: 15 },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: { color: "white", textAlign: "center", fontSize: 17, fontWeight: "600" },
  previewCard: {
    marginTop: 22,
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  previewTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#0f172a" },
  imageBox: {
    height: 150,
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  image: { width: "100%", height: "100%" },
  imageFallback: { flex: 1, justifyContent: "center", alignItems: "center" },
  typeBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
