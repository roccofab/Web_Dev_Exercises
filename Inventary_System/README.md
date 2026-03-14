

## USAGE
   1.  Create Database and Populate it:  
       -  Go to the root folder and type:
                
                npm run setup-db

         This command creates the database app_data.db in /models/data and populate it with the tables **users,credentials and books**
```
example3
├─ .env
├─ assets
│  ├─ add.css
│  ├─ img
│  │  ├─ back.png
│  │  └─ back_login.png
│  ├─ js
│  │  ├─ particles.min.js
│  │  ├─ particlesjs-config.json
│  │  ├─ script.js
│  │  └─ session.js
│  ├─ login.css
│  └─ Main.css
├─ controllers
│  ├─ authController.js
│  ├─ booksController.js
│  └─ userController.js
├─ db
│  ├─ create_tables.js
│  └─ init_admin.js
├─ index.js
├─ models
│  ├─ books.json
│  ├─ connection.js
│  ├─ data
│  │  └─ app_data.db
│  ├─ database.js
│  └─ userModel.js
├─ package-lock.json
├─ package.json
├─ README.md
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