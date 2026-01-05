import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { PieChart, BarChart } from "react-native-chart-kit";

const CATEGORIES = ["Food", "Travel", "Hotel", "Shopping", "Other"];

export default function BudgetPage() {
  const { tripId } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [splitCount, setSplitCount] = useState("1");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [expenses, setExpenses] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !tripId) return;

    const ref = collection(
      db,
      "users",
      user.uid,
      "trips",
      tripId as string,
      "budgets"
    );

    return onSnapshot(ref, (snap) => {
      setExpenses(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });
  }, []);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("Food");
    setSplitCount("1");
    setDate(new Date());
    setEditingId(null);
  };

  const saveExpense = async () => {
    if (!title || !amount) {
      Alert.alert("Missing info", "Title and amount are required");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    const data = {
      title,
      amount: Number(amount),
      category,
      splitCount: Number(splitCount),
      perPerson:
        Number(splitCount) > 0
          ? Number(amount) / Number(splitCount)
          : Number(amount),
      date,
      updatedAt: new Date(),
    };

    const baseRef = collection(
      db,
      "users",
      user.uid,
      "trips",
      tripId as string,
      "budgets"
    );

    if (editingId) {
      await updateDoc(doc(baseRef, editingId), data);
    } else {
      await addDoc(baseRef, {
        ...data,
        createdAt: new Date(),
      });
    }

    resetForm();
  };

  const startEdit = (item: any) => {
    setTitle(item.title);
    setAmount(String(item.amount));
    setCategory(item.category);
    setSplitCount(String(item.splitCount || 1));
    setDate(item.date?.toDate?.() || new Date());
    setEditingId(item.id);
  };

  const deleteExpense = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(
      doc(
        db,
        "users",
        user.uid,
        "trips",
        tripId as string,
        "budgets",
        id
      )
    );
  };

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  const totalsByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as any);

  const pieData = Object.keys(totalsByCategory).map((k, i) => ({
    name: k,
    amount: totalsByCategory[k],
    color: ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#9333ea"][i % 5],
    legendFontColor: "#334155",
    legendFontSize: 14,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Trip Budget</Text>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>Rs. {totalSpent}</Text>
      </View>

      <Text style={styles.sectionTitle}>
        {editingId ? "Edit Expense" : "Add Expense"}
      </Text>

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Amount"
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        placeholder="Split among people"
        style={styles.input}
        keyboardType="numeric"
        value={splitCount}
        onChangeText={setSplitCount}
      />

      <View style={styles.categoryRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.categoryChip,
              category === c && styles.categoryActive,
            ]}
            onPress={() => setCategory(c)}
          >
            <Text
              style={[
                styles.categoryText,
                category === c && styles.categoryTextActive,
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>Select Date: {date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(_, d) => {
            setShowDatePicker(false);
            if (d) setDate(d);
          }}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={saveExpense}>
        <Text style={styles.addButtonText}>
          {editingId ? "Update Expense" : "Add Expense"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Expenses</Text>

      <FlatList
        data={expenses}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseRow}>
            <View>
              <Text style={styles.expenseTitle}>{item.title}</Text>
              <Text style={styles.expenseMeta}>
                {item.category} •{" "}
                {item.date?.toDate?.().toDateString()}
              </Text>
              {item.splitCount > 1 && (
                <Text style={styles.expenseMeta}>
                  Split {item.splitCount} → Rs.{" "}
                  {item.perPerson?.toFixed(2)} each
                </Text>
              )}
            </View>

            <View style={styles.expenseRight}>
              <Text style={styles.expenseAmount}>Rs. {item.amount}</Text>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteExpense(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {pieData.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Spending Analysis</Text>

          <PieChart
            data={pieData}
            width={Dimensions.get("window").width - 32}
            height={220}
            accessor="amount"
            backgroundColor="transparent"
            chartConfig={{ color: () => "#000" }}
          />

          <BarChart
            data={{
              labels: Object.keys(totalsByCategory),
              datasets: [{ data: Object.values(totalsByCategory) }],
            }}
            width={Dimensions.get("window").width - 32}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: () => "#2563eb",
            }}
            style={{ marginTop: 20 }}
          />
        </>
      )}
    </ScrollView>
  );
}

/* -------- STYLES -------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  pageTitle: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  totalCard: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  totalLabel: { color: "#dbeafe" },
  totalAmount: { color: "white", fontSize: 26, fontWeight: "700" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginVertical: 12 },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  categoryRow: { flexDirection: "row", flexWrap: "wrap" },
  categoryChip: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryActive: { backgroundColor: "#2563eb" },
  categoryText: { color: "#334155" },
  categoryTextActive: { color: "white", fontWeight: "600" },
  dateButton: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  addButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 12,
  },
  addButtonText: { color: "white", fontWeight: "700", textAlign: "center" },
  expenseRow: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  expenseTitle: { fontSize: 16, fontWeight: "600" },
  expenseMeta: { fontSize: 13, color: "#64748b" },
  expenseRight: { alignItems: "flex-end" },
  expenseAmount: { fontWeight: "700" },
  editText: { color: "#2563eb", marginTop: 4 },
  deleteText: { color: "#dc2626", marginTop: 2 },
});
