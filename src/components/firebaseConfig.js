import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyCVMNfemjpE3_CMNE6bV15oA_jcXbEBgX0",
  authDomain: "vivah-59646.firebaseapp.com",
  databaseURL: "https://vivah-59646-default-rtdb.firebaseio.com/", 
  projectId: "vivah-59646",
  storageBucket: "vivah-59646.appspot.com",
  messagingSenderId: "301199615509",
  appId: "1:301199615509:web:bd152b1ccc4f3c5478d01c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const realtimeDb = getDatabase(app); 

export { auth, db, storage, realtimeDb };
