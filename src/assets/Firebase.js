// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOcMnAgekHUfdUWwTv-cYSNf8YZjB4uzw",
  authDomain: "reactproject-4f0fd.firebaseapp.com",
  projectId: "reactproject-4f0fd",
  storageBucket: "reactproject-4f0fd.appspot.com",
  messagingSenderId: "486490593496",
  appId: "1:486490593496:web:09adce9ac93ec4e6e49fad",
  measurementId: "G-0W9SQ967CW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export default app;