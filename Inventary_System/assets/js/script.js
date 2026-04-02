
window.closeDeleteModal = function () {
    const modal = document.getElementById("deleteModal")
    
    if (modal) {
        modal.style.display = "none";
        document.getElementById("qtyInpModal").value = "";
    }
};

window.closeCustomAlert = function () {
     const modal = document.getElementById("customAlert");

     if(modal) {
        closeAlert();
     }
};

window.openAddModal = async function () {
    try{
        const modal = document.getElementById("addModal");

        // load the html from addProd.ejs
        const response = await fetch("/addProduct");
        const html = await response.text();

        modal.innerHTML = html;
        const clearBtn = document.getElementById("clearProdBtn");
        const form = document.getElementById("addProductForm");

        clearBtn?.addEventListener("click", () => {
            form.reset();
        });
        modal.style.display = "block";

        initAddProductForm();  
    }catch(err){
        console.error(err);
    }
};

window.closeAddModal = function () {
    const modal = document.getElementById("addModal");
    modal.style.display = "none";
    modal.innerHTML = ""; //clear
};

function openUsersModal() {
    document.getElementById("usersModal").classList.remove("hidden");
    document.getElementById("usersModal").classList.add("flex");
}

function closeUsersModal() {
    document.getElementById("usersModal").classList.add("hidden");
}

window.addEventListener("click", function (e) {
    const modal = document.getElementById("usersModal");

    if (e.target === modal) {
        closeUsersModal();
    }
});

/*  
   this file contains all the functions related to the UI of the products page,
   such as the functions to change the background color of the selected rows to delete, to show the custom alert,
   to delete the selected rows, to toggle the editing mode and to edit the selected row...
*/

function reloadPage() {
    window.location.reload();
}

/**
 * Get input data of the form in addProd page, validate data and send POST request.
 */
function initAddProductForm() {
    const form = document.getElementById("addProductForm");
    const clearBtn = document.getElementById("clearProdBtn");

    // CLEAR
    clearBtn?.addEventListener("click", () => {
        form.reset();
    });

    // VALIDATION + SUBMIT
    form?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const price = form.price.value.trim();
        const quantity = form.quantity.value.trim();

        if (price === '' || isNaN(price) || parseFloat(price) < 0) {
            showCustomAlert("Validation Error", "Invalid price");
            return;
        }

        if (quantity !== '' && (isNaN(quantity) || parseInt(quantity) < 0)) {
            showCustomAlert("Validation Error", "Invalid quantity");
            return;
        }

        try {
            const res = await fetch("/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: form.title.value,
                    price: parseFloat(price),
                    author: form.author.value,
                    category: form.category.value,
                    quantity: parseInt(quantity || 0),
                    section: form.section.value
                })
            });

            if (res.ok) {
                closeAddModal();
                reloadPage();
            } else {
                const err = await res.text();
                showCustomAlert("Error", err);
            }

        } catch (err) {
            console.error(err);
            showCustomAlert("Error", "Request failed");
        }
    });
}


/**
 *  Retrieves the IDs of the selected rows by checking which checkboxes are checked and collecting their values in an array.
 * @returns {Array} - an array of book IDs that are currently selected (checked) in the UI.
 */
function getSelectedIds() {
    const checkboxes = document.querySelectorAll('input[name="bookIds"]');
    const selectedIds = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    return selectedIds;
}

/**
 * Validates the selected IDs to ensure only one book is selected at a time.
 * 
 * @returns {Object} - an object indicating whether the selection is valid and any error message.
 */
function validateSelectedIds(ids) {
    if (ids.length === 0)
        return { valid: false, message: null }

    if (ids.length > 1)
        return {
            valid: false,
            message: "You can only change the availability of one book per time",
        }

    return { valid: true }
}

/**
 * Get the available quantity for the selected product
 * @param {Number} id -id of the selected row
 * @returns {Number}
 */
function getQty(id) {
    const qtyCell = document.querySelector(`#row-${id} td[data-field="quantity"]`);
    return parseInt(qtyCell.innerText);
}

function calculateQtyToRemove(qty) {
    if (!qty || isNaN(qty) || qty <= 0)
        return null;

    return -Number(qty)
}

/**
 * Paints the selected row with a different background color to indicate that it is selected for deletion:
 *    the function takes a checkbox element and the ID of the row as parameters,
 *       it checks if the checkbox is checked and changes the background color of the corresponding row accordingly.
 * @param {*} checkbox 
 * @param {*} id 
 */
