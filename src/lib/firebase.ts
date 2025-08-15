// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "huevitochef",
  "appId": "1:211495132589:web:da0c4d04d4d0440028d524",
  "storageBucket": "huevitochef.firebasestorage.app",
  "apiKey": "AIzaSyBbzjT3fx_xV4--0vWoQTDsmanL80jugtU",
  "authDomain": "huevitochef.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "211495132589"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
