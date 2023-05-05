import app from "./firebase-config.js";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

const auth = getAuth();
const googleSignInLink = document.getElementById('google-sign-in');
googleSignInLink.addEventListener('click', () => {
    // Call the signInWithPopup method with GoogleAuthProvider
    signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...

            // Display a success alert in Turkish
            document.getElementById("login-success").classList.remove("d-none");
            document.getElementById("login-success").innerHTML = '<button type="button" class="btn-close" data-bs-dismiss="alert"></button><strong>Başarılı!</strong> <a href="#" class="alert-link">Hoşgeldiniz ' + user.displayName + ', kafe yönetim sayfasına yönlendiriliyorsunuz.</a>';
            // Redirect to the cafe management page after a short delay
            setTimeout(function() {
                window.location.href = "/cafe-management";
            }, 3000);
        }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...

        // Display an error alert in Turkish
        document.getElementById("login-error").classList.remove("d-none");
        document.getElementById("login-error").innerHTML = '<button type="button" class="btn-close" data-bs-dismiss="alert"></button><strong>Hata!</strong> <a href="#" class="alert-link">Giriş yaparken bir hata oluştu: ' + errorMessage + '</a>';
    });
});


