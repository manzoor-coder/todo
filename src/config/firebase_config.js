// firebase_config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjYo3BuhFnSjOLme-9W__wIS0voEcAOXA",
  authDomain: "auth-cea4d.firebaseapp.com",
  projectId: "auth-cea4d",
  storageBucket: "auth-cea4d.appspot.com", // fix domain spelling
  messagingSenderId: "909673275695",
  appId: "1:909673275695:web:5b444ca47e3e113b7e01da",
  measurementId: "G-11TR0RTW4K"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Get Auth instance
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app);


export { auth, db, storage };
