// Import Firebase libraries
import app from "./firebase-config.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";


// Initialize Firestore
const db = getFirestore(app);

const cafeId = "Acv7hYavbdraEyHibjK4";

// Get a reference to the Firestore document
const cafeDocRef = doc(db, "Cafe", cafeId);

const activeUsersRef = collection(cafeDocRef, "ActiveUserList");
// Get a reference to the Firestore collection "Rating"
const ratingsRef = collection(db, "Rating");

// Get all documents in ActiveUserList 
const activeUserDocs = await getDocs(activeUsersRef);

// Get an array of all userids from those documents
const userIds = activeUserDocs.docs.map(doc => doc.data().userId);

const usersQueryRef = query(
    collection(db, "User"),
    where("id", "in", userIds)
);
const ratingsQueryRef = query(ratingsRef, orderBy("ratingDate"));

const usersQuerySnapshot = await getDocs(usersQueryRef);
const ratingsQuerySnapshot = await getDocs(ratingsQueryRef);

async function initTable() {
    // Call the getData function to load the initial table data
    getData();
}


async function getData() {
    try {
        // Clear the table before adding new data (except for the headers)
        $('#customer-table').DataTable().clear();
        $('#rating-table').DataTable().clear();

        // Get all user documents with matching IDs
        const usersQuerySnapshot = await getDocs(usersQueryRef);
        const users = {};
        // Loop through the user documents and add a row to the table for each one
        usersQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            users[data.id] = {
                name: `${data.name} ${data.surname}`,
                photoUrl: data.photoUrl
            };
            $('#customer-table').DataTable().row.add([
                data.name,
                data.surname,
                data.email,
                data.birthdate,
                `<img src="${data.photoUrl}" alt="User Photo" class="user-photo" data-name="${data.name} ${data.surname}"/>`
            ]).draw().node();
        });

        // Loop through the rating documents and add a row to the table for each one
        const ratingsQuerySnapshot = await getDocs(ratingsQueryRef);
        ratingsQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.ratingDate.toDate().toLocaleDateString();
            const user = users[data.userId];
            let userPhoto;
            if (user) {
                userPhoto = `<img src="${user.photoUrl}" alt="${user.name}" class="user-photo" data-name="${user.name}"/>`;
            } else {
                userPhoto = '<img src="/lib/img/user.png" alt="User Photo" class="user-photo" data-name="Unknown User"/>';
            }
            const userName = user ? user.name : "Unknown User";
            const nameAndPhoto = `<span class="user-name p-2">${userName}</span>  ${userPhoto}`;
            $('#rating-table').DataTable().row.add([
                nameAndPhoto,
                data.comment,
                date,
                [...Array(data.score)].map(() => '<i class="fas fa-star"></i> ').join(''),
            ]).draw().node();
        });
        
        // Redraw the table to update the pagination
        $('#customer-table').DataTable().draw();
        $('#rating-table').DataTable().draw();
    } catch (err) {
        console.error("Error getting documents:", err);
    }
}


// Call the initTable function to initialize the table
initTable();