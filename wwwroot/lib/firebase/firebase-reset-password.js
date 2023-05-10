// Import the functions you need from the SDKs you need
import app from "./firebase-config.js";
import {
    getAuth,
    sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";


const auth = getAuth();


const resetPasswordButton = document.getElementById('resetPasswordButton');

resetPasswordButton.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            document.getElementById("reset-password-error").classList.add("d-none");
            document.getElementById("reset-password-success").classList.remove("d-none");
            setTimeout(() => {
                window.location.href = "/Account/Index";
            }, 1500);
        })
        .catch((error) => {
            console.log(error.message);
            document.getElementById("reset-password-success").classList.add("d-none");
            document.getElementById("reset-password-error").classList.remove("d-none");
        });
});
 

  


