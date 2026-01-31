import { initFormHandlers } from "./FormHandle.js";
import { buildJson } from "./DataBuilder.js";
import { validatePersonalInfo, validateContactInfo, validateBirthDate } from "./Validate.js";

/**
 * Initializes the CV generation workflow.
 * Attaches a click event listener to the "Generate CV" button that:
 * - Validate Fields
 * - Collects form data from the page(buildJson)
 * - Generates HTML CV content(generateHtmlCv)
 * - Displays a preview of the CV(showPrew)
 * - Saves the CV as an HTML file(saveCv)
 * @function buildData
 * @returns {void}
 */
function buildData() {
    const generateBtn = document.getElementById('generate-cv');
    generateBtn.addEventListener('click', async function (){
        if (!validatePersonalInfo()) {
            alert("Please correct the errors in Personal Information");
            return;
        }
        if (!validateContactInfo()) {
            alert("Please correct the errors in Contact Information");
            return;
        }
        if (!validateBirthDate()) {
            alert("Please correct the errors in Birth Date");
            return;
        }

        const cvData = await buildJson();
        const cv = generateHtmlCv(cvData);
        showPrew(cv);
        await saveCv(cv);
    });
}


function generateHtmlCv(data){
   return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${data.personalInfo.name} ${data.personalInfo.surname}</title>
<style>
    
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", Arial, sans-serif;
}

body {
    background-color: #f4f4f4;
    padding: 30px;
}

.cv-container {
    max-width: 1000px;
    margin: auto;
    background: #fff;
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    min-height: 100vh;
}

.left-col {
    padding: 20px;
}


.cv-header h1 {
    font-size: 32px;
    margin-bottom: 10px;
}

.cv-contact {
    font-size: 14px;
    color: #555;
    margin-bottom: 30px;
}


.cv-section {
    margin-bottom: 30px;
}

.cv-section h2 {
    font-size: 18px;
    text-transform: uppercase;
    border-bottom: 2px solid #ddd;
    padding-bottom: 6px;
    margin-bottom: 15px;
    color: #333;
}

.cv-section ul {
    list-style: none;
}

.cv-section li {
    margin-bottom: 10px;
    line-height: 1.5;
}


.cv-inline-list {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}


.right-col {
    background: #007f8b;
    color: #ffffff;
    padding: 40px 25px;
}


.profile-pic {
    text-align: center;
    margin-bottom: 30px;
}

.profile-pic img {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #ffffff;
}


.right-col h2 {
    font-size: 16px;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(255,255,255,0.5);
    padding-bottom: 6px;
    margin-bottom: 15px;
}

.cv-skills {
    list-style: none;
}

.cv-skills li {
    margin-bottom: 8px;
    font-size: 14px;
}

</style>

</head>

<body>
<main class="cv-container">

    <section class="left-col">
        <header class="cv-header">
            <h1>${data.personalInfo.name} ${data.personalInfo.surname}, ${data.personalInfo.age}</h1>
    
            <p>
                <span>${data.personalInfo.email}</span> 
                <span>${data.personalInfo.phone}</span>
            </p>
        </header>

        <section class="cv-section">
            <h2>Education</h2>
            <ul>
                ${data.education.map(e => `<li>${e}</li>`).join("")}
            </ul>
        </section>

        <section class="cv-section">
            <h2>Work Experience</h2>
            <ul>
                ${data.experience.map(e => `<li>${e}</li>`).join("")}
            </ul>
        </section>

        <section class="cv-section">
            <h2>Languages</h2>
            <ul class="cv-inline-list">
                ${data.languages.map(l => `<li>${l}</li>`).join("")}
            </ul>
        </section>
    </section>

    <aside class="right-col">

            ${data.personalInfo.image ? `
            <div class="profile-pic">
                <img src="${data.personalInfo.image}" alt="Profile picture">
            </div>` : ""}

            <section class="cv-section">
                <h2>Skills</h2>
                <ul class="cv-skills">
                    ${data.skills.map(s => `<li>${s}</li>`).join("")}
                </ul>
            </section>

    </aside>


</main>
</body>
</html>`;
}


/**
 * Displays a preview of the CV in an iframe element.
 * Creates a preview section with a heading and an iframe, then populates
 * the iframe with the CV HTML content using the srcdoc attribute.
 * @function showPrew
 * @param {string} cvContent - The HTML content of the CV to display in the preview
 * @returns {void}
 */
function showPrew(cvContent){
     const container = document.getElementById("generate_cv");
    container.innerHTML = `
        <h2>CV Preview</h2>
        <iframe style="width:100%; height:500px;"></iframe>
    `;
    container.querySelector("iframe").srcdoc = cvContent;
}

/**
 * Saves the CV content to a file on the user's system.
 * Opens a file picker dialog to allow the user to choose the save location,
 * then writes the CV HTML content to the selected file.
 * Uses the File System Access API (showSaveFilePicker) for file handling.
 * @async
 * @function saveCv
 * @param {string} content - The HTML content of the CV to save
 * @returns {Promise<void>} A promise that resolves when the file has been successfully saved
 * @throws {Error} If the user cancels the file picker dialog or if file write operations fail
 */
async function saveCv(content) {
    const fileHandle = await window.showSaveFilePicker({
        suggestedName: "Curriculum_Vitae.html",
        types: [{
            description: "HTML file",
            accept: { "text/html": [".html"] }
        }]
    });

    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
}

document.addEventListener("DOMContentLoaded", () => {
    initFormHandlers(); 
    buildData();
});