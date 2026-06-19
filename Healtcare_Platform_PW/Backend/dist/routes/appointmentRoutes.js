"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentController_1 = require("../controllers/appointmentController");
const router = (0, express_1.Router)();
//CREATE 
router.post("/", appointmentController_1.createAppointment);
//READ
router.get("/", appointmentController_1.getAppointments);
router.get("/by-date", appointmentController_1.filterByDate);
router.get("/by-doctor", appointmentController_1.filterByDoctorId);
router.get("/by-patient", appointmentController_1.filterByPatientId);
//DELETE
router.delete("/:id", appointmentController_1.deleteAppointment);
exports.default = router;
//# sourceMappingURL=appointmentRoutes.js.map