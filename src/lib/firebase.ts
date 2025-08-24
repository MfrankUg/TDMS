
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAljCd6PAlBH88CwAKNE5im1tS89XbjrMg",
  authDomain: "warehouse-sentinel.firebaseapp.com",
  projectId: "warehouse-sentinel",
  storageBucket: "warehouse-sentinel.appspot.com",
  messagingSenderId: "1036071190821",
  appId: "1:1036071190821:web:33a7bd8ffa6179341fdacc",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app, firebaseConfig };
