// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqM7Qf3aB83XvHB85J4DVKyRmJz3SxfmQ",
  authDomain: "milista-5f1c2.firebaseapp.com",
  projectId: "milista-5f1c2",
  storageBucket: "milista-5f1c2.appspot.com",
  messagingSenderId: "236493783713",
  appId: "1:236493783713:web:4c46f6567e086961eae6e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the analytics instance after initializing the app
const analytics = getAnalytics(app);

export default app;
