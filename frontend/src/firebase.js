import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAZJ7UukSEK-PW277Z7XKJ8HaHMlresiYE",
  authDomain: "cineberg-cad98.firebaseapp.com",
  projectId: "cineberg-cad98",
  storageBucket: "cineberg-cad98.appspot.com",
  messagingSenderId: "445571991061",
  appId: "1:445571991061:web:86816ef8389300867ab01c",
  measurementId: "G-7N52QPRYFP"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
// const analytics = getAnalytics(firebaseApp);

export { auth, provider, storage };
export default database;