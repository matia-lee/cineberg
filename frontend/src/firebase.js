import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const api_key = process.env.REACT_APP_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: api_key,
  authDomain: "cineberg-cad98.firebaseapp.com",
  projectId: "cineberg-cad98",
  storageBucket: "cineberg-cad98.appspot.com",
  messagingSenderId: "445571991061",
  appId: "1:445571991061:web:86816ef8389300867ab01c",
  measurementId: "G-7N52QPRYFP"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const storage = getStorage(firebaseApp);

// const analytics = getAnalytics(firebaseApp);

export { auth, provider, storage, database };