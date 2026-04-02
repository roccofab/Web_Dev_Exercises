
/**
 * Validates the password against a set of rules.
 * @param {String} password - The password to validate.
 * @returns {Boolean} - True if the password matches all rules, false otherwise.
 */
function validatePasswordUI(password) {
    const rules = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };

    // utility to update paragraph color
    function setValid(id, isValid) {
        const el = document.getElementById(id);
        if (!el) return;

        if (isValid) {
            el.classList.remove("text-red-500");
            el.classList.add("text-green-500"); 
        } else {
            el.classList.remove("text-green-500");
            el.classList.add("text-red-500");
        }
    }

    setValid("rule-length", rules.length);
    setValid("rule-upper", rules.upper);
    setValid("rule-lower", rules.lower);
    setValid("rule-number", rules.number);
    setValid("rule-special", rules.special);

    
    return Object.values(rules).every(v => v);
}

/**
 *  Initializes the password validation UI and event listeners.
 * This function sets up the password input field to show validation rules when focused,
 * and validates the password in real-time as the user types. It also handles form submission to ensure the password meets all criteria.
 * @returns  {void}
 */
function initUserPswd(){
    const form = document.querySelector("form");
    const passwordInput = document.getElementById("password");
    const rulesContainer = document.getElementById("passwordRules");

    if (!form || !passwordInput || !rulesContainer) return;

    // remove style hidden when the user click on passwordInput field
    passwordInput.addEventListener("focus", () => {
        rulesContainer.classList.remove("hidden");
    });

    // Mentre scrivi
    passwordInput.addEventListener("input", () => {
        const value = passwordInput.value;

        if (value.length > 0) {
            rulesContainer.classList.remove("hidden");
            validatePasswordUI(value);
        } else {
            // hide rulesContainer if the user clear the passwordInput field
            rulesContainer.classList.add("hidden");
        }
    });

    // hide rulesContainer when the user clear the passwordInput field and click on another field 
    passwordInput.addEventListener("blur", () => {
        if (passwordInput.value.length === 0) {
            rulesContainer.classList.add("hidden");
        }
    });

    // SUBMIT
    form.addEventListener("submit", function (e) {
        const isValid = validatePasswordUI(passwordInput.value);

        if (!isValid) {
            e.preventDefault();
            rulesContainer.classList.remove("hidden"); 
        }
    });
}

document.addEventListener("DOMContentLoaded", initUserPswd);