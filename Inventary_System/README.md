#  Inventary Management System Full-Stack Web Application
### Inventary System is a web app for managing product/book inventary with session authentication, catalog CRUD, a secure login system, user management, and a basic RBAC (Role-Based Access Control) system. Core stack: Node.js + Express + EJS + SQLite (better-sqlite3), UI with TailwindCSS + DaisyUI, JavaScript logical client (fetch/AJAX), and UI state persistence via sessionStorage. NB: the system was designed for books inventary management, but its functions can easily be extended for an inventary system of generic products.


https://github.com/user-attachments/assets/d87b274c-bbb7-4c97-9ec0-237f77156f0a


## Enviroment and Requirements:

### Functionalities:
- **Login Secure System + Rate Limit:** passwords are hashed by using bcrypt library and then saved into database.

- **Login Client Authentication(Session server-side)**.

- **Basic RBAC(Role Based Access Control):** only the admin clients can check/add/delete/update users data.

- **Secure password validation with real-time feedback**

- **CRUD operations on products catalog:** Show products catalog, Add product, Delete product, Update product(editing mode).

- **Product Search and Filtering by section(A-F)**.

- **CRUD operations on users list:** only ADMIN can perform operations on users list.

- **Modern and Reactive UI with state persistance based on the stack:** html, CSS, tailwind CSS, DaisyUI and javascript.

- **Unit Test and Integration Test:** UI components tested by using jest library, database operations tested by using in-memory simulated database.

### API/Pages:
- **Auth:**

    - GET /login
    - POST /login
    - GET /logout

- **Products:**

   - GET /dbProducts
   - GET /addProduct
   - POST /add
   - POST /delete
   - POST /update
   - POST /updateQty

- **Users:**

   - GET /addUser
   - POST /register 
   - POST /deleteUser

### Technologies:
- HTTP Server(index.js)

- node.js + Express

- ejs rendering engine

- SQLite Database

- Auth

- SessionStorage

- html, CSS, tailwind CSS, DaisyUI and javascript

- Jest library for testing UI Components.

- Docker Compose

## Prerequisites:
#### Local Usage:
- Node.js (>= 18 recommended)
- npm

#### Docker Execution:
- Docker: all dependencies(Node.js, npm, libraries) are already included in the container.

## USAGE BY USING DOCKER WITH COMPOSE(reccomended):
- Make sure you have Docker installed

- Clone the repository:

      git clone <repo-url>

- Go to the root folder:

      cd <project-root-folder>

- Build and start containers:

      docker compose up --build


## USAGE BY USING DOCKER WITHOUT COMPOSE:
#### - Clone repository.

#### - Go to the root folder.

#### - Build the image:

      docker build -t inventory-app .

#### - Run the container:
 
      docker run -p 5000:5000 inventory-app
      

## LOCAL USAGE:

#### 1.  Create .env file in the root, ensure no other services are running on port 5000 and insert the following env variables:

        SESSION_SECRET=your_secret_string
        DB_PATH=./models/data/app_data.db
        PORT=5000 

#### 2.  Install dependencies:

        npm install

#### 3.  Create Database and Populate it:  
  -  Go to the root folder and type:
              
            node db/init_db.js

      This command creates the SQLite database if it does not exists, creates the tables **users, credentials and books** and generate a new ADMIN for the first app usage.

#### 4.  Run application by typing  from the root folder:

        node index.js

#### 5. **First Login:**

    username: admin_test

    password: admin.systemTest1

#### 6. Open the URL


#### 7. **Testing:** if you need to check unit e integration tests, go to the root folder and type:

         -  npx jest tests/unit_tests

         -   npx jest tests/integration_tests
      

## Structure
#### Application follow MVC(Model-View-Controller) Design Pattern:

- **View (EJS):** Server-side templates (views/) that render HTML pages.

- **Controller (Express route handlers):** Application logic and orchestration (controllers/).

- **Model(Data Access):** SQL queries and SQLite transactions (models/).

- **Assets(Frontend):** Static CSS/JS served by Express (assets/).

```
Inventary_System
├─ .dockerignore
├─ assets
│  ├─ add.css
│  ├─ img
│  │  ├─ back.png
│  │  ├─ back_login.png
│  │  └─ group.png
│  ├─ js
│  │  ├─ particles.min.js
│  │  ├─ particlesjs-config.json
│  │  ├─ script.js
│  │  ├─ session.js
│  │  └─ user.js
│  ├─ login.css
│  ├─ Main.css
│  ├─ output.css
│  └─ tailwind.css
├─ controllers
│  ├─ authController.js
│  ├─ productsController.js
│  └─ userController.js
├─ db
│  ├─ create_tables.js
│  └─ init_admin.js
├─ index.js
├─ models
│  ├─ books.json
│  ├─ connection.js
│  ├─ data
│  ├─ productsModel.js
│  └─ userModel.js
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ README.md
├─ tailwind.config.js
├─ tests
│  ├─ integration_tests
│  └─ unit_tests
│     ├─ script.test.js
│     └─ session.test.js
└─ views
   ├─ addProd.ejs
   ├─ addUser.ejs
   ├─ login.ejs
   └─ productsPage.ejs

```

## Application Overview
<video src="assets\img\preview_video.mp4" width="600" controls autoplay muted>
  File not supported
</video>
