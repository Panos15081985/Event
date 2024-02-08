// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZnxwNLxd1a-_l8BheHjG9UXSJGeUjbGM",
  authDomain: "event-57f3f.firebaseapp.com",
  projectId: "event-57f3f",
  storageBucket: "event-57f3f.appspot.com",
  messagingSenderId: "86506426586",
  appId: "1:86506426586:web:18e04f5aae631aeab715e3",
  measurementId: "G-VZ4ZDKDFNC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db ;
