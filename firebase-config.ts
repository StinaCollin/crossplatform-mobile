// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCoIngq8WjHSJQB0y9w3eZcXyPBXmeIuTo",
    authDomain: "iths-stina-collin.firebaseapp.com",
    projectId: "iths-stina-collin",
    storageBucket: "iths-stina-collin.appspot.com",
    messagingSenderId: "667219508644",
    appId: "1:667219508644:web:ac58326008b6b1da985531"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore()
