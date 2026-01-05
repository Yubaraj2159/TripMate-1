// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { addDoc, collection, Timestamp } from "firebase/firestore";
// import { auth, db } from "../../config/firebaseConfig";

// export default function Budget() {
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [paidBy, setPaidBy] = useState("");
//   const [splitBetween, setSplitBetween] = useState("");

//   const handleSaveExpense = async () => {
//     if (!title || !amount || !paidBy) {
//       Alert.alert("Error", "Please fill all required fields");
//       return;
//     }

//     const peopleArray = splitBetween
//       ? splitBetween.split(",").map((p) => p.trim())
//       : [paidBy];

//     try {
//       await addDoc(collection(db, "budgets"), {
//         userId: auth.currentUser?.uid,
//         title,
//         amount: Number(amount),
//         paidBy,
//         splitBetween: peopleArray,
//         createdAt: Timestamp.now(),
//       });

//       Alert.alert("Success", "Expense saved successfully");

//       setTitle("");
//       setAmount("");
//       setPaidBy("");
//       setSplitBetween("");
//     } catch (error) {
//       Alert.alert("Error", "Failed to save expense");
//     }
//   };

//   const splitAmount =
//     splitBetween && amount
//       ? (Number(amount) /
//           splitBetween.split(",").filter(Boolean).length).toFixed(2)
//       : null;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Budget & Expenses</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Expense Title (e.g. Hotel)"
//         value={title}
//         onChangeText={setTitle}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Amount"
//         keyboardType="numeric"
//         value={amount}
//         onChangeText={setAmount}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Paid By"
//         value={paidBy}
//         onChangeText={setPaidBy}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Split Between (comma separated names)"
//         value={splitBetween}
//         onChangeText={setSplitBetween}
//       />

//       {splitAmount && (
//         <Text style={styles.splitText}>
//           Each person pays: Rs. {splitAmount}
//         </Text>
//       )}

//       <TouchableOpacity style={styles.button} onPress={handleSaveExpense}>
//         <Text style={styles.buttonText}>Save Expense</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: "600",
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#2563EB",
//     padding: 14,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#FFF",
//     textAlign: "center",
//     fontWeight: "600",
//   },
//   splitText: {
//     marginVertical: 10,
//     fontSize: 16,
//     fontWeight: "500",
//   },
// });
