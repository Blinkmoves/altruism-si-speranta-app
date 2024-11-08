import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxUFzz45mitwpGgRhdPeHEb0pv6wIu7oI",
    authDomain: "altruism-si-speranta.firebaseapp.com",
    databaseURL: "https://altruism-si-speranta-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "altruism-si-speranta",
    storageBucket: "altruism-si-speranta.appspot.com",
    messagingSenderId: "380814318959",
    appId: "1:380814318959:web:fd7d8d6682edc544a39c9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize db
const db = getDatabase(app);

export { db, app, auth };
