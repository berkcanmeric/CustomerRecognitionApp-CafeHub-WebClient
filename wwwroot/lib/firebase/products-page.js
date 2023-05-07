// Import Firebase libraries
import app from "./firebase-config.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    addDoc,
    query,
    where,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore(app);

const cafeId = "Acv7hYavbdraEyHibjK4";
// Get a reference to the Firestore document
const docc = doc(db, "Cafe", cafeId);
const productsRef = collection(docc, "Product");
const newProductRef = doc(productsRef);
// Get a reference to the table element
const table = document.getElementById("product-table");

async function getData() {
    try {
        const querySnapshot = await getDocs(productsRef);

        // Clear the table before adding new data (except for the headers)
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        // Function to create and append a button to a table cell
        function createButtonAndAppendToCell(buttonText, buttonClass, cell, clickHandler) {
            const button = document.createElement("button");
            button.innerHTML = buttonText;
            button.className = buttonClass;
            cell.appendChild(button);
            button.addEventListener("click", clickHandler);
        }

        // Function to open a modal and add a close button event listener
        function openModal(modalId) {
            console.log(`${modalId} modal opened`);
            const modal = document.getElementById(modalId);
            modal.style.display = "block";
            const closeButton = modal.getElementsByClassName("btn-close")[0];
            closeButton.removeEventListener("click", closeModal);
            closeButton.addEventListener("click", closeModal);
            const closeButtonSecondary = modal.querySelector("#close-btn");
            closeButtonSecondary.removeEventListener("click", closeModal);
            closeButtonSecondary.addEventListener("click", closeModal);
            function closeModal() {
                modal.style.display = "none";
            }
        }
      
        // Function to pre-fill the edit form with product data and open the edit modal
        function openEditModal(docc, data) {
            console.log("Edit button clicked");
            const editForm = document.getElementById("edit-form");
            editForm.elements.name.value = data.name;
            editForm.elements.price.value = data.price;
            editForm.elements.category.value = data.category;
            // editForm.elements.bestSelling.value = data.bestSelling.checked;
            editForm.elements.imageUrl.value = data.imageUrl;
            editForm.dataset.docId = docc.id;
            openModal("edit-modal");
        }

        function openDeleteModal(productId) {
            console.log("Delete button clicked");
            const deleteForm = document.getElementById("delete-form");
            deleteForm.dataset.docId = productId;
            openModal("delete-modal");
        }

        // Function to delete a product and reload the table data
        async function deleteProductData(productId) {
            try {
                console.log('productId: ', productId);
                // Show a confirmation message to confirm that the user wants to delete the product
                const confirmation = await Swal.fire({
                    icon: 'warning',
                    title: 'Bu ürünü silmek istediğinize emin misiniz?',
                    text: 'Bu işlem geri alınamaz.',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Evet, sil'
                });
                // If the user confirms the deletion, delete the product document
                if (confirmation.isConfirmed) {
                    // Get a reference to the product document to delete
                    const productDocRef = doc(productsRef, productId);
                    // Delete the product document
                    await deleteDoc(productDocRef);
                    console.log("Product deleted successfully");
                    // Reload the table data to show the updated product info
                    await getData();
                    console.log("Table data reloaded");
                    // Display a success message to inform the user that the product has been deleted
                    Swal.fire({
                        icon: 'success',
                        title: 'Ürün başarıyla silindi',
                        text: 'Ürün veritabanından başarıyla silindi.',
                        timer: 1500,
                        timerProgressBar: true
                    });
                }
            } catch (err) {
                console.error("Error deleting product:", err);
                // Show an error message to inform the user that there was a problem deleting the product
                Swal.fire({
                    icon: 'error',
                    title: 'Ürün silinirken hata oluştu',
                    text: 'Ürünü silerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
                });
            }
        }

        // Function to open the add modal and reset the form fields
        function openAddModal() {
            console.log("Add button clicked");
            const addForm = document.getElementById("add-form");
            addForm.reset();
            openModal("add-modal");
        }

        // Clear the table before adding new data (except for the headers)
        $('#product-table').DataTable().clear();
        // Loop through the query snapshot and append the product data to the table
        querySnapshot.forEach((docc) => {
            const data = docc.data();
            const row = $('#product-table').DataTable().row.add([
                data.name,
                data.price,
                data.category,
                `<img src="${data.imageUrl}" alt="Product Image" class="product-image"/>`
            ]).draw().node();

            const editCell = $('#product-table').DataTable().cell(row, 4).node();
            createButtonAndAppendToCell('Düzenle', 'btn btn-primary btn-sm', editCell, () => {
                openEditModal(docc, data);
            });

            const deleteCell = $('#product-table').DataTable().cell(row, 5).node();
            createButtonAndAppendToCell('Sil', 'btn btn-danger btn-sm', deleteCell, () => {
                openDeleteModal(docc.id);
            });
        });

        // Replace the existing add button with a new one and add an event listener
        const oldAddButton = document.getElementById("add-button");
        const newAddButton = oldAddButton.cloneNode(true);
        newAddButton.id = "add-button";
        oldAddButton.parentNode.replaceChild(newAddButton, oldAddButton);
        newAddButton.addEventListener("click", openAddModal);

        // Clone and replace the existing edit form and add form
        const oldEditForm = document.getElementById("edit-form");
        const newEditForm = oldEditForm.cloneNode(true);
        oldEditForm.parentNode.replaceChild(newEditForm, oldEditForm);

        const oldAddForm = document.getElementById("add-form");
        const newAddForm = oldAddForm.cloneNode(true);
        oldAddForm.parentNode.replaceChild(newAddForm, oldAddForm);

        const oldDeleteForm = document.getElementById("delete-form");
        const newDeleteForm = oldDeleteForm.cloneNode(true);
        oldDeleteForm.parentNode.replaceChild(newDeleteForm, oldDeleteForm);

        replaceForm(
            document.getElementById("edit-form"),
            newEditForm,
            "edit",
            submitEditForm
        );

        replaceForm(
            document.getElementById("add-form"),
            newAddForm,
            "add",
            submitAddForm
        );
        replaceForm(
            document.getElementById("delete-form"),
            newDeleteForm,
            "delete",
            submitDeleteForm
        );

        async function submitEditForm() {
            event.preventDefault();
            console.log("Edit form submitted");
            // Get the edited product data from the form
            const editedData = {
                name: newEditForm.elements.name.value,
                price: Number(newEditForm.elements.price.value),
                category: newEditForm.elements.category.value,
                // bestSelling: newEditForm.elements.bestSelling.checked,
                imageUrl: newEditForm.elements.imageUrl.value,
            };
            console.log("Edited product data: ", editedData);
            const docId = newEditForm.dataset.docId;
            console.log("Document ID: ", docId);
            try {
                // Update the product data in the Firestore database
                await updateDoc(doc(productsRef, docId), editedData);
                console.log("Product data updated successfully");
                // Close the modal
                const modal = document.getElementById("edit-modal");
                modal.style.display = "none";
                // Reload the table data to show the updated product info
                await getData();
                console.log("Table data reloaded");
                // Display a success message to inform the user that the product has been updated
                showToast('Ürün veritabanında güncellendi.', 'success');
            } catch (err) {
                console.error("Error updating document:", err);
                // Show an error message to inform the user that there was a problem updating the product
                showToast('Ürün güncelleme sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
        }

        async function submitAddForm() {
            event.preventDefault();
            console.log("Add form submitted");
            // Get the new product data from the form
            const newData = {
                name: newAddForm.elements.name.value,
                price: Number(newAddForm.elements.price.value),
                category: newAddForm.elements.category.value,
                bestSelling: false, // Set bestSelling to false by default
                imageUrl: newAddForm.elements.imageUrl.value,
            };
            console.log("New product data: ", newData);

            // Check if a product with the same name already exists in the same category
            const exists = await productExists(newData.name, newData.category);
            console.log("Product exists: ", exists);
            if (exists) {
                // Display a message to inform the user that the product already exists
                showToast('Bu isimde bir ürün zaten bu kategoride mevcut. Lütfen farklı bir isim girin.');
            } else {
                try {
                    // Add the new product data to the Product subcollection of a specific Cafe document with a random ID
                    await setDoc(newProductRef, newData);
                    console.log("New product data added successfully");
                    // Close the modal
                    const modal = document.getElementById("add-modal");
                    modal.style.display = "none";
                    await getData();
                    console.log("Table data reloaded");
                    // Show a success message to inform the user that the new product has been added
                    showToast('Yeni ürün veritabanına eklendi.', 'success');

                } catch (err) {
                    console.error("Error adding document:", err);
                    // Show an error message to inform the user that there was a problem adding the new product
                    showToast('Yeni ürün eklerken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
                }
            }
        }

        async function submitDeleteForm() {
            event.preventDefault();
            console.log("Delete form submitted");
            const docId = newDeleteForm.dataset.docId;
            console.log("Document ID: ", docId);
            try {
                // Get a reference to the product document to delete
                const productDocRef = doc(productsRef, docId);
                // Delete the product document
                await deleteDoc(productDocRef);
                console.log("Product deleted successfully");
                // Close the modal
                const modal = document.getElementById("delete-modal");
                modal.style.display = "none";
                // Reload the table data to show the updated product info
                await getData();
                console.log("Table data reloaded");
                // Display a success message to inform the user that the product has been deleted
                showToast('Ürün veritabanından başarıyla silindi.', 'success');
            } catch (err) {
                console.error("Error deleting product:", err);
                // Show an error message to inform the user that there was a problem deleting the product
                showToast('Ürünü silerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
        }

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
        function replaceForm(oldForm, newForm, formType, submitCallback) {
            // Clone the old form and remove event listeners
            const clonedForm = oldForm.cloneNode(true);
            oldForm.parentNode.replaceChild(clonedForm, oldForm);

            // Add a new event listener to the new form
            newForm.addEventListener("submit", submitCallback);

            // Replace the cloned form with the new, fully-functional form
            newForm.id = formType + "-form";
            clonedForm.parentNode.replaceChild(newForm, clonedForm);
        }
    } catch (err) {
        console.error("Error getting products:", err);
    }
    // Redraw the table to update the pagination
    $('#product-table').DataTable().draw();
}

async function productExists(name, category) {
    const querySnapshot = await getDocs(query(productsRef, where('name', '==', name), where('category', '==', category)));
    return !querySnapshot.empty;
}

// Call the getData function to load the initial table data
getData();