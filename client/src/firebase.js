import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-hsp.firebaseapp.com",
  projectId: "mern-hsp",
  storageBucket: "mern-hsp.appspot.com",
  messagingSenderId: "444981123208",
  appId: "1:444981123208:web:bbfedb124ed428fc71a73d"
};

export const app = initializeApp(firebaseConfig);