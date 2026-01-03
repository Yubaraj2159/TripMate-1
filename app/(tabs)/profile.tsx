// app/profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Mail,
  User,
  ShieldCheck,
  LogOut,
  Pencil,
  Wallet,
  Plane,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../../config/firebaseConfig";
import { signOut, updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;

  const [tripCount, setTripCount] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [photoURL, setPhotoURL] = useState(user?.photoURL);

  /* ---------------- Fetch Stats ---------------- */
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      // Trips
      const tripQuery = query(
        collection(db, "trips"),
        where("userId", "==", user.uid)
      );
      const tripSnap = await getDocs(tripQuery);
      setTripCount(tripSnap.size);

      // Expenses
      const expenseQuery = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid)
      );
      const expenseSnap = await getDocs(expenseQuery);

      let total = 0;
      expenseSnap.forEach((doc) => {
        total += doc.data().amount || 0;
      });
      setTotalExpense(total);
    };

    fetchStats();
  }, []);

  /* ---------------- Upload Profile Photo ---------------- */
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1],
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `profilePhotos/${user?.uid}.jpg`);
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);

    await updateProfile(user!, { photoURL: downloadURL });
    setPhotoURL(downloadURL);
  };

  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={["#2563eb", "#38bdf8"]} style={styles.header}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          <Image
            source={{ uri: photoURL || "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
          <View style={styles.editIcon}>
            <Pencil size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>{user?.displayName || "TripMate User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.verifyBadge}>
          <ShieldCheck size={14} color="#22c55e" />
          <Text style={styles.verifyText}>
            {user?.emailVerified ? "Email Verified" : "Email Not Verified"}
          </Text>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          icon={<Plane size={20} color="#2563eb" />}
          label="Trips"
          value={tripCount}
        />
        <StatCard
          icon={<Wallet size={20} color="#16a34a" />}
          label="Expenses"
          value={`₹ ${totalExpense}`}
        />
      </View>

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <InfoRow icon={<User size={18} />} text={`User ID: ${user?.uid}`} />
        <InfoRow icon={<Mail size={18} />} text={user?.email || "N/A"} />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ icon, label, value }: any) {
  return (
    <View style={styles.statCard}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, text }: any) {
  return (
    <View style={styles.row}>
      {icon}
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  editIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#2563eb",
    padding: 6,
    borderRadius: 20,
  },
  name: { fontSize: 22, fontWeight: "700", color: "#fff", marginTop: 12 },
  email: { fontSize: 14, color: "#e0f2fe", marginTop: 4 },
  verifyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfeff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  verifyText: { marginLeft: 6, fontSize: 12, fontWeight: "600" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -30,
  },
  statCard: {
    backgroundColor: "#fff",
    width: "40%",
    borderRadius: 16,
    alignItems: "center",
    padding: 16,
    elevation: 4,
  },
  statValue: { fontSize: 18, fontWeight: "700", marginTop: 6 },
  statLabel: { fontSize: 12, color: "#64748b" },
  section: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  rowText: { marginLeft: 10, fontSize: 14 },
  logoutBtn: {
    backgroundColor: "#ef4444",
    margin: 20,
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: { color: "#fff", marginLeft: 8, fontWeight: "600" },
});