function paintSelectedRow(checkbox, id) {
    //utility function to change the background color of the selected rows to delete
    var row = document.getElementById('row-' + id);
    if (checkbox.checked)
        //if the checkbox element of the row is checked: change the background color of the row else dont' change it
        row.style.backgroundColor = "#cccccc94";
    else
        row.style.backgroundColor = "";
}


/**
 * Displays a custom alert message in a modal dialog
 * @param {String} message 
 */
function showCustomAlert(title, message, onConfirm = null) {
    const alertModal = document.getElementById("customAlert");
    const titleEl = document.getElementById("alertTitle");
    const messageEl = document.getElementById("alertMessage");
    const confirmBtn = document.getElementById("alertConfirmBtn");

    // set dinamic content: title + message
    titleEl.innerText = title;
    messageEl.innerText = message;

    // handle buttons
    if (onConfirm && typeof onConfirm === 'function') {
        confirmBtn.innerText = "Confirm";

        // add new listener to confirm button
        confirmBtn.onclick = async () => {
            await onConfirm(); 
            closeAlert();      
        };
        

    } else {
        confirmBtn.innerText = "OK";

        confirmBtn.onclick = closeAlert;
    }
    alertModal.style.display = "block";
}

/**
 * Closes the custom alert dialog by setting its display style to "none".
 */
function closeAlert() {
    const alertModal = document.getElementById("customAlert");
    
    //hide the modal
    alertModal.style.display = "none";
    
    // reset buttons state
    const confirmBtn = document.getElementById("alertConfirmBtn");
    confirmBtn.innerText = "OK";
    confirmBtn.onclick = null; // Remove confirm listener
}


/**
 * Deletes the selected rows from the database by sending a POST request to the server with the IDs of the selected rows:
 *    -the function retrieves all the checkbox elements for the books, checks which ones are selected, and collects their IDs in an array.
 * 
 *    -Once the user has selected one row and press delete button a delete modal is shown in which
 *          the user enters the quantity of product to be removed.
 * 
 *    -If more than one row is selected, it shows a custom alert message indicating that only one book can be edited at a time.
 * @returns 
 */
async function deleteSelectedRows() {
    let checkboxs = document.getElementsByName('bookIds');   //get all the checkboxs in the page
    const ids = getSelectedIds();   //get the ids of the selected rows
    const modal = document.getElementById("deleteModal");

    const validation = validateSelectedIds(ids);
    if (!validation.valid)
        return;

    //show deleteModal
    if (modal) {
        modal.style.display = "block";
        document.getElementById("qtyInpModal").focus();
    }
}

/**
 * Check if the price from input is valid:
 *   the price must be greater than zero and it must be a number
 * @param {Number} price   -input price
 * @returns {Boolean}
 */
function isValidPrice(price) {
    const priceNum = parseFloat(price);
    return !isNaN(priceNum) && priceNum > 0;
}

/**
 * Check if the quantity from input is valid:
 *    - input > 0
 *    - input must be a numeric character
 *    - input cannot be greater than the maximum availability of the product in the inventary
 * @param {Number} qty -input quantity 
 * @param {*} maxQty   -Maximum quantity of products available in the inventary
 * @returns {Boolean}
 */
function isValidQty(qty, maxQty) {
    const qtyVal = parseInt(qty, 10);
    if (isNaN(qtyVal) || qtyVal <= 0) return false;
    if (maxQty !== undefined && maxQty !== null) {
        return qtyVal <= maxQty;
    }
    return true;
}


/**
 * Toggles the editing mode for the products page:
 * 
 *     -the function checks if the update button is currently in editing mode by checking a data attribute on the button.
 * 
 *     -If it is in editing mode, it removes the editing mode state from session storage and reloads the page to exit editing mode.
 * 
 *     -If it is not in editing mode, it changes the button text and style to indicate that it is in editing mode, enables the editing of rows by calling the enableEditingRows function, and saves the editing mode state in session storage.
 */
function togleEditingMode() {
    const updateButton = document.getElementById('updateBtn');
    const isEditMode = updateButton.getAttribute('data-editing') === 'true';

    if (isEditMode) {
        sessionStorage.removeItem("editingMode");
        window.location.reload();
    } else {
        updateButton.innerText = "Save all changes";
        updateButton.style.backgroundColor = '#f44336';
        updateButton.setAttribute('data-editing', 'true');

        enableEditingRows();

        saveEditingMode(true);   // save the editing mode in the session storage
    }
}

