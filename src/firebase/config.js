import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM3LTH_KDr-W4LEmsx7InX5YP27rsPr6w",
  authDomain: "bird-reader-cdc7d.firebaseapp.com",
  projectId: "bird-reader-cdc7d",
  storageBucket: "bird-reader-cdc7d.appspot.com",
  messagingSenderId: "466596413441",
  appId: "1:466596413441:web:704b465d5d3ccd0d36c000",
  databaseURL:
    "https://bird-reader-cdc7d-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const database = getDatabase(app);
export { db, storage, auth, database };
