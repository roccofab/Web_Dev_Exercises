
const {saveCheckboxState, saveEditingMode, saveEditedValues, saveAddProdState} = require('../../assets/js/session.js');
global.paintSelectedRow = jest.fn();
global.enableEditingRows = jest.fn();


const dom = `
    <table id="tableBooks">
    <tbody>
    <tr id="row-1">
    <td><input type="checkbox" name="bookIds" value="1"></td>
    <td>1</td>
    <td data-field="title"><strong>Book1</strong></td>
    <td data-field="price">10.00</td>
    <td data-field="author">Author1</td>
    <td data-field="category">Fantasy</td>
    <td data-field="quantity">5</td>
    <td class="edit-column"><button class="save-btn" data-id="1">Save</button></td>
    </tr>

    <tr id="row-2">
    <td><input type="checkbox" name="bookIds" value="2"></td>
    <td>2</td>
    <td data-field="title"><strong>Book2</strong></td>
    <td data-field="price">20.00</td>
    <td data-field="author">Author2</td>
    <td data-field="category">SciFi</td>
    <td data-field="quantity">3</td>
    <td class="edit-column"><button class="save-btn" data-id="2">Save</button></td>
    </tr>
    </tbody>
    </table>

    <button id="updateBtn" data-editing="false">Update</button>

    <form>
    <input name="title">
    <input name="price">
    <input name="author">
    <input name="category">
    <input name="quantity">
    </form>
`;

beforeEach(() => {  // Set up  document body when each test file is loaded
    document.body.innerHTML = dom;
});

beforeEach(() => {  // Clear sessionStorage before each test to ensure a clean state
    sessionStorage.clear();
});

describe("saveCheckboxState", () => {
    console.log("Testing saveCheckboxState function...");
    test("saves the state of the checkboxes in the session storage", () => {
        sessionStorage.setItem("selectedBooks", JSON.stringify(["2"]));
        saveCheckboxState();

        document.dispatchEvent(new Event("DOMContentLoaded"));

        const checkboxes = document.querySelectorAll('input[name="bookIds"]');

        expect(checkboxes[1].checked).toBe(true);
    });
});

describe("saveEditingMode", () => {

    test("store editing mode in sessionStorage", () => {

        saveEditingMode(true);

        expect(sessionStorage.getItem("editingMode")).toBe("true");

    });

});

describe("saveEditedValues", () => {

    test("should restore editing mode UI", () => {

        sessionStorage.setItem("editingMode", "true");

        saveEditedValues();

        document.dispatchEvent(new Event("DOMContentLoaded"));

        const btn = document.getElementById("updateBtn");

        expect(btn.innerText).toBe("Cancel Changes");
        expect(btn.getAttribute("data-editing")).toBe("true");

    });

});

describe("saveAddProdState", () => {

    test("should restore form values", () => {

        const data = {
            title: "Test Book",
            price: "15",
            author: "Test Author",
            category: "Fantasy",
            quantity: "10"
        };

        sessionStorage.setItem("addProdForm", JSON.stringify(data));

        saveAddProdState();

        document.dispatchEvent(new Event("DOMContentLoaded"));

        expect(document.querySelector('[name="title"]').value).toBe("Test Book");
        expect(document.querySelector('[name="price"]').value).toBe("15");

    });

});