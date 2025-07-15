interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  email: string;
  verified: boolean;
}

interface AuthUser extends DiscordUser {
  uid?: string;
  role?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Updated super admin UIDs - add your Firebase UID here
const SUPER_ADMIN_UIDS = [
  'VCntHsLFKCYpIOxPThnTwYYiwDB3', // Original UID
  // Add more super admin UIDs here as needed
];

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let userData = userDoc.data();
          
          // If user doesn't exist in Firestore, create them
          if (!userData) {
            const newUserData = {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: SUPER_ADMIN_UIDS.includes(firebaseUser.uid) ? 'admin' : 'user',
              createdAt: new Date(),
              lastLogin: new Date()
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
            userData = newUserData;
          } else {
            // Update last login
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...userData,
              lastLogin: new Date()
            }, { merge: true });
          }
          
          const authUser: AuthUser = {
            ...firebaseUser,
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            username: userData?.username || firebaseUser.email?.split('@')[0] || '',
            discriminator: '0',
            global_name: userData?.displayName || firebaseUser.displayName,
            avatar: userData?.avatar || null,
            email: firebaseUser.email || '',
            verified: firebaseUser.emailVerified,
            role: userData?.role || 'user',
            isAdmin: userData?.role === 'admin' || SUPER_ADMIN_UIDS.includes(firebaseUser.uid),
            isSuperAdmin: SUPER_ADMIN_UIDS.includes(firebaseUser.uid)
          };
          
          setUser(authUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
          
          // Fallback user object
          const fallbackUser: AuthUser = {
            ...firebaseUser,
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            username: firebaseUser.email?.split('@')[0] || '',
            discriminator: '0',
            global_name: firebaseUser.displayName,
            avatar: null,
            email: firebaseUser.email || '',
            verified: firebaseUser.emailVerified,
            role: SUPER_ADMIN_UIDS.includes(firebaseUser.uid) ? 'admin' : 'user',
            isAdmin: SUPER_ADMIN_UIDS.includes(firebaseUser.uid),
            isSuperAdmin: SUPER_ADMIN_UIDS.includes(firebaseUser.uid)
          };
          
          setUser(fallbackUser);
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
