import express from "express";
import { AppDataSource } from "./config/connection";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000; 

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connection:", error);
  });