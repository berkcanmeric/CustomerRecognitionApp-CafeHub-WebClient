// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, setDoc, addDoc,doc, updateDoc,deleteDoc, getDoc, query, collection, where, getDocs, onSnapshot  } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnf9RAoAPfoTmN1jLYcFrxSMPzNNMdgTU",
    authDomain: "cafe-hub-e49e0.firebaseapp.com",
    projectId: "cafe-hub-e49e0",
    storageBucket: "cafe-hub-e49e0.appspot.com",
    messagingSenderId: "205195076349",
    appId: "1:205195076349:web:7ea9d19793773f2e48d494",
    measurementId: "G-VFX3ZW2Z1M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
submitData.addEventListener('click', (e) => {
    var name = document.getElementById('name').value;
    var age = document.getElementById('age').value;
    var birthdate = document.getElementById('birthdate').value;
    var email = document.getElementById('email').value;
    var surname = document.getElementById('surname').value;

    const usersRef = collection(db, "User");

    // Add a new document to the users collection
    addDoc(usersRef, {
        name: name,
        age: age,
        birthdate: birthdate,
        email: email,
        surname: surname
    });

    alert('User added');
});

updateData.addEventListener('click', (e) => {
    var name = document.getElementById('name').value;
    var age = document.getElementById('age').value;

    updateDoc(doc(db, "users", 'nwGGlAweHLguEzYEf1Ql'), {
        name: name,
        age: age ,
    });

    alert('User updated!');
});

deleteData.addEventListener('click', (e) => {
    deleteDoc(doc(db, "users", 'nwGGlAweHLguEzYEf1Ql'));

    alert('User deleted!');
});

// Get all the data
getAllData.addEventListener('click', (e) => {
    getDocs(collection(db, "users")).then(docSnap => {
        let users = [];
        docSnap.forEach((doc)=> {
            users.push({ ...doc.data(), id:doc.id })
        });
        console.log("Document data:", users);
    });
});

// Get specific data using it's ID
getSpecificData.addEventListener('click', (e) => {
    getDoc(doc(db, 'users', '4nz82Xc8wUiPJ9pZ8GLU')).then(docSnap => {
        if(docSnap.exists()) {
            console.log('Document data: ', docSnap.data()['name'])
        } else {
            console.log('no such data!')
        }
    })
});

// Get data using a query
getDataWithQuery.addEventListener('click', (e) => {
    const q = query(collection(db, "users"), where("age", "==", '30'));

    getDocs(q).then(docSnap => {
        let users = [];
        docSnap.forEach((doc)=> {
            users.push({ ...doc.data(), id:doc.id })
        });
        console.log("Document data:", users[0]['name']);
    });
});

// listen for realtime updates
getRealTimeUpdate.addEventListener('click', (e) => {
    const unsub = onSnapshot(doc(db, "users", "id"), (doc) => {
        console.log("Current data: ", doc.data());
    });
});