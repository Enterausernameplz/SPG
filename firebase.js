import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCsWF4PCocPl5UfUyjCx6SO-uWYA0z-Jog",
  authDomain: "sw-project-demo.firebaseapp.com",
  projectId: "sw-project-demo",
  storageBucket: "sw-project-demo.appspot.com",
  messagingSenderId: "186703882989",
  appId: "1:186703882989:web:b68715bca65528891d7ae4",
  measurementId: "G-6HC20Y5M1L",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

export { auth, db ,realtimeDb};