/**
 * Enables the editing of rows in the products page by changing the display style of the edit columns
 *     and transforming the content of the cells into input fields:
 * 
 *      -the function retrieves all the elements with the class "edit-column" and changes their display style to "table-cell" to make them visible.
 *    
 *      -It then retrieves all the table cells that have a data-field attribute and transforms their content into input fields with the current value of the cell.
 *    
 *      -The input fields are given unique IDs based on the field name and row ID for later retrieval when saving changes.
 */
function enableEditingRows() {
    const editCols = document.querySelectorAll('.edit-column');
    editCols.forEach(col => col.style.display = 'table-cell');
    const cellsToEdit = document.querySelectorAll('td[data-field]');

    cellsToEdit.forEach(cell => {
        const fieldName = cell.getAttribute('data-field');   
        const rowId = cell.parentElement.id.replace('row-', ''); 
        const currentValue = cell.innerText.trim()
        if (fieldName === "section") {
            cell.innerHTML = `
                <select id="input-section-${rowId}" class="edit-input">
                    ${['A','B','C','D','E','F'].map(s => `
                        <option value="${s}" ${s === currentValue ? 'selected' : ''}>
                            ${s}
                        </option>
                    `).join('')}
                </select>
            `;
        } else {
            const cleanValue = currentValue.replace(' €', '');

            cell.innerHTML = `
                <input type="text" 
                    id="input-${fieldName}-${rowId}" 
                    value="${cleanValue}" 
                    class="edit-input"
                    style="width: 90%">`;
        }
    });

}

/**
 * Saves the editing mode state in session storage:
 * 
 *     -function first get data from the input fields of the selected row, then it validates the price input to ensure it is a valid number then
 *       sends a POST request to the server with the updated book data to save the changes in the database.
 * 
 *     -If the request is successful, it removes the editing mode state from session storage and reloads the page to reflect the changes.
 * @param {String} id
 * @param {Boolean} isEditing
 */
const editSelectedRow = async (id) => {
    //get the values from the input fields of the selected row
    const title = document.getElementById(`input-title-${id}`).value.trim();
    const priceValue = document.getElementById(`input-price-${id}`).value.replace(',', '.').trim();
    const author = document.getElementById(`input-author-${id}`).value.trim();
    const category = document.getElementById(`input-category-${id}`).value.trim();
    const quantity = document.getElementById(`input-quantity-${id}`).value.trim();
    const section = document.getElementById(`input-section-${id}`)?.value;

    // validate price
    if (!isValidPrice(priceValue)) {
        alert("Price is not valid");
        document.getElementById(`input-price-${id}`).focus(); // set focus on the price input field
        return; // stop execution if the price is not valid
    }

    // validate quantity
    if (!isValidQty(quantity)) {
        alert("Quantity is not valid");
        document.getElementById(`input-quantity-${id}`).focus(); // set focus on the quantity input field
        return; // stop execution if the quantity is not valid
    }

    const updatedBook = {
        id: id,
        title: title,
        price: parseFloat(priceValue),
        author: author,
        category: category,
        quantity: parseInt(quantity),
        section: section
    };

    // 3. Fetch data
    try {
        const res = await fetch('/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBook)
        });

        if (res.ok) {
            sessionStorage.removeItem('editingMode');
            sessionStorage.removeItem('selectedBooks');
           
        } else {
            alert('Error while saving changes');
        }
    } catch (error) {
        console.error('Error while fetch: ', error);
    }
}

/**
 *  Deletes the selected users from the database by sending a POST request to the server with the IDs of the selected users:
 * 
 *     -the function retrieves all the selected checkbox elements from userIds, and collects their IDs in an array.
 *     
 *     -If no user is selected, it shows an alert message.
 *    
 *     -If one or more users are selected, it shows a confirmation dialog.
 *    
 *     -If confirmed, it sends a POST request to the server with the IDs of the selected users to be deleted.
 * @returns 
 */
async function deleteSelectedUser() {
    const checkboxes = document.querySelectorAll('input[name="userIds"]:checked');  //checked checkboxes
    const ids = Array.from(checkboxes).map(cb => cb.value);   //extract id from checkboxes checked and push into an array
    
    if(ids.length == 0)
        return

    showCustomAlert(
        "Removing a user from the system",                // Title h3
        "Confirm to remove user from the system",           // Message p
        
        // if the user click on confirm then execute the callback function to send POST request to the server
        async () => {
            try {
                const response = await fetch('/deleteUser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userIds: ids })
                });

                //server response
                if (response.ok) {
                    reloadPage(); //reload page in case server response is ok
                } else {
                    const errorText = await response.text();
                    showCustomAlert("Error", "Error while deleting users: " + errorText);
                }
                reloadPage();
            } catch (error) {
                console.error("Error:", error);
                showCustomAlert("Error", "An unexpected error occurred.");
            }
        }
    );
}

