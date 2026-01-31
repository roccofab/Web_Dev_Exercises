import { validateEducationField, validateExperienceField, validateSkillField, validateLanguageField } from "./Validate.js";

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
        deleteBtn.addEventListener("click", () => listItem.remove());

        listItem.append(textSpan, deleteBtn);
        schoolList.appendChild(listItem);

        document.getElementById("school_ed").value = "";
        document.getElementById("school_name").value = "";
    });
}

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
        deleteBtn.addEventListener("click", () => listItem.remove());

        listItem.append(textSpan, deleteBtn);
        expList.appendChild(listItem);

        document.getElementById("company_name").value = "";
        document.getElementById("role").value = "";
        document.getElementById("duration").value = "";
    });
}

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
        deleteBtn.onclick = () => listItem.remove();

        listItem.append(textSpan, deleteBtn);
        skillList.appendChild(listItem);

        document.getElementById("skill").value = "";
    });

}

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
        deleteBtn.onclick = () => listItem.remove();

        listItem.append(textSpan, deleteBtn);
        langList.appendChild(listItem);

        document.getElementById("languages").value = "";
    });
}


export function extractList(listId) {
// Extracts text content from list items within a specified list
    return Array.from(
        document.querySelectorAll(`#${listId} .cv-list-item .cv-item-text`)
    ).map(li => li.textContent);
}

export function initFormHandlers() {
    addSchool();
    addExperience();
    addSkills();
    addLang();
}
