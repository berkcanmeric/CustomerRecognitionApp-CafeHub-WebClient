
// Import the functions you need from the SDKs you need
import app from "./firebase-config.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";



const auth = getAuth();

const signUpButton = document.getElementById('signUpButton');
signUpButton.addEventListener('click', (e) => {
    e.preventDefault()
    var email = document.getElementById('email').value;
    var password = document.getElementById('psw').value;
    console.log("email: " + email);
    console.log("password: " + password);
    createUserWithEmailAndPassword(auth, email, password)
        .then(cred => {
            console.log('user created:', cred.user)
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User created: ' + cred.user.email,
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                window.location.href = "/CafeManagement/Index";
            });
        })
        .catch(err => {
            console.log(err.message)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error: ' + err.message
            });
        })
});

 

  


