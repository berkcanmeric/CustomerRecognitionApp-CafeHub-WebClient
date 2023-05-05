// Import the functions you need from the SDKs you need
import app from "./firebase-config.js";
import {
    getAuth,
    sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";


const auth = getAuth();


const forgotPasswordLink = document.getElementById('forgot');

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Password reset email sent',
                text: 'Please check your email for instructions on how to reset your password.'
            });
        })
        .catch((error) => {
            console.log(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Password reset failed',
                text: 'Please enter a valid email address and try again.'
            });
        });
});
 

  


