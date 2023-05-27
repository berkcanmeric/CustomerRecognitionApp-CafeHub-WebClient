import app from "./firebase-config.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    createUserWithEmailAndPassword,
    browserSessionPersistence,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    query,
    where,
    addDoc,
    setDoc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

const registerButton = document.getElementById('registerButton');
const passwordInput = document.getElementById('psw');
const togglePasswordButton = document.querySelector('.toggle-password');
const textarea = document.getElementById('address');
var addressValue ;


setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log("Persistence enabled.");
        onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed. User:", user);
            if (user) {
                console.log("User is logged in.");
                // window.location.href = "/CafeManagement/Index";
            } else {
                // Delay rendering of login form until after check
                setTimeout(() => {
                    renderRegisterForm();
                }, 0);
            }
            const navbarElements = document.querySelectorAll('.nav-link');

            if(user){
                console.log("User is authenticated. Showing navbar elements.");
                navbarElements.forEach(element => {
                    element.style.display = "block";
                });
            }
            else {
                console.log("User is not authenticated. Hiding navbar elements.");
                navbarElements.forEach(element => {
                    element.style.display = "none";
                });
            }
        });
    })
    .catch((error) => {
        console.log("Error enabling persistence:", error);
    });


function uploadCafeImage(uid, email, cafeId, cafeName) {
    return new Promise((resolve, reject) => {
        const cafeImageInput = document.getElementById('cafeImage');
        const file = cafeImageInput.files[0];
        const fileName = `${new Date().getTime()}_${file.name}`;

        const cafeRef = ref(storage, `Cafe/${cafeId}`);
        const productRef = ref(cafeRef, 'product');
        const imageRef = ref(cafeRef, fileName);

        uploadBytes(imageRef, file)
            .then(() => {
                getDownloadURL(imageRef)
                    .then((url) => {
                        cafeName.imageUrl = url;
                        resolve(url); // Resolve the promise with the imageUrl
                    })
                    .catch((error) => {
                        console.error("Error getting download URL: ", error);
                        reject(error); // Reject the promise if there's an error
                    });
            })
            .catch((error) => {
                console.error("Error uploading image: ", error);
                reject(error); // Reject the promise if there's an error
            });
    });
}


function renderRegisterForm() {
    registerButton.addEventListener('click', (e) => {
        e.preventDefault();

        var email = document.getElementById('email').value;
        var password = passwordInput.value;
        addressValue = textarea.value;
        createUserWithEmailAndPassword(auth, email, password)
            .then(cred => {
                addCafeDatabase(cred.user.uid, cred.user.email);
                console.log('User created:', cred.user);
            })
            .catch(err => {
                console.log(err.message);
            });
    });
}

function addCafeDatabase(uid, email) {
    const workHours = {
        monday: {
            start: document.getElementById('monday-start').value,
            end: document.getElementById('monday-end').value
        },
        tuesday: {
            start: document.getElementById('tuesday-start').value,
            end: document.getElementById('tuesday-end').value
        },
        wednesday: {
            start: document.getElementById('wednesday-start').value,
            end: document.getElementById('wednesday-end').value
        },
        thursday: {
            start: document.getElementById('thursday-start').value,
            end: document.getElementById('thursday-end').value
        },
        friday: {
            start: document.getElementById('friday-start').value,
            end: document.getElementById('friday-end').value
        },
        saturday: {
            start: document.getElementById('saturday-start').value,
            end: document.getElementById('saturday-end').value
        },
        sunday: {
            start: document.getElementById('sunday-start').value,
            end: document.getElementById('sunday-end').value
        }
    };

    const newCafe = {
        address: addressValue,
        id: "",
        imageUrl: "",
        latitude: "",
        longitude: "",
        name: "",
        userUID: uid
    };
    const cafesCollection = collection(db, "Cafe");
    addDoc(cafesCollection, newCafe)
        .then((docRef) => {
            uploadCafeImage(uid, email, docRef.id, newCafe)
                .then((imageUrl) => {
                    newCafe.imageUrl = imageUrl;
                    newCafe.id = docRef.id;
                    console.log(newCafe);
                    setDoc(doc(db, "Cafe", docRef.id), newCafe)
                        .then(() => {
                            console.log("Cafe updated with image URL");
                        })
                        .catch((error) => {
                            console.error("Error updating cafe: ", error);
                        });
                })
                .catch((error) => {
                    console.error("Error uploading image: ", error);
                });
            console.log("Cafe added with ID: ", docRef.id);

            const workHoursCollection = collection(db, "Cafe", docRef.id, 'WorkHours');
            addDoc(workHoursCollection, workHours)
                .then(() => {
                    console.log("Work hours added as a collection");
                })
                .catch((error) => {
                    console.error("Error adding work hours collection: ", error);
                });
        })
        .catch((error) => {
            console.error("Error adding cafe: ", error);
        });
}

togglePasswordButton.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    const icon = togglePasswordButton.querySelector('span');
    icon.classList.toggle('fa-eye-slash');
    icon.classList.toggle('fa-eye');
});
