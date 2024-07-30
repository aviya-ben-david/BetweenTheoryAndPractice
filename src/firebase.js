// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAWoHOdLTQ9BR_Vlr8hyXw0I3fDSD1ZBzg",
    authDomain: "mawwia-5da71.firebaseapp.com",
    projectId: "mawwia-5da71",
    storageBucket: "mawwia-5da71.appspot.com",
    messagingSenderId: "96113026639",
    appId: "1:96113026639:web:b75207d7406b933f67ac3a",
    measurementId: "G-EBN2J7E0JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
