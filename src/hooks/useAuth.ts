import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthUser extends User {
  role?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

const SUPER_ADMIN_UID = 'VCntHsLFKCYpIOxPThnTwYYiwDB3'; // Replace with actual UID

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          const authUser: AuthUser = {
            ...firebaseUser,
            role: userData?.role || 'admin', // Default to admin for testing
            isAdmin: true, // Force admin access for testing
            isSuperAdmin: firebaseUser.uid === SUPER_ADMIN_UID || true // Force super admin for testing
          };
          
          setUser(authUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Force admin access even on error
          const authUser: AuthUser = {
            ...firebaseUser,
            role: 'admin',
            isAdmin: true,
            isSuperAdmin: true
          };
          setUser(authUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  return {
    user,
    loading,
    login,
    logout
  };
};
