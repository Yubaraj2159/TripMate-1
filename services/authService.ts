import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

/**
 * Register a new user
 * - Creates Firebase Auth user
 * - Stores full name in Firestore
 * - Sends verification email
 */
export const registerUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  try {
    // 1. Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 2. Save user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: fullName,
      email: email,
      createdAt: new Date(),
    });

    // 3. Send email verification
    await sendEmailVerification(user);

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Login user
 * - Blocks login if email is not verified
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Enforce email verification
    if (!user.emailVerified) {
      await signOut(auth);
      throw new Error("Please verify your email before logging in.");
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Forgot Password
 * - Sends password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  await signOut(auth);
};
