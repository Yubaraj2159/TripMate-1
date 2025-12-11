// context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
