import { validateEducationField, validateExperienceField, validateSkillField, validateLanguageField } from "./Validate.js";
import { saveFormData } from "./Cookie.js";

/**
 * Attach listener to the Add Education button and handle adding a new school entry to the education list.
 * Values are validated using validateEducationField before a list item is created.
 * The function also resets the input fields, registers a delete handler for the generated item, and triggers `saveFormData` after
 * any change so that the state can be persisted in cookies.
 */
function addSchool() {
    console.log("Registering addSchool event listener");
    const addBtn = document.getElementById("add-btn-ed");
    const schoolList = document.getElementById("ed-list");

    addBtn.addEventListener("click", function () {
        console.log("addSchool button clicked");
        const edLevel = document.getElementById("school_ed").value;
        const schoolName = document.getElementById("school_name").value.trim();
        if (!validateEducationField()) {
            console.log("Education validation failed");
            return;
        }

        //create list item
        const listItem = document.createElement("li");
        listItem.classList.add("cv-list-item");

        const textSpan = document.createElement("span");
        textSpan.classList.add("cv-item-text");
        textSpan.textContent = `${edLevel}, ${schoolName}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => {
            listItem.remove();
            saveFormData();
        });

        listItem.append(textSpan, deleteBtn);
        schoolList.appendChild(listItem);

        document.getElementById("school_ed").value = "";
        document.getElementById("school_name").value = "";
        saveFormData();
    });
}

/**
 * Attach listener to the "Add Experience" button and handle adding a new professional experience entry.
 * The input fields for company, role and duration are validated via validateExperienceField function.
 * On successful validation a new list item is built with a delete button and appended to the
 * experience list.  Inputs are cleared and data is saved after each modification.
 */
function addExperience() {
    const addBtn = document.getElementById("add-btn-exp");
    const expList = document.getElementById("experience-list");

    addBtn.addEventListener("click", function () {
        const name = document.getElementById("company_name").value.trim();
        const role = document.getElementById("role").value.trim();
        const duration = document.getElementById("duration").value.trim();
        if (!validateExperienceField()) {
            return;
        }

        //create list item
        const listItem = document.createElement("li");
        listItem.classList.add("cv-list-item");

        const textSpan = document.createElement("span");
        textSpan.classList.add("cv-item-text");
        textSpan.textContent = `${name}, ${role}, ${duration}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => {
            listItem.remove();
            saveFormData();
        });

        listItem.append(textSpan, deleteBtn);
        expList.appendChild(listItem);

        document.getElementById("company_name").value = "";
        document.getElementById("role").value = "";
        document.getElementById("duration").value = "";
        saveFormData();
    });
}

/**
 * Attach a listener to the Add Skill button.
 * Validates the skill field using validateSkillField then creates a list item, adds a deletion
 * handler, appends it to the skills list and clears the input.
 * The current form state is saved after every change.
 */
function addSkills(){
    const addBtn = document.getElementById("add-btn-skill");
    const skillList = document.getElementById("skills-list");

    addBtn.addEventListener("click", function () {
        const skill = document.getElementById("skill").value.trim();
        if (!validateSkillField()) {
            return;
        }
        
        //create list item
        const listItem = document.createElement("li");
        listItem.classList.add("cv-list-item");

        const textSpan = document.createElement("span");
        textSpan.classList.add("cv-item-text");
        textSpan.textContent = skill;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => {
            listItem.remove();
            saveFormData();
        });

        listItem.append(textSpan, deleteBtn);
        skillList.appendChild(listItem);

        document.getElementById("skill").value = "";
        saveFormData();
    });

}

/**
 * Attach a listener to the Add Language button. 
 * The language input is validated using validateLanguageField; a list item with delete
 * functionality is created and appended to the languages list.
 * The input is cleared and form state saved after modifications.
 */
function addLang(){
    const addBtn = document.getElementById("add-btn-lang");
    const langList = document.getElementById("languages-list");

    addBtn.addEventListener("click", function() {
        if (!validateLanguageField()) {
            return;
        }

        const lang = document.getElementById("languages").value.trim();
        
        const listItem = document.createElement("li");
        listItem.classList.add("cv-list-item");

        const textSpan = document.createElement("span");
        textSpan.classList.add("cv-item-text");
        textSpan.textContent = lang;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => {
            listItem.remove();
            saveFormData();
        });

        listItem.append(textSpan, deleteBtn);
        langList.appendChild(listItem);

        document.getElementById("languages").value = "";
        saveFormData();
    });
}


/**
 * Extract all text entries from a dynamic list by its element id.
 *
 * @param {string} listId - The id attribute of a `<ul>` or `<ol>` that
 * contains `.cv-list-item` elements.  Only the text from
 * `.cv-item-text` descendants is returned.
 * @returns {string[]} Array of text contents for each list item.
 */
export function extractList(listId) {
    return Array.from(
        document.querySelectorAll(`#${listId} .cv-list-item .cv-item-text`)
    ).map(li => li.textContent);
}


export function initFormHandlers() {
    addSchool();
    addExperience();
    addSkills();
    addLang();
    addInputListeners();
}

/**
 * Attach input event listeners to every basic text field in the form so that typing immediately updates the stored cookie state.
 */
function addInputListeners() {
    const fields = ['name', 'surname', 'age', 'email', 'phone', 'school_ed', 'school_name', 'company_name', 'role', 'duration', 'skill', 'languages'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('input', saveFormData);
        }
    });
}
