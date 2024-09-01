// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBbL1g-VaKX8I3weK9FfNawLhNoE-l-yy0",
    authDomain: "myblog-f3100.firebaseapp.com",
    projectId: "myblog-f3100",
    storageBucket: "myblog-f3100.appspot.com",
    messagingSenderId: "198594745854",
    appId: "1:198594745854:web:3828fbec89d6c8ae961caf",
    measurementId: "G-DMQ1KJ7PXT"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app)
export { db, storage, auth };