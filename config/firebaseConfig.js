// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlX3jfqCIZjHBf5njWwMv2kNKoRUXwVEc",
  authDomain: "tripmate-b6cd4.firebaseapp.com",
  projectId: "tripmate-b6cd4",
  storageBucket: "tripmate-b6cd4.firebasestorage.app",
  messagingSenderId: "488984318109",
  appId: "1:488984318109:web:946c38351f25b5e1c90474",
  measurementId: "G-YLRXN34Z0Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
