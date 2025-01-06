
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCBf_rbwqHfyKTbdRzTAi9dB1CHSJBu-O8",
  authDomain: "twiller-clone-1d792.firebaseapp.com",
  projectId: "twiller-clone-1d792",
  storageBucket: "twiller-clone-1d792.appspot.com", 
  messagingSenderId: "76809503387",
  appId: "1:76809503387:web:acdfb19ac28e4b2d86bc3e",
  measurementId: "G-7VNF0KB0VZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);

// Export the app instance
export default app;
