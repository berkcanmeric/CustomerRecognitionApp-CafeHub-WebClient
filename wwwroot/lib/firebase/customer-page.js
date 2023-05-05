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

// Get a reference to the Firestore collection
const usersRef = collection(db, "User");

// Get a reference to the table element
const table = document.getElementById("customer-table");

async function initTable() {
    // Call the getData function to load the initial table data
    getData();
}

async function getData() {
    try {
        let queryRef = query(usersRef, orderBy("name"));
        const querySnapshot = await getDocs(queryRef);

        // Clear the table before adding new data (except for the headers)
        $('#customer-table').DataTable().clear();

        // Loop through the query snapshot and append the customer data to the table
        querySnapshot.forEach((docc) => {
            const data = docc.data();
            $('#customer-table').DataTable().row.add([
                data.name,
                data.surname,
                data.email,
                data.birthdate,
                `<img src="${data.photoUrl}" alt="User Photo" class="user-photo"/>`
            ]);
        });

        // Redraw the table to update the pagination
        $('#customer-table').DataTable().draw();
    } catch (err) {
        console.error("Error getting documents:", err);
    }
}

// Call the initTable function to initialize the table
initTable();