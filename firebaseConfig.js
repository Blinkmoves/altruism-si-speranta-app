import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

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

// const auth = getAuth(app);
// TODO: add auth

// Initialize db
const db = getDatabase();

export { db, app };
