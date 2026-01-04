import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

/**
 * Register a new user
 * - Creates Firebase Auth user
 * - Saves profile in Firestore (/users/{uid})
 * - Sets displayName in Auth
 * - Sends verification email
 */
export const registerUser = async (
  fullName: string,
  email: string,
  password: string
): Promise<User> => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Set display name in Auth profile
    await updateProfile(user, {
      displayName: fullName,
    });

    // Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: fullName,
      email: email,
      createdAt: serverTimestamp(),
    });

    // Send email verification
    await sendEmailVerification(user);

    return user;
  } catch (error: any) {
    console.log("Register Error:", error);
    throw new Error(error.message || "Signup failed");
  }
};

/**
 * Login user
 * - Blocks login if email is not verified
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
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
    console.log("Login Error:", error);
    throw new Error(error.message || "Login failed");
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.log("Reset Password Error:", error);
    throw new Error(error.message || "Password reset failed");
  }
};

/**
 * Logout current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.log("Logout Error:", error);
    throw new Error("Logout failed");
  }
};
