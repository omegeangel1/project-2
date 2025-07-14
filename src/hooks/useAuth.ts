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
            role: userData?.role || 'user',
            isAdmin: userData?.role === 'admin' || firebaseUser.uid === SUPER_ADMIN_UID,
            isSuperAdmin: firebaseUser.uid === SUPER_ADMIN_UID
          };
          
          setUser(authUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(firebaseUser as AuthUser);
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
