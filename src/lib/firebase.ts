
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD2u3xK5efpir3XZKU4X1BBubH_OzO1sGw",
  authDomain: "real-estate-a86d1.firebaseapp.com",
  projectId: "real-estate-a86d1",
  storageBucket: "real-estate-a86d1.firebasestorage.app",
  messagingSenderId: "725417841404",
  appId: "1:725417841404:web:60d924a867b3491032fd79",
  measurementId: "G-GSEV9NY3G9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
