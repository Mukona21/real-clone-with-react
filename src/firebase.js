// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  setDoc,
  addDoc,
  collection,
  query,
  orderBy,
  where,
  deleteDoc,
  updateDoc,
  limit,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBIskU91oCWUUMMMCwbsYsVor-5prUjj34',
  authDomain: 'realtor-clone-react-5a4b2.firebaseapp.com',
  projectId: 'realtor-clone-react-5a4b2',
  storageBucket: 'realtor-clone-react-5a4b2.appspot.com',
  messagingSenderId: '248009468427',
  appId: '1:248009468427:web:7d0bc773440fbf6474f50e',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

export {
  auth,
  db,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  setDoc,
  getStorage,
  addDoc,
  collection,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  query,
  orderBy,
  where,
  deleteDoc,
  updateDoc,
  limit,
}
