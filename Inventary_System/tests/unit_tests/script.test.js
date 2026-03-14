
//test functions from script.js
const script = require('../../assets/js/script.js');

const {
    getSelectedIds,
    validateSelectedIds,
    calculateQtyToRemove,
    paintSelectedRow,
    editSelectedRow,
    deleteSelectedRows
} = script;

global.fetch = jest.fn();
global.sessionStorage = { removeItem: jest.fn() };

global.alert = jest.fn();  //mock fetch
global.confirm = jest.fn();  //mpck confirm
global.prompt = jest.fn();   //mock prompt


beforeEach(() => {  
    jest.clearAllMocks();   //reset all the mocks before each test is loaded
});


//selectedIds test
describe("getSelectedIds", () => {
    test("returns selected ids", () => {
        document.body.innerHTML = `
            <input type="checkbox" name="bookIds" value="1" checked>
            <input type="checkbox" name="bookIds" value="2">
            <input type="checkbox" name="bookIds" value="3">
            <input type="checkbox" name="bookIds" value="4" checked>
        `;
        const selectedIds = getSelectedIds();
        expect(selectedIds).toEqual(["1", "4"]);
    });
});

//validateSelectedIds test
describe("validateSelectedIds", () => {
    test("returns false if more than one id is selected", () => {
        const result = validateSelectedIds(["1", "2"]);
        expect(result).toEqual({valid:false, message:"You can only change the availability of one book per time"});
    });

    test("returns false if no id is selected", () => {
        const result = validateSelectedIds([]);
        expect(result).toEqual({valid:false, message:null});
    });

    test("returns true if one id is selected", () => {
        const result = validateSelectedIds(["1"]);
        expect(result).toEqual({valid:true});
    });
});

//calculateQtyToRemove test1
test("calculateQtyToRemove", () => {
    expect(calculateQtyToRemove(10)).toBe(-10);
});

//calculateQtyToRemove test2
test("calculateQtyToRemove returns null if quantity is not valid(isNaN, < 0, == 0", () => {
    expect(calculateQtyToRemove("not_a_number")).toBeNull();
    expect(calculateQtyToRemove(-5)).toBeNull();
    expect(calculateQtyToRemove(0)).toBeNull();
});

//paintSelectedRow test
describe("paintSelectedRow", () => {
    test("paints the row of the selected checkbox", () => {
        document.body.innerHTML = `
            <table>
                <tr id="row-1"><td>Book 1</td></tr>
                <tr id="row-2"><td>Book 2</td></tr>
            </table>
        `;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        paintSelectedRow(checkbox, "1");
        const row = document.getElementById("row-1");
        expect(row.style.backgroundColor).toContain("rgba(204, 204, 204, 0.58)");
    });
});

//editSelectedRow API POST test
describe("editSelectedRow API POST", () => {
    test("sends a POST request to the API with the correct data to edit row", async () => {
        const id = "10";
        const title = "New Title";
        const price = "19.99";
        const author = "New Author";
        const category = "New Category";
        const quantity = "5";

        document.body.innerHTML = `
            <input id="input-title-${id}" value="Book Test">
            <input id="input-price-${id}" value="20,50">
            <input id="input-author-${id}" value="Author Test">
            <input id="input-category-${id}" value="Fantasy">
            <input id="input-quantity-${id}" value="10">
        `;

        global.fetch.mockResolvedValueOnce({ ok: true });
        await editSelectedRow(id);

        expect(global.fetch).toHaveBeenCalledWith("/update", {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body: JSON.stringify({
                id: id,
                title: "Book Test",
                price: 20.50, 
                author: "Author Test",
                category: "Fantasy",
                quantity: 10
            })
        });
    });
});