/**
 * Filter table's records by section value and ensure the UI state persistance(selected section filter):
 *     - Retrieves the select element used to filter books by section.
 * 
 *     - Restores the previously selected filter value from sessionStorage.
 * 
 *     -  Applies the filter  on page load using the restored value.
 * 
 *     - Event listener update the filter whenever the user changes the selection.
 * 
 *     - Saves the selected filter value in sessionStorage for UI persistance.
 */
function filterBySection(){
    const filter = document.getElementById("sectionFilter");
    if (!filter) return;

    // reload values from sessionStorage
    const saved = sessionStorage.getItem("sectionFilter");
    if (saved) {
        filter.value = saved;
    }

    applyFilter(filter.value);

    // Listener
    filter.addEventListener("change", function(){
        const selected = filter.value;

        sessionStorage.setItem("sectionFilter", selected);
        applyFilter(selected);
    });
}

/**
 *  Filters the table rows based on the selected section value by iterating over all table rows and retrieves
 *      the section value from each row.
 *  If the selected value is empty (""), all rows are displayed, otherwise, only rows matching the selected section are shown,
 *       while the others are hidden.
 * @param {String} selected -A,B,C,D,E,F
 */
function applyFilter(selected){
    const rows = document.querySelectorAll("#tableBooks tbody tr");

    rows.forEach(row => {
        const sectionCell = row.querySelector('[data-field="section"]');
        const sectionValue = sectionCell.textContent.trim();

        row.style.display = (selected === "" || sectionValue === selected) ? "" : "none";
    });
}

function searchProd(){
    const prod = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#tableBooks tbody tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();

        if (text.includes(prod)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

/**
 * Add the listeners to the buttons of the products page
 */
function init() {
    const searchInput = document.getElementById("searchInput");
    const searchbtn = document.getElementById("searchBtn");
    const deleteUserBtn = document.getElementById("deleteUserBtn");
    const updateButton = document.getElementById("updateBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const addBtn = document.getElementById("addBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const qtyInput = document.getElementById("qtyInpModal");
    const closeDeleteModalX = document.getElementById("closeX");
    const closeCustomAlertX = document.getElementById("closeAlertX");

    //initialize filterBySection to dinamically filter table rows by section
    filterBySection();

    searchInput?.addEventListener("input", searchProd);
    searchbtn?.addEventListener("click", searchProd);

    //DELETE USER
    deleteUserBtn?.addEventListener("click", deleteSelectedUser);

    // DELETE BOOK
    deleteBtn?.addEventListener("click", deleteSelectedRows);

    // UPDATE MODE
    updateButton?.addEventListener("click", togleEditingMode);

    

    // SAVE ROW (editing)
    document.querySelectorAll(".save-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            editSelectedRow(id);
        });
    });

    // VALIDATE QUANTITY INPUT IN MODAL
    qtyInput?.addEventListener("input", () => {

        const ids = getSelectedIds();
        if(ids.length === 0) return;

        const maxQty = getQty(ids[0]);
        const isValid = isValidQty(qtyInput.value, maxQty);

        confirmDeleteBtn.disabled = !isValid;
    });

    // CONFIRM DELETE
    confirmDeleteBtn?.addEventListener("click", async () => {

        const ids = getSelectedIds();
        const qtyToRemove = qtyInput.value;

        try {

            const res = await fetch("/updateQty", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: ids[0],
                    delta: -Number(qtyToRemove)
                })
            });

            if(res.ok){
                window.closeDeleteModal();
                reloadPage();
            } else{
                const errorText = await res.text();
                showCustomAlert("Error: " + errorText);
            }

        } catch(error){
            console.error("Fetch error:", error);
            showCustomAlert("An unexpected error occurred.");
        }

    });

    // CLOSE DELETE MODAL
    closeDeleteModalX?.addEventListener("click", window.closeDeleteModal);
    //CLOSE CUSTOM ALERT
    closeCustomAlertX?.addEventListener("click", closeAlert);
}




document.addEventListener('DOMContentLoaded', init);   //init  at the first DOMContentLoaded event

if (typeof module !== 'undefined') {
    module.exports = { 
        getSelectedIds, 
        validateSelectedIds, 
        calculateQtyToRemove, 
        paintSelectedRow, 
        editSelectedRow, 
        deleteSelectedRows,
        isValidPrice,
        isValidQty,
        getQty
    };
}

