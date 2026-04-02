/*
 * Client-Side sessionStorage implementation to save the state of the UI, such as: 
 *     selected rows to delete,
 *     the editing mode,
 *     the edited values,
 *     checked checkboxes...
 * Session Storage allows user not to lose data entered but not yet saved permanently when the user refresh the page,
 *     or when the user leave the data entered pending and return to the page later,
 *     or if the internet connection goes away and the page needs to be reloaded.
 * 
 * The sessionStorage object stores data for one session (data is lost when the browser tab is closed).
 */


/**
 * Save the state of the checkboxes when the page is loaded in the session storage,
 *    so that when the user refreshes the page or comes back to the page later, the state of the checkboxes is restored.
 */
function saveCheckboxState() {
        const checkboxes = document.querySelectorAll('input[name="bookIds"]');
        const key = "selectedBooks";


        const saved = JSON.parse(sessionStorage.getItem(key) || "[]");

        checkboxes.forEach(cb => {
            if (saved.includes(cb.value)) {
                cb.checked = true;
                paintSelectedRow(cb, cb.value);
            }
        });


        checkboxes.forEach(cb => {
            cb.addEventListener("change", () => {
                const selected = Array.from(checkboxes)
                    .filter(c => c.checked)
                    .map(c => c.value);

                sessionStorage.setItem(key, JSON.stringify(selected));
            });
        });
}

/**
 * This function is used to save the state of the editing mode in the session storage,
 *     so that when the user refreshes the page or comes back to the page later, the state of the editing mode is restored.
 * 
 * The editing mode is active when the user clicks on the edit button, and it is deactivated when the user clicks
 *      on the save button or when the user clicks on the Delete button.
 * @param {Boolean} isEditing  - true if the editing mode is active, false otherwise
 */
function saveEditingMode(isEditing) {
    sessionStorage.setItem("editingMode", isEditing);
}

function saveEditedValues(){
        const isEditing = sessionStorage.getItem("editingMode");

        if(isEditing === "true") {
            const updateButton = document.getElementById("updateBtn");

            if (updateButton) {
                updateButton.innerText = "Cancel Changes";
                updateButton.style.backgroundColor = "#f44336";
                updateButton.setAttribute("data-editing", "true");

                enableEditingRows(); // restore the editing mode
            }
        }
}

/**
 * This function is used to save the state of the add product form in the session storage,
 *     so that when the user refreshes the page or comes back to the page later, the state of the add product form is restored.
 * 
 */
function saveAddProdState() {
        const form = document.querySelector('form');
        const key = "addProdForm";
        const savedState = sessionStorage.getItem(key);

        if (savedState) {
            const data = JSON.parse(savedState);

            if (form.elements["title"])
                form.elements["title"].value = data.title || "";

            if (form.elements["price"])
                form.elements["price"].value = data.price || "";

            if (form.elements["author"])
                form.elements["author"].value = data.author || "";

            if (form.elements["category"])
                form.elements["category"].value = data.category || "";

            if(form.elements["quantity"])
                form.elements["quantity"].value = data.quantity || "";
        }

        form.addEventListener("input", () => {
            const formData = {
                title: form.elements["title"] ? form.elements["title"].value : "",
                price: form.elements["price"] ? form.elements["price"].value : "",
                author: form.elements["author"] ? form.elements["author"].value : "",
                category: form.elements["category"] ? form.elements["category"].value : "",
                quantity: form.elements["quantity"] ? form.elements["quantity"].value : ""
            };
            sessionStorage.setItem(key, JSON.stringify(formData));
        });

        form.addEventListener("submit", () => {
            sessionStorage.removeItem(key);
        });
}

