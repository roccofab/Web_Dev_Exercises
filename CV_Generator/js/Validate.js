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
    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[a-zA-Z]{2,}$/;
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

function validateBirthDate() {
    const birthDate = document.getElementById("age").value;
    const birthDateError = document.getElementById("age-error");
    
    if (birthDate === "") {
        // Campo opzionale - non mostra errore
        birthDateError.style.display = "none";
        return true;
    }

    const date = new Date(birthDate);
    const today = new Date();
    
    // Check if the date is in the past
    if (date >= today) {
        birthDateError.textContent = "Birth date must be in the past";
        birthDateError.style.display = "block";
        return false;
    }
    
    
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        if (age - 1 < 16) {
            birthDateError.textContent = "You must be at least 16 years old";
            birthDateError.style.display = "block";
            return false;
        }
    } else if (age < 16) {
        birthDateError.textContent = "You must be at least 16 years old";
        birthDateError.style.display = "block";
        return false;
    }
    
    birthDateError.style.display = "none";
    return true;
}

function validateEducationField() {
    const edLevel = document.getElementById("school_ed").value;
    const schoolName = document.getElementById("school_name").value;
    const edError = document.getElementById("education-error");
    
    if (edLevel === "") {
        edError.textContent = "Please select an education level";
        edError.style.display = "block";
        return false;
    }

    if (schoolName.trim() === "") {
        edError.textContent = "School name cannot be empty";
        edError.style.display = "block";
        return false;
    }

    edError.style.display = "none";
    return true;
}

function validateExperienceField() {
    const company = document.getElementById("company_name").value;
    const role = document.getElementById("role").value;
    const duration = document.getElementById("duration").value;
    const expError = document.getElementById("experience-error");

    if (company.trim() === "") {
        expError.textContent = "Company name cannot be empty";
        expError.style.display = "block";
        return false;
    }

    if (role.trim() === "") {
        expError.textContent = "Role/Position cannot be empty";
        expError.style.display = "block";
        return false;
    }

    if (duration.trim() === "") {
        expError.textContent = "Duration cannot be empty";
        expError.style.display = "block";
        return false;
    }

    expError.style.display = "none";
    return true;
}

function validateSkillField() {
    const skill = document.getElementById("skill").value;
    const skillError = document.getElementById("skill-error");

    if (skill.trim() === "") {
        skillError.textContent = "Skill cannot be empty";
        skillError.style.display = "block";
        return false;
    }

    skillError.style.display = "none";
    return true;
}

function validateLanguageField() {
    const language = document.getElementById("languages").value;
    const langError = document.getElementById("language-error");

    if (language.trim() === "") {
        langError.textContent = "Language cannot be empty";
        langError.style.display = "block";
        return false;
    }

    langError.style.display = "none";
    return true;
}

export { 
    validatePersonalInfo,
    validateContactInfo,
    validateBirthDate,
    validateEducationField,
    validateExperienceField,
    validateSkillField,
    validateLanguageField
};