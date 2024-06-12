"use strict";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

console.log("firebaseConfig", process.env.FIREBASE_API_KEY);
const firebaseConfig = {
  apiKey: "AIzaSyBLQ06samJE1OStbkSmDGIo1MxXHmIuzag",
  authDomain: "videoconferencia-339fe.firebaseapp.com",
  projectId: "videoconferencia-339fe",
  storageBucket: "videoconferencia-339fe.appspot.com",
  messagingSenderId: "685926019678",
  appId: "1:685926019678:web:660881ad06a56e1332bacf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };