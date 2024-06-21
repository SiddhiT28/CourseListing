// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAbLDjg1Cs3s3csOxKRrqf3Tz85JKU4zNk',
  authDomain: 'course-listing-6d7b9.firebaseapp.com',
  projectId: 'course-listing-6d7b9',
  storageBucket: 'course-listing-6d7b9.appspot.com',
  messagingSenderId: '165615366826',
  appId: '1:165615366826:web:19ec18df73da45640cd6d3',
  databaseURL: 'https://course-listing-6d7b9-default-rtdb.firebaseio.com',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const firebaseDatabase = getDatabase(app);

export const db = getFirestore(app);

export const auth = getAuth(app);
