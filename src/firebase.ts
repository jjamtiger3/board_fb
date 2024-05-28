import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9iRkk-ztQcY0beanLgD6Z9CJeexyJzkU",
  authDomain: "board-firebase-7a9eb.firebaseapp.com",
  projectId: "board-firebase-7a9eb",
  storageBucket: "board-firebase-7a9eb.appspot.com",
  messagingSenderId: "860167071407",
  appId: "1:860167071407:web:4feee08b5fc9d6d73cd65a",
  measurementId: "G-SZ58V3L2B3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);