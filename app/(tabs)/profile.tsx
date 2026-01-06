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
import { collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

type InfoRowProps = {
  icon: React.ReactNode;
  text: string;
};

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;

  const [tripCount, setTripCount] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [photoURL, setPhotoURL] = useState<string | null>(user?.photoURL ?? null);

  /* ---------------- Fetch Stats ---------------- */
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      // ✅ Correct trips path
      const tripsRef = collection(db, "users", user.uid, "trips");
      const tripSnap = await getDocs(tripsRef);
      setTripCount(tripSnap.size);

      // ✅ Correct expenses path
      const expensesRef = collection(db, "users", user.uid, "expenses");
      const expenseSnap = await getDocs(expensesRef);

      let total = 0;
      expenseSnap.forEach((doc) => {
        total += Number(doc.data().amount || 0);
      });
      setTotalExpense(total);
    };

    fetchStats();
  }, [user]);

  /* ---------------- Upload Profile Photo ---------------- */
  const pickImage = async () => {
    if (!user) return;

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

    const imageRef = ref(storage, `profilePhotos/${user.uid}.jpg`);
    await uploadBytes(imageRef, blob);

    const downloadURL = await getDownloadURL(imageRef);
    await updateProfile(user, { photoURL: downloadURL });

    setPhotoURL(downloadURL);
  };

  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <InfoRow icon={<User size={18} />} text={`User ID: ${user?.uid ?? ""}`} />
        <InfoRow icon={<Mail size={18} />} text={user?.email ?? "N/A"} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, text }: InfoRowProps) {
  return (
    <View style={styles.row}>
      {icon}
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563eb",
    borderRadius: 20,
    padding: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#e0f2fe",
    marginBottom: 12,
  },
  verifyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verifyText: {
    marginLeft: 6,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: "space-around",
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  rowText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#475569",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
