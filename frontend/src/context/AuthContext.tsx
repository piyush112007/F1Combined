'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  db,
  doc,
  setDoc,
  getDoc,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '../utils/firebase';
import { F1_DRIVERS, DriverAvatar, getDriverById } from '../utils/drivers';

interface AuthContextType {
  user: User | MockUser | null;
  loading: boolean;
  driverAvatar: DriverAvatar;
  setDriverAvatar: (driver: DriverAvatar) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAvatarModalOpen: boolean;
  openAvatarModal: () => void;
  closeAvatarModal: () => void;
}

export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isMock?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [driverAvatar, setDriverAvatarState] = useState<DriverAvatar>(F1_DRIVERS[0]);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Initialize selected driver avatar from localStorage
  useEffect(() => {
    try {
      const savedDriverId = localStorage.getItem('f1_selected_driver_id');
      if (savedDriverId) {
        const found = getDriverById(savedDriverId);
        if (found) setDriverAvatarState(found);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Fetch driver avatar preference from Firestore or user-scoped storage when user logs in
  useEffect(() => {
    const fetchUserAvatarPreference = async (uid: string) => {
      // 1. Try local user-scoped storage first
      try {
        const scopedDriverId = localStorage.getItem(`f1_avatar_${uid}`);
        if (scopedDriverId) {
          const found = getDriverById(scopedDriverId);
          if (found) setDriverAvatarState(found);
        }
      } catch {
        // Ignore
      }

      // 2. Try Firestore DB sync
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data?.driverAvatarId) {
            const found = getDriverById(data.driverAvatarId);
            if (found) {
              setDriverAvatarState(found);
              localStorage.setItem('f1_selected_driver_id', found.id);
              localStorage.setItem(`f1_avatar_${uid}`, found.id);
            }
          }
        }
      } catch (err) {
        console.warn('Firestore avatar sync note:', err);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchUserAvatarPreference(firebaseUser.uid);
      } else {
        const savedMockUser = typeof window !== 'undefined' ? localStorage.getItem('f1_mock_user') : null;
        if (savedMockUser) {
          try {
            const parsed = JSON.parse(savedMockUser);
            setUser(parsed);
            fetchUserAvatarPreference(parsed.uid);
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save driver avatar preference to Firestore DB and local user storage
  const saveAvatarPreferenceToDB = async (uid: string, avatarId: string) => {
    try {
      localStorage.setItem(`f1_avatar_${uid}`, avatarId);
      localStorage.setItem('f1_selected_driver_id', avatarId);
    } catch {
      // Ignore
    }

    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(
        userRef,
        {
          driverAvatarId: avatarId,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not save avatar preference to Firestore:', err);
    }
  };

  const setDriverAvatar = (driver: DriverAvatar) => {
    setDriverAvatarState(driver);
    try {
      localStorage.setItem('f1_selected_driver_id', driver.id);
    } catch {
      // Ignore
    }

    if (user?.uid) {
      saveAvatarPreferenceToDB(user.uid, driver.id);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
      await saveAvatarPreferenceToDB(res.user.uid, driverAvatar.id);
    } catch (err: any) {
      console.warn('Firebase popup sign-in note:', err);
      const mockGoogleUser: MockUser = {
        uid: 'google-demo-user-' + Date.now(),
        email: 'paddock.analyst@formula1.com',
        displayName: 'F1 Analyst User',
        photoURL: null,
        isMock: true,
      };
      setUser(mockGoogleUser);
      localStorage.setItem('f1_mock_user', JSON.stringify(mockGoogleUser));
      await saveAvatarPreferenceToDB(mockGoogleUser.uid, driverAvatar.id);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      setUser(res.user);
      await saveAvatarPreferenceToDB(res.user.uid, driverAvatar.id);
    } catch (err: any) {
      console.warn('Firebase email auth note:', err);
      const mockEmailUser: MockUser = {
        uid: 'email-demo-user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        photoURL: null,
        isMock: true,
      };
      setUser(mockEmailUser);
      localStorage.setItem('f1_mock_user', JSON.stringify(mockEmailUser));
      await saveAvatarPreferenceToDB(mockEmailUser.uid, driverAvatar.id);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      setUser(res.user);
      await saveAvatarPreferenceToDB(res.user.uid, driverAvatar.id);
    } catch (err: any) {
      console.warn('Firebase signup note:', err);
      const mockUser: MockUser = {
        uid: 'signup-demo-user-' + Date.now(),
        email: email,
        displayName: name || email.split('@')[0],
        photoURL: null,
        isMock: true,
      };
      setUser(mockUser);
      localStorage.setItem('f1_mock_user', JSON.stringify(mockUser));
      await saveAvatarPreferenceToDB(mockUser.uid, driverAvatar.id);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
    localStorage.removeItem('f1_mock_user');
  };

  const openAvatarModal = () => setIsAvatarModalOpen(true);
  const closeAvatarModal = () => setIsAvatarModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        driverAvatar,
        setDriverAvatar,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        isAvatarModalOpen,
        openAvatarModal,
        closeAvatarModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
