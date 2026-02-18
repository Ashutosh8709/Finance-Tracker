import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
  const signInEmail = (email, pass) =>
    signInWithEmailAndPassword(auth, email, pass);
  const signUpEmail = (email, pass, name) =>
    createUserWithEmailAndPassword(auth, email, pass).then((r) => {
      updateProfile(r.user, { displayName: name });
      return r;
    });
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInEmail,
        signUpEmail,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
