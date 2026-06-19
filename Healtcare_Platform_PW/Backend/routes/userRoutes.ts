import { Router } from 'express';
import { addUser, getUsers, filterById, deleteUser } from '../controllers/userController';
import { authenticateToken } from "../middleware/auth";
import { authorizeRole } from "../middleware/authorize";

const router = Router();

//CREATE
router.post("/", addUser);

//GET
router.get("/", authenticateToken, authorizeRole(["ADMIN"]), getUsers);
router.get("/:id", authenticateToken, authorizeRole(["ADMIN"]), filterById);

//DELETE
router.delete("/:id", deleteUser);

export default router;