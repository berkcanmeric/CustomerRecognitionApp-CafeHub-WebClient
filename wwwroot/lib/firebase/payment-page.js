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
const userId = document.getElementById("userId").value; // Retrieve the user ID from the hidden input field

const productsRef = collection(cafeDocRef, "Product");
const categoriesRef = collection(cafeDocRef, "Category");
const newProductRef = doc(productsRef);
// Get a reference to the table element
const table = document.getElementById("product-table");

async function getUserData() {
    try {
        if (userIds.includes(userId)) {
            // User ID found among the userIds array
            // Query user collection with the provided user ID
            const usersQuerySnapshot = await getDocs(
                query(collection(db, "User"), where("id", "==", userId))
            );
            const querySnapshotProducts = await getDocs(productsRef);
            const querySnapshotCategories = await getDocs(categoriesRef);


            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            // Clear the table before adding new data (except for the headers)
            $('#product-table').DataTable().clear();

            // Loop through the query snapshot and append the product data to the table
            querySnapshotProducts.forEach((cafeDocRef) => {
                const data = cafeDocRef.data();
                const row = $('#product-table').DataTable().row.add([
                    `<fieldset class="form-group">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">           
                      </div>
                      </div>
                    </fieldset> `,
                    data.name,
                    data.price,
                    data.category,
                    `<img src="${data.imageUrl}" alt="Product Image" class="product-image"/>`
                ]).draw().node();
            });
            // Loop through the categories in the query snapshot
            querySnapshotCategories.forEach((cafeDocRef) => {
                const data = cafeDocRef.data();

                // Create a button element for the category
                const button = $('<button>')
                    .addClass('category-button btn btn-dark')
                    .text(data.name);

                // Add a click event listener to the category button
                button.click(function () {
                    // Filter the "Category" column to show only the clicked category
                    console.log($(this).text());
                    $('#product-table').DataTable().columns(3).search($(this).text()).draw();
                });
                // Add the button to the categories container element
                $('#categories').append(button);
            });

            function showToast(message, type = 'error') {
                const toast = document.createElement('div');
                toast.className = `toast bg-${type}`;
                toast.setAttribute('role', 'alert');
                toast.setAttribute('aria-live', 'assertive');
                toast.setAttribute('aria-atomic', 'true');
                toast.innerHTML = `
                <div class="toast-header">
                  <strong class="me-auto">${type === 'success' ? 'Başarılı' : 'Hata'}</strong>
                  <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                  ${message}
                </div>
                `;
                const container = document.createElement('div');
                container.className = 'toast-container';
                container.appendChild(toast);
                document.body.appendChild(container);
                const toastInstance = new bootstrap.Toast(toast);
                toastInstance.show();
            }


            if (!usersQuerySnapshot.empty) {
                // User found with the matching ID
                const userDoc = usersQuerySnapshot.docs[0];
                const userData = userDoc.data();
                console.log("User found:", userData);

                // Update the offcanvas fields with user information
                const userPhotoElement = document.getElementById("userPhoto");
                const userNameElement = document.getElementById("userName");
                const userSurnameElement = document.getElementById("userSurname");
                const userEmailElement = document.getElementById("userEmail");
                const userBirthdateElement = document.getElementById("userBirthdate");

                if (userPhotoElement && userNameElement) {
                    userPhotoElement.innerHTML = `<img src="${userData.photoUrl}" alt="${userData.name}" class="user-photo" />`;
                    userNameElement.textContent = userData.name;
                    userSurnameElement.textContent = userData.surname;
                    userEmailElement.textContent = userData.email;
                    userBirthdateElement.textContent = userData.birthdate;
                }
            } else {
                // No user found with the provided ID
                console.log("User not found");
            }
        } else {
            // User ID not found among the userIds array
            console.log("Invalid user ID");
        }
    } catch (err) {
        // Handle any errors that occur during the data retrieval process
        console.error("Error retrieving user data:", err);
    }
}

// Call the getUserData function to fetch and display user information
getUserData();




        


       

