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
import { Picker } from "@react-native-picker/picker";
import { MapPin, UserPlus, PlaneTakeoff, Image as ImageIcon } from "lucide-react-native";

const UNSPLASH_ACCESS_KEY = "your_unsplash_key_here";

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
      if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
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
        { text: "View Trips", onPress: () => router.push("/trips") },
      ]);
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", "Could not save trip.");
    }
  };

  // Unsplash Image Fetch
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

        if (data.results?.length > 0) {
          setImageUrl(data.results[0].urls.regular);
        } else {
          setImageUrl("");
        }
      } catch (e) {
        if (isMounted.current) setImageUrl("");
      }
    }, 500);
  }, [trip.destination]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <PlaneTakeoff color="white" size={28} />
        <Text style={styles.headerTitle}>Plan Your Trip</Text>
      </View>

      <Input label="Trip Name" value={trip.name} onChange={(v) => updateField("name", v)} />

      <TripTypePicker value={trip.type} onChange={(v) => updateField("type", v)} />

      <Input
        label="Destination"
        icon={<MapPin color="#2563eb" size={18} />}
        value={trip.destination}
        onChange={(v) => updateField("destination", v)}
      />

      <Input
        label="Start Date (YYYY-MM-DD)"
        value={trip.startDate}
        onChange={(v) => updateField("startDate", v)}
        placeholder="2025-12-20"
      />

      <Input
        label="End Date (YYYY-MM-DD)"
        value={trip.endDate}
        onChange={(v) => updateField("endDate", v)}
        placeholder="2025-12-25"
      />

      <Input
        label="Invite Friends (Optional)"
        icon={<UserPlus color="#2563eb" size={18} />}
        value={trip.friends}
        onChange={(v) => updateField("friends", v)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Trip ✨</Text>
      </TouchableOpacity>

      {/* Preview Box */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Trip Preview</Text>
        <Preview label="Type" value={trip.type} />
        <Preview label="Destination" value={trip.destination} />
        <Preview label="Dates" value={`${trip.startDate || "—"} → ${trip.endDate || "—"}`} />
        <Preview label="Friends" value={trip.friends || "—"} />

        <View style={styles.imageBox}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
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

/* ---------- Trip Type Dropdown (Picker) ---------- */

function TripTypePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>Trip Type</Text>

      <View style={styles.pickerWrapper}>
        <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
          <Picker.Item label="Select a trip type..." value="" />
          <Picker.Item label="Road Trip" value="Road Trip" />
          <Picker.Item label="Beach Vacation" value="Beach Vacation" />
          <Picker.Item label="City Escape" value="City Escape" />
          <Picker.Item label="Hiking Adventure" value="Hiking Adventure" />
          <Picker.Item
            label="International – Southeast Asia"
            value="International – Southeast Asia"
          />
          <Picker.Item
            label="International – Europe"
            value="International – Europe"
          />
        </Picker>
      </View>
    </View>
  );
}

/* ---------- UI Components ---------- */

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
          placeholder={placeholder || label}
          placeholderTextColor="#888"
        />
      </View>
    </View>
  );
}

function Preview({ label, value }) {
  return (
    <Text style={styles.previewText}>
      <Text style={{ fontWeight: "600" }}>{label}: </Text>
      {value || "—"}
    </Text>
  );
}

/* ---------- Styles ----------This is the styles */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#eef6ff",
    flexGrow: 1,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    marginBottom: 18,
  },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "700", marginLeft: 10 },

  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#1e293b" },

  /* Picker Styling */
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#3b82f6",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#1e293b",
  },

  /* Inputs */
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#0f172a",
  },

  /* Button */
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },

  /* Preview Card */
  previewCard: {
    marginTop: 24,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  previewTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#0f172a" },
  previewText: { fontSize: 15, marginBottom: 6, color: "#334155" },

  imageBox: {
    height: 160,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
  },
  image: { width: "100%", height: "100%" },
  imageFallback: { flex: 1, justifyContent: "center", alignItems: "center" },
});
