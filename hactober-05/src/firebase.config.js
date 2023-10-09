


import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import { collection, getDocs } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyB5lqD0VS2pV0YG3RSJTqmTVHR_zSFc7uA",
  authDomain: "datasa-2148e.firebaseapp.com",
  projectId: "datasa-2148e",
  storageBucket: "datasa-2148e.appspot.com",
  messagingSenderId: "410901107488",
  appId: "1:410901107488:web:49ce9867a4a5315d74fd45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app;