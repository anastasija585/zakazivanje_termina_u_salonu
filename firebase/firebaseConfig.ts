import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbruE89Xvx3i4qO9Nx6f8IkLaMdbXNEjc",
  authDomain: "zakazivanjetermina-92914.firebaseapp.com",
  databaseURL:
    "https://zakazivanjetermina-92914-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "zakazivanjetermina-92914",
  storageBucket: "zakazivanjetermina-92914.firebasestorage.app",
  messagingSenderId: "458339313396",
  appId: "1:458339313396:web:86ba31b2a69abb3c16e0a1",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);