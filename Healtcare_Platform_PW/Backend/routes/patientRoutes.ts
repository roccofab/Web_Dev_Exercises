import {Router} from 'express';
import {addPatient,getPatients,getByFiscalCode} from '../controllers/patientController';
import { authenticateToken } from "../middleware/auth";
import { authorizeRole } from "../middleware/authorize";

const router = Router();

//CREATE
router.post("/", authenticateToken, authorizeRole(["ADMIN", "EMPLOYEE"]), addPatient);

//GET
router.get("/",authenticateToken, authorizeRole(["ADMIN", "EMPLOYEE"]), getPatients);
router.get("/by-fiscal-code", authenticateToken, authorizeRole(["ADMIN", "EMPLOYEE"]), getByFiscalCode);

export default router;