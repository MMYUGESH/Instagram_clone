import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDYJ6b1RQzpi37BosKw03hQr0SzfxPirsQ",
    authDomain: "insta-4a7c0.firebaseapp.com",
    projectId: "insta-4a7c0",
    storageBucket: "insta-4a7c0.appspot.com",
    messagingSenderId: "204552084867",
    appId: "1:204552084867:web:0982f3b700e9d142d5eab6",
    measurementId: "G-KLHSFR50ZD"

});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };