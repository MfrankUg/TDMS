
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser, Auth, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { app } from './firebase';

interface User {
  uid: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authInstance = getAuth(app);
    const dbInstance = getFirestore(app);
    setAuth(authInstance);
    setDb(dbInstance);

    const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(dbInstance, "users", firebaseUser.uid));
        if (userDoc.exists()) {
           setUser({ uid: firebaseUser.uid, email: firebaseUser.email!, fullName: userDoc.data().fullName });
        } else {
           setUser({ uid: firebaseUser.uid, email: firebaseUser.email!, fullName: firebaseUser.displayName || firebaseUser.email! });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) return;
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    router.push('/dashboard');
  };

  const signup = async (userData: any) => {
    if (!auth || !db) return;
    setLoading(true);
    const { email, password, fullName, countryCode, telephone, role } = userData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    await setDoc(doc(db, "users", firebaseUser.uid), {
      fullName,
      email,
      countryCode,
      telephone,
      role,
    });
    
    router.push('/dashboard');
  };
  
  const loginWithGoogle = async () => {
    if (!auth || !db) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential: UserCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
         await setDoc(userDocRef, {
          fullName: firebaseUser.displayName,
          email: firebaseUser.email,
          role: 'other', // default role
        });
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      // Let the calling component handle the error state
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
