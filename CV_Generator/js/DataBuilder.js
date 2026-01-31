import { extractList } from "./FormHandle.js";

/**
 * Builds a JSON object from form data.
 * @returns {Object}
 */
export async function buildJson(){
    const imageFile = document.getElementById('image').files[0];
    let imageBase64 = null;
    
    if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
    }
    
    return {
        personalInfo: {
            name:document.getElementById('name').value,
            surname:document.getElementById('surname').value,
            age:document.getElementById('age').value,
            email:document.getElementById('email').value,
            phone:document.getElementById('phone').value,
            image: imageBase64
        },
        education: extractList("ed-list"),
        experience: extractList("experience-list"),
        skills: extractList("skills-list"),
        languages: extractList("languages-list")
    };
}

/**
 * Converts a file to Base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 encoded string
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
