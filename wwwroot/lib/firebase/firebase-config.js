import {initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnf9RAoAPfoTmN1jLYcFrxSMPzNNMdgTU",
    authDomain: "cafe-hub-e49e0.firebaseapp.com",
    projectId: "cafe-hub-e49e0",
    storageBucket: "cafe-hub-e49e0.appspot.com",
    messagingSenderId: "205195076349",
    appId: "1:205195076349:web:7ea9d19793773f2e48d494",
    measurementId: "G-VFX3ZW2Z1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export  default app;