
function validatePersonalInfo() {
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const nameError = document.getElementById("name-error");
    const surnameError = document.getElementById("surname-error");
    const regex = /^[A-ZÀ-ÿ][a-zà-ÿ]{1,19}(\s[A-ZÀ-ÿ][a-zà-ÿ]{1,19})*$/;

    if(name == "" || surname == "") {
        alert("Name and Surname cannot be empty.");
        return false;
    }

    if (!regex.test(name)) {
        // show error message
        nameError.style.display = "block";
        return false;
    } else {
        // hide error if the name is valid
        nameError.style.display = "none";
    }
    if (!regex.test(surname)) {
        surnameError.style.display = "block";
        return false;
    } else {
        surnameError.style.display = "none";
    }
    return true;
}

function validateContactInfo() {
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const emailError = document.getElementById("email-error");
    const phoneError = document.getElementById("phone-error");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    if(email == "" || phone == "") {
        alert("Email and Phone cannot be empty.");
        return false;
    }

    if (!emailRegex.test(email)) {
        emailError.style.display = "block";
        return false;
    } else {
        emailError.style.display = "none";
    }
    if (!phoneRegex.test(phone)) {
        phoneError.style.display = "block";
        return false;
    } else {
        phoneError.style.display = "none";
    }
    return true;
}
function addSchool() {
    const addBtn = document.getElementById("add-btn-ed");
    const schoolList = document.getElementById("ed-list");

    addBtn.addEventListener("click", function () {
        const edLevel = document.getElementById("school_ed").value;
        const schoolName = document.getElementById("school_name").value;
        if (edLevel === "" || schoolName === "") {
            alert("Please fill in both Education fields before adding.");
            return;
        }

        //create list item
        const listItem = document.createElement("li");
        listItem.style.display="flex";
        listItem.style.justifyContent="space-between";
        listItem.style.marginBottom="5px";
        listItem.style.padding="5px";
        listItem.style.borderBottom="1px solid #ccc";

        // create span for experience details
        const textSpan = document.createElement("span");
        textSpan.textContent = `${edLevel}, ${schoolName}`;

        //create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "❌";   // delete emoji
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "none";
        deleteBtn.onclick = function() {
            listItem.remove();
        };

        // append span and button to list item
        listItem.appendChild(textSpan);
        listItem.appendChild(deleteBtn);
        schoolList.appendChild(listItem);

        //clean fields
        document.getElementById("school_ed").value = "";
        document.getElementById("school_name").value = "";
    });
}

function addExperience() {
    const addBtn = document.getElementById("add-btn-exp");
    const expList = document.getElementById("experience-list");

    addBtn.addEventListener("click", function () {
        const name = document.getElementById("company_name").value;
        const role = document.getElementById("role").value;
        const duration = document.getElementById("duration").value;
        if (name === "" || role === "" || duration === "") {
            alert("Please fill in all Experience fields before adding.");
            return;
        }
        //create list item
        const listItem = document.createElement("li");
        listItem.style.display="flex";
        listItem.style.justifyContent="space-between";
        listItem.style.marginBottom="5px";
        listItem.style.padding="5px";
        listItem.style.borderBottom="1px solid #ccc";

        // create span for experience details
        const textSpan = document.createElement("span");
        textSpan.textContent = `${name}, ${role}, ${duration}`;

        //create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "❌";   // delete emoji
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "none";
        deleteBtn.onclick = function() {
            listItem.remove();
        };
        // append span and button to list item
        listItem.appendChild(textSpan);
        listItem.appendChild(deleteBtn);
        expList.appendChild(listItem);

        //clean fields
        document.getElementById("company_name").value = "";
        document.getElementById("role").value = "";
        document.getElementById("duration").value = "";

    });
}

function addSkills(){
    const addBtn = document.getElementById("add-btn-skill");
    const skillList = document.getElementById("skills-list");

    addBtn.addEventListener("click", function () {
        const skill = document.getElementById("skill").value;
        if (skill === "") {
            alert("Please enter a skill before adding.");
            return;
        }
        
        //create list item
        const listItem = document.createElement("li");
        listItem.style.display="flex";
        listItem.style.justifyContent="space-between";
        listItem.style.marginBottom="5px";
        listItem.style.padding="5px";
        listItem.style.borderBottom="1px solid #ccc";

        // create span for skill details
        const textSpan = document.createElement("span");
        textSpan.textContent = skill;

        //create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "❌";   // delete emoji
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "none";
        deleteBtn.onclick = function() {
            listItem.remove();
        };
        // append button to list item
        listItem.appendChild(textSpan);
        listItem.appendChild(deleteBtn);
        skillList.appendChild(listItem);

        

        //clean field
        document.getElementById("skill").value = "";
        
    });

}

function addLang(){
    const addBtn = document.getElementById("add-btn-lang");
    const langList = document.getElementById("languages-list");

    addBtn.addEventListener("click", function() {
        const lang = document.getElementById("languages").value;
        if (lang === "") {
            alert("Please enter a language before adding.");
            return;
        }
        const listItem = document.createElement("li");
        listItem.style.display="flex";
        listItem.style.justifyContent="space-between";
        listItem.style.marginBottom="5px";
        listItem.style.padding="5px";
        listItem.style.borderBottom="1px solid #ccc";

       
        const textSpan = document.createElement("span");
        textSpan.textContent = lang;

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "❌";   // delete emoji
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "none";
        deleteBtn.onclick = function() {
            listItem.remove();
        };

        listItem.appendChild(textSpan);
        listItem.appendChild(deleteBtn);
        langList.appendChild(listItem);

        document.getElementById("languages").value = "";
    });
}

window.onload = function () {
    addSchool();
    addExperience();
    addSkills();
    addLang();
}