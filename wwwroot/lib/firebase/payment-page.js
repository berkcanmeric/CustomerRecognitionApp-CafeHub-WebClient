// Import Firebase libraries
import app from "./firebase-config.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    query,
    where,
    addDoc,
    updateDoc,
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

onAuthStateChanged(auth, user => {
    if (user) {
        getData();
    }
})

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
                ]).draw().node()  // Add data-id attribute
                row.removeChild(row.lastChild); // Remove the extra empty TD
                row.setAttribute('data-id', data.id);
                row.setAttribute('data-isBestSelling', data.isBestSelling);
                row.setAttribute('data-imageUrl', data.imageUrl);
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
                    $('#product-table').DataTable().columns(3).search($(this).text()).draw();
                });
                // Add the button to the categories container element
                $('#categories').append(button);
            });

            if (!usersQuerySnapshot.empty) {
                // User found with the matching ID
                const userDoc = usersQuerySnapshot.docs[0];
                const userData = userDoc.data();
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

$('#checkout-button').on('click', async function () {
    // Get the selected product rows
    const table = $('#product-table').DataTable(); // Initialize the table with DataTables

    // Get the selected product rows
    const selectedRows = table.rows('.selected');
    // const id = $(selectedRows.nodes()).data('id'); // Get id from data attribute
    if (selectedRows.count() === 0) {
        showToast('No products selected for checkout.', 'error');
        return;
    }

    const selectedProducts = [];
    const selectedRowsData = selectedRows.data(); // Get the data for the selected rows
    for (let i = 0; i < selectedRowsData.length; i++) {
        const product = selectedRowsData[i];
        const id = $(selectedRows.nodes()[i]).data('id'); // Get id from data attribute for each row
        const isBestSelling = $(selectedRows.nodes()[i]).data('isbestselling'); // Get id from data attribute for each row
        const imageUrl = $(selectedRows.nodes()[i]).data('imageurl'); // Get id from data attribute for each row
        if (typeof product !== 'undefined') { // Check if the product variable is defined
            selectedProducts.push({
                id: id, // Use the value of the 'data-id' attribute as the product ID
                name: product[1], // Assuming the first column contains the product name
                price: product[2], // Assuming the second column contains the product price
                category: product[3], // Assuming the third column contains theproduct category
                isBestSelling: isBestSelling,
                imageUrl:imageUrl,
            });
        }
    }

    // Create the order object
    const order = {
        userId: userId,
        cafeId: cafeId,
        cost: calculateTotalCost(selectedProducts), // Calculate the total cost
        isRated: false,
        SpotifyPermissions: {
            totalTracks: 1,
            until: new Date(Date.now() + 3600000),
        },
        time: new Date(), // Current time
    };

    try {
        // Add the order to the Firestore collection
        const orderRef = await addDoc(collection(db, 'Order'), order); // Use the top-level "Order" collection

        // Add the selected products as a subcollection of the order
        for (let i = 0; i < selectedProducts.length; i++) {
            await addDoc(collection(orderRef, 'Product'), selectedProducts[i]);
        }

        // Clear the selected products and update the off-canvas view
        const selectedRowsNodes = selectedRows.nodes(); // Get the DOM nodes of the selected rows
        $(selectedRowsNodes).removeClass('selected'); // Remove the 'selected' class from the selected rows
        var checkbox = $(selectedRowsNodes).find('input[type="checkbox"]'); // Remove the checkmarks from the selected rows
        checkbox.prop('checked', !checkbox.prop('checked'));
        updateSelectedProductsCount();
        await addCouponToUser(userId, cafeId);
        showToast('Order placed successfully.', 'success');
    } catch (error) {
        showToast('Error placing order. Please try again later.', 'error');
        console.error('Error placing order:', error);
    }
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
function calculateTotalCost(products) {
    let totalCost = 0;
    products.forEach((product) => {
        totalCost += parseFloat(product.price);
    });
    return totalCost.toFixed(2);
}
function updateSelectedProductsCount() {
    const selectedRowCount =  $('#product-table').DataTable().rows('.selected').data().length;
    $('#selected-products-count').text(selectedRowCount + ' ürün seçildi');

    const selectedProducts =  $('#product-table').DataTable().rows('.selected').data().toArray(); // Get the selected products as an array
    updateSelectedProducts(selectedProducts);
}
function updateSelectedProducts(selectedProducts) {
    const selectedProductsContainer = document.getElementById("selected-products-container");
    selectedProductsContainer.innerHTML = ""; // Clear the container before adding new products

    selectedProducts.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("selected-product");

        const productImageHTML = product[4];  // Product image HTML is at index 4
        productElement.innerHTML = productImageHTML;

        const productDetails = document.createElement("div");
        productDetails.classList.add("product-details");

        const productName = document.createElement("span");
        productName.textContent = product[1]; // Product name is at index 1
        productName.classList.add("product-name");
        productDetails.appendChild(productName);

        const productPrice = document.createElement("span");
        productPrice.textContent = " " + product[2] + " TL"; // Product price is at index 2
        productPrice.classList.add("product-price");
        productDetails.appendChild(productPrice);

        productElement.appendChild(productDetails);
        selectedProductsContainer.appendChild(productElement);
    });
}
async function addCouponToUser(userId, cafeId) {
    // Generate a random 8 character alphanumeric coupon code
    const couponCode = generateCouponCode();

    // Get a reference to the coupon collection
    const couponCollection = collection(db, "Coupon");

    // Check if a document with the same userId and cafeId exists
    const querySnapshot = await getDocs(
        query(couponCollection, where("userId", "==", userId), where("cafeId", "==", cafeId))
    );

    if (querySnapshot.empty) {
        // No existing document found, create a new one
        await addDoc(couponCollection, {
            userId: userId,
            cafeId: cafeId,
            couponCode: "",
            couponCount: 1,
            couponAvailable: false
        });
    } else {
        // Increment the coupon count of the existing document
        querySnapshot.forEach((doc) => {
            const currentCouponCount = doc.data().couponCount;

            if (currentCouponCount >= 4 ) {
                updateDoc(doc.ref, {
                    couponCount: 0,
                    couponCode: couponCode,
                    couponAvailable: true
                });
            } else {
                updateDoc(doc.ref, {
                    couponCount: currentCouponCount + 1,
                });
            }
        });
    }
}



function generateCouponCode() {
    let coupon = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < 8; i++) {
        coupon += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return coupon;
}
// Call the getUserData function to fetch and display user information
getUserData();




        


       

