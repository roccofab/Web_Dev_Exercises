# Web CV Generator
### This application generate simple standard cv in html format. The user can entry personal informations, contacts, work experiences, skills, languages and his image in .png format. The application then generate the cv by following a standard structure and It can be saved wherever the user prefers locally or on external storage media.

## Use Application Online:
https://web-dev-exercises-qmhr.onrender.com

## Repo Structure:

```
CV_Generator
├─ .idea
│  ├─ ex5_html_lab.iml
│  ├─ misc.xml
│  ├─ modules.xml
│  └─ workspace.xml
├─ assets   <-- cheatsheets and utilities
│  ├─ cv.css
│  └─ style.css
├─ data
│  └─ Curriculum_Vitae.html     <-- CV example
├─ index.html   <-- Main Page
│
├─ js      <-- Application Core Functionalities
│  ├─ Cookie.js   <-- Persistent Cookie Generation-Loading 
│  ├─ CvBuilder.js   <-- Dinamyc CV Builder-CV Storage-Preview**
│  ├─ DataBuilder.js    <-- JSON Object Builder
│  ├─ FormHandle.js   <--Handle Data Entry/Listeners
│  └─ Validate.js    <-- Validate Data
├─ package-lock.json
├─ package.json
├─ README.MD
├─ script.js
└─ test
   └─ Validate.test.js

```

## Tech Stack
- **UI**:   Html + CSS
- **Language:**  Javascript
- **Data:**  JSON
- **Deploy:**  Render

## Installation and Usage:
### If you need to locally install the application follow these steps:
1. **Clone the repository:**

          git clone https://github.com/roccofab/Web_Dev_Exercises/tree/main/CV_Generator

2. **Install Dependencies:**
        cd CV_Generator

        npm install

3. **Open index.html by using the browser that you prefer or use Live Server.**



      