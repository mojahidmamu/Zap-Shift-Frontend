import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../Firabse/firebase.init';

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

     // ✅ Login (VERY IMPORTANT)
    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

     // ✅ Logout
    const logoutUser = () => {
        setLoading(true);
        return signOut(auth);
    };

     // ✅ Update Profile (name, photo)
    const updateUserProfile = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    };

    // ✅ Track user state (MOST IMPORTANT 🔥)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

    const authContextInfo = {
        user,
        loading, 
        updateUserProfile,
        registerUser, 
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={authContextInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;