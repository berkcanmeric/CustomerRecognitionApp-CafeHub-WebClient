import app from "./firebase-config.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

const auth = getAuth();

console.log("Auth object:", auth);
const logoutLink = document.getElementById("logout-link");
function logout() {
    signOut(auth)
        .then(() => {
            console.log("User logged out.");
            window.location.href = "/Account/Index";
        })
        .catch((error) => {
            console.log("Error logging out:", error);
        });
}
logoutLink.addEventListener("click", logout)



