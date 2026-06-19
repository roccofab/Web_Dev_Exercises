import { Router } from "express";
import { addDoctor,deleteDoctor,getDoctors} from "../controllers/doctorController";
import { authenticateToken } from "../middleware/auth";
import { authorizeRole } from "../middleware/authorize";


const router = Router();

//CREATE
router.post("/",authenticateToken, authorizeRole(["ADMIN"]), addDoctor);

//DELETE
router.delete("/:id", authenticateToken, authorizeRole(["ADMIN"]), deleteDoctor);

//GET
router.get("/",authenticateToken, authorizeRole(["ADMIN", "EMPLOYEE"]), getDoctors);

export default router;