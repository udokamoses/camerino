import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvNB8vWT4HzkcbErKL1haPY05032uCOlc",
  authDomain: "camerino-ffd39.firebaseapp.com",
  projectId: "camerino-ffd39",
  storageBucket: "camerino-ffd39.firebasestorage.app",
  messagingSenderId: "1051145603468",
  appId: "1:1051145603468:web:05e8f57085318f2b81aea9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();