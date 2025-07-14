export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
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
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    const role = userData?.role || 'user';

    if (role !== 'admin' && firebaseUser.uid !== SUPER_ADMIN_UID) {
      await signOut(auth);
      throw new Error('Access denied: You are not an admin.');
    }

    return firebaseUser;
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
