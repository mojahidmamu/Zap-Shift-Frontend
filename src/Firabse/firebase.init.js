// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    createUserWithEmailAndPassword,
    getAuth, GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup, 
    signOut 
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId,
    measurementId: import.meta.env.VITE_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

// Google Sign In
export const signInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const token = await user.getIdToken(); // 🔥 Get Firebase token
        return { user, token, error: null };
    } catch (error) {
        return { user: null, token: null, error: error.message };
    }
};

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken(); // 🔥 Get Firebase token
        return { user, token, error: null };
    } catch (error) {
        return { user: null, token: null, error: error.message };
    }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email, password) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

// Logout
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Auth State Observer
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};