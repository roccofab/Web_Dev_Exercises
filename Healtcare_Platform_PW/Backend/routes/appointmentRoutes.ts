import { Router } from "express";
import {createAppointment,
    getAppointments,
    filterByDate,
    filterByDoctorId,
    filterByPatientId,
    deleteAppointment
} from "../controllers/appointmentController";

const router = Router();

//CREATE 
router.post("/", createAppointment);

//READ
router.get("/", getAppointments);
router.get("by-date", filterByDate);
router.get("by-doctor", filterByDoctorId);
router.get("by-patient", filterByPatientId);

//DELETE
router.delete("/:id", deleteAppointment);

export default router;