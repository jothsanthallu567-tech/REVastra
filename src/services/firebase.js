// REVastra Firebase Integration
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot,
  query,
  orderBy 
} from "firebase/firestore";

// Web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDHiNW7Lcp7ccmrwOiRwjtkNu4GkZP_Gng",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "revastra-a552e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "revastra-a552e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "revastra-a552e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "834366038905",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:834366038905:web:78c352779c113dc37ac5a8"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Authentication helper functions
export async function firebaseGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.warn("Firebase Google Sign-In note:", error.message);
    return { success: false, error: error.message, code: error.code };
  }
}

export async function firebaseLoginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.warn("Firebase Auth sign-in error (falling back if needed):", error.message);
    return { success: false, error: error.message, code: error.code };
  }
}

export async function firebaseRegisterUser(email, password, displayName = "") {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.warn("Firebase Auth sign-up error (falling back if needed):", error.message);
    return { success: false, error: error.message, code: error.code };
  }
}

export async function firebaseLogoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Firebase logout error:", error);
    return { success: false, error: error.message };
  }
}

// Firestore Realtime Sync & Data Helpers
export async function syncDocToFirestore(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn(`Firestore sync error on ${collectionName}/${docId}:`, error.message);
    return { success: false, error: error.message };
  }
}

export async function fetchCollectionFromFirestore(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });
    return { success: true, data: items };
  } catch (error) {
    console.warn(`Firestore fetch error on collection ${collectionName}:`, error.message);
    return { success: false, error: error.message };
  }
}
