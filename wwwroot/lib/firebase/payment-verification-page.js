// Import Firebase libraries
import app from "./firebase-config.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore(app);

const cafeId = "Acv7hYavbdraEyHibjK4";
const cafeDocRef = doc(db, "Cafe", cafeId);
const activeUsersRef = collection(cafeDocRef, "ActiveUserList");
const activeUserDocs = await getDocs(activeUsersRef);
const userIds = activeUserDocs.docs.map((doc) => doc.data().userId);

async function getUserData(loadingSpinner) {
    try {
        // Retrieve the verification code entered by the user from the form inputs
        const code1 = document.getElementById("code1").value;
        const code2 = document.getElementById("code2").value;
        const code3 = document.getElementById("code3").value;
        const code4 = document.getElementById("code4").value;

        // Retrieve verification code
        let verificationCode = code1 + code2 + code3 + code4;

        // Trim verification code 
        verificationCode = verificationCode.trim();

        // Query user collection 
        const usersQueryRef = query(
            collection(db, "User"),
            where("id", "in", userIds),
            where("paymentId", "==", verificationCode)
        );

        const usersQuerySnapshot = await getDocs(usersQueryRef);
        if (!usersQuerySnapshot.empty) {
            // User found with the matching payment ID and verification code
            const userDoc = usersQuerySnapshot.docs[0];
            const userData = userDoc.data();
            console.log("User found:", userData);
            // Perform further actions with the user data if needed

            // Redirect to another page and pass user information as query parameters
            const url = `/CafeManagement/Payment?userId=${userData.id}`;
            window.location.href = url;
            
        } else {
            // No user found with the matching payment ID and verification code
            console.log("User not found");
        }
        // Hide loading spinner after user data is retrieved
        loadingSpinner.style.display = "none";
    } catch (err) {
        // Handle any errors that occur during the data retrieval process
        console.error("Error retrieving user data:", err);
    }
}


function moveCursor(e) {
    if (e.keyCode == 8) { // Geri tuşuna basıldığında
        e.target.previousElementSibling.focus();
    } else if (e.keyCode == 46) { // Silme tuşuna basıldığında
        e.preventDefault(); // Silmeyi engelle
    } else if (e.target.value.length >= e.target.maxLength) {
        if (e.target.nextElementSibling) {
            e.target.nextElementSibling.focus();
        }
    }
}

function validateInput(e) {
    if (!/^\d$/.test(e.target.value)) {
        e.target.value = "";
    }
    if (e.target.value.length > 1) {
        e.target.value = e.target.value[e.target.value.length - 1];
    }
}

function submitForm() {
    // Show loading spinner
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.style.display = "block";

// Call getUserData() after a short delay
    setTimeout(function () {
        getUserData(loadingSpinner);
    }, 2000);
}

// Event listeners
document.getElementById("code1").addEventListener("input", moveCursor);
document.getElementById("code2").addEventListener("input", moveCursor);
document.getElementById("code3").addEventListener("input", moveCursor);
document.getElementById("code4").addEventListener("input", function (e) {
    if (e.target.value.length === e.target.maxLength) {
        submitForm();
    }
});
