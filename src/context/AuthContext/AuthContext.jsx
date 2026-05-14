// context/AuthContext/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { auth, onAuthStateChange } from "../../Firabse/firebase.init";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Store the Firebase ID token in localStorage
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ 
          email: firebaseUser.email, 
          name: firebaseUser.displayName,
          uid: firebaseUser.uid 
        }));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};