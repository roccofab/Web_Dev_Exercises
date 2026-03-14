

/*  
   this file contains all the functions related to the UI of the products page,
   such as the functions to change the background color of the selected rows to delete, to show the custom alert,
   to delete the selected rows, to toggle the editing mode and to edit the selected row...
*/

function reloadPage() {
    window.location.reload();
}


/**
 *  Retrieves the IDs of the selected rows by checking which checkboxes are checked and collecting their values in an array.
 * @returns {Array} - an array of book IDs that are currently selected (checked) in the UI.
 */
function getSelectedIds(){
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
function validateSelectedIds(ids){
    if(ids.length === 0)
        return {valid:false, message:null}

    if(ids.length > 1)
        return {
            valid:false,
            message:"You can only change the availability of one book per time"
        }

    return {valid:true}
}

function calculateQtyToRemove(qty){
    if(!qty || isNaN(qty) || qty <= 0)
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
function paintSelectedRow(checkbox, id){
    //utility function to change the background color of the selected rows to delete
    var row = document.getElementById('row-' +id);
    if(checkbox.checked)
        //if the checkbox element of the row is checked: change the background color of the row else dont' change it
        row.style.backgroundColor = "#cccccc94";
    else
        row.style.backgroundColor = "";
}


/**
 * Displays a custom alert message in a modal dialog
 * @param {String} message 
 */
function showCustomAlert(message) {
    document.getElementById("alertMessage").innerText = message;
    document.getElementById("customAlert").style.display = "block";
}

/**
 * Closes the custom alert dialog by setting its display style to "none".
 */
function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
}

/**
 * Deletes the selected rows from the database by sending a POST request to the server with the IDs of the selected rows:
 *    the function retrieves all the checkbox elements for the books, checks which ones are selected, and collects their IDs in an array.
 *    If more than one row is selected, it shows a custom alert message indicating that only one book can be edited at a time.
 * @returns 
 */
async function deleteSelectedRows() {
    let checkboxs = document.getElementsByName('bookIds');   //get all the checkboxs in the page
    const ids = getSelectedIds();   //get the ids of the selected rows

    const validation = validateSelectedIds(ids);
    if(!validation.valid){
        showCustomAlert(validation.message);
        return;
    }
    
    const qtyToRemove = prompt("Quantity to Delete: ");
    const qtyValue = calculateQtyToRemove(qtyToRemove);
    if(qtyValue === null){
        alert("Invalid quantity value");
        return;
    }

    const res = await fetch('/updateQty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: ids[0],
            delta: -Number(qtyToRemove) 
        })
    });


        if (res.ok) {
            reloadPage();   //reload the page
        }
}

function isValidPrice(price) {
    const priceNum = parseFloat(price);
    return !isNaN(priceNum) && priceNum > 0;
}

function isValidQty(qty) {
    const qtyVal = parseInt(qty);
    return !isNaN(qtyVal) && qtyVal >= 0;
}


/**
 * Toggles the editing mode for the products page:
 *    the function checks if the update button is currently in editing mode by checking a data attribute on the button.
 *    If it is in editing mode, it removes the editing mode state from session storage and reloads the page to exit editing mode.
 *    If it is not in editing mode, it changes the button text and style to indicate that it is in editing mode, enables the editing of rows by calling the enableEditingRows function, and saves the editing mode state in session storage.
 */
function togleEditingMode() {
    const updateButton = document.getElementById('updateBtn');
    const isEditMode = updateButton.getAttribute('data-editing') === 'true';

    if(isEditMode){
        sessionStorage.removeItem("editingMode");
        window.location.reload();
    } else{
        updateButton.innerText = "Cancel Changes";
        updateButton.style.backgroundColor = '#f44336'; 
        updateButton.setAttribute('data-editing', 'true');
        
        enableEditingRows();

        saveEditingMode(true);   // save the editing mode in the session storage
    }
}

/**
 * Enables the editing of rows in the products page by changing the display style of the edit columns and transforming the content of the cells into input fields:
 *    the function retrieves all the elements with the class "edit-column" and changes their display style to "table-cell" to make them visible.
 *    It then retrieves all the table cells that have a data-field attribute and transforms their content into input fields with the current value of the cell.
 *    The input fields are given unique IDs based on the field name and row ID for later retrieval when saving changes.
 */
function enableEditingRows() {
    const editCols = document.querySelectorAll('.edit-column');
    editCols.forEach(col => col.style.display = 'table-cell');
    const cellsToEdit = document.querySelectorAll('td[data-field]');

    cellsToEdit.forEach(cell => {
        const fieldName = cell.getAttribute('data-field');
        const rowId = cell.parentElement.id.replace('row-', '');
        const currentValue = cell.innerText.replace(' €', '').trim();

        // Trasformiamo il contenuto in un input pulito
       cell.innerHTML = `
            <input type="text" 
                   id="input-${fieldName}-${rowId}" 
                   value="${currentValue}" 
                   class="edit-input"
                   style="width: 90%">`;
    });

}

/**
 * Saves the editing mode state in session storage:
 *    function first get data from the input fields of the selected row, then it validates the price input to ensure it is a valid number then
 *    sends a POST request to the server with the updated book data to save the changes in the database.
 *    If the request is successful, it removes the editing mode state from session storage and reloads the page to reflect the changes.
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
        quantity: parseInt(quantity)
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
            reloadPage();
        } else {
            alert('Error while saving changes');
        }
    } catch (error) {
        console.error('Error while fetch: ', error);
    }
}

/**
 *  Deletes the selected users from the database by sending a POST request to the server with the IDs of the selected users:
 *    the function retrieves all the selected checkbox elements from userIds, and collects their IDs in an array.
 *    If no user is selected, it shows an alert message.
 *    If one or more users are selected, it shows a confirmation dialog.
 *    If confirmed, it sends a POST request to the server with the IDs of the selected users to be deleted.
 * @returns 
 */
async function deleteSelectedUser(){
    const checkboxes = document.querySelectorAll('input[name="userIds"]:checked');
    const ids = Array.from(checkboxes).map(cb => cb.value);

    if (ids.length === 0) {
        alert("Select one or more users to delete");
        return;
    }

    if (confirm("Are you sure you want to delete the selected users?")) {
        try {
            const response = await fetch('/deleteUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds: ids })
            });

            if (response.ok) {
                reloadPage(); // reload page
            } else {
                alert("Error while deleting users.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

/**
 * Add the listeners to the buttons of the products page
 */
function init() {
    const updateButton = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById("deleteBtn");
    const addBtn = document.getElementById("addBtn");

    if(deleteBtn){
        deleteBtn.addEventListener("click", deleteSelectedRows);
    }
    
    if (updateButton) {
        updateButton.onclick = togleEditingMode;
    }

    if(addBtn){
        addBtn.onclick = () => {
            location.href = '/addProduct';
        }
    }

     document.querySelectorAll(".save-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            editSelectedRow(id);
        });
    });
}




document.addEventListener('DOMContentLoaded', init);

module.exports = {
    getSelectedIds,
    validateSelectedIds,
    calculateQtyToRemove,
    paintSelectedRow,
    deleteSelectedRows,
    editSelectedRow,
    reloadPage
};