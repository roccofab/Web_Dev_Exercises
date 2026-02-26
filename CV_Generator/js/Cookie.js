

/**
 * Create expires date and first set it to the current date
 * Add 7 days in milliseconds to expires date 
 * Cast the expires date to UTC
 * Create cookie and save it in the browser
 * @param {String} name - Cookie Name
 * @param {String} value  -Cookie value
 * @param {number} days   - cookie duration (default number of days is 7) 
 */
function setCookie(name, value, days = 7) {
    const expires = new Date();  //expires date is initialized to current date
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);  // set expires date to 7 days in milliseconds starting from current date 
    //create the cookie to save in the browser
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

/**
 * Get a cookie from its name
 * First get all the cookies of the page and split its into an array
 * Clear empty spaces
 * Iterate over the array of cookies and search for the cookie's name to get
 * @param {String} name  -cookie's name to get 
 * @returns -cookie value or null
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

/**
 * Save user input from the page's form fields and dynamic lists into cookies.
 * This function is called when the cookieConsent cookie is set to accepted.
 *
 * The following types of data are stored:
 *   1. Basic inputs (text, number, tel, date).
 *   2. Arrays from unordered lists (education entries, work experience, skills,
 *      and languages) serialized as JSON strings.
 *
 * Each field or list item is written to a separate cookie using `setCookie`.
 *
 * @returns {void}  No value is returned.
 */
function saveFormData() {
    if (getCookie('cookieConsent') !== 'accepted') return;

    // basic fields: input text, input number, input tel, input date 
    const fields = ['name', 'surname', 'age', 'email', 'phone', 'school_ed', 'school_name'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            setCookie(field, element.value);
        }
    });

    // Saves input lists as an array json: 
    const lists = {
        education: 'ed-list',
        experience: 'experience-list',
        skills: 'skills-list',
        languages: 'languages-list'
    };
    Object.keys(lists).forEach(key => {
        const ul = document.getElementById(lists[key]);
        if (ul) {
            const items = Array.from(ul.children).map(li => li.textContent);
            setCookie(key, JSON.stringify(items));
        }
    });
}


/**
 * Load previously saved form data from cookies and populate the page.
 *
 * First checks the cookieConsent cookie: 
 *  if its value is accepted then fills simple input fields and reconstructs any dynamic lists
 * (education, experience, skills, languages) from JSON string stored in cookies.
 * Invalid JSON is caught and logged to the console.
 *
 * @returns {void}
 */
function loadFormData() {
    if (getCookie('cookieConsent') !== 'accepted') return;

    // basic fields: input text, input date, input tel
    const fields = ['name', 'surname', 'age', 'email', 'phone', 'school_ed', 'school_name'];
    fields.forEach(field => {
        const value = getCookie(field);
        const element = document.getElementById(field);
        if (value && element) {
            element.value = value;
        }
    });

    // Dynamic lists: loads data from JSON string stored in the cookie and populate items
    const lists = {
        education: 'ed-list',
        experience: 'experience-list',
        skills: 'skills-list',
        languages: 'languages-list'
    };
    Object.keys(lists).forEach(key => {
        const value = getCookie(key);
        const ul = document.getElementById(lists[key]);
        if (value && ul) {
            try {
                const items = JSON.parse(value);
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                });
            } catch (e) {
                console.error('Errore nel parsing dei cookie per', key, e);
            }
        }
    });
}

export { setCookie, getCookie, saveFormData, loadFormData, initCookieBanner };


/**
 * Initialize and display the cookie consent banner if the user has not yet made a
 * choice.
 *
 * This function reads the "cookieConsent" cookie; if its value is already
 * "accepted" or "rejected" the banner will not be shown. Otherwise, it makes
 * the banner element visible.
 *
 * Clicking a button stores the corresponding consent value (persisted for the expires time set in the cookie)
 * and hides the banner.
 *
 * @returns {void} Modifies the DOM and writes a consent cookie when buttons are
 *     clicked.
 */
function initCookieBanner() {
    const consent = getCookie('cookieConsent');
    if (consent === 'accepted' || consent === 'rejected') {
        return; // the user has already made his choice
    }

    const banner = document.getElementById('cookie-banner');
    if (banner) {   //show banner cookie
        banner.style.display = 'block';
    }

    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    if (acceptBtn) {   //if accepted then setCookie in the browser and hide the banner cookie
        acceptBtn.addEventListener('click', () => {
            setCookie('cookieConsent', 'accepted', 365);
            banner.style.display = 'none';
        });
    }

    if (rejectBtn) {   //if rejected then setCookie as rejected and hide the banner cookie
        rejectBtn.addEventListener('click', () => {
            setCookie('cookieConsent', 'rejected', 365);
            banner.style.display = 'none';
        });
    }
}
