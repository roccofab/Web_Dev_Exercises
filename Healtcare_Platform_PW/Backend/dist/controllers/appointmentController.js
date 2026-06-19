"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointment = exports.filterByPatientId = exports.filterByDoctorId = exports.filterByDate = exports.getAppointments = exports.createAppointment = void 0;
const connection_1 = require("../config/connection");
const prismaMappers_1 = require("../utils/prismaMappers");
/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     description: |
 *       Creates an appointment and links it to an existing doctor, an existing or newly created patient,
 *       and the user that created the record.
 *
 *       Patient handling:
 *       - The API searches for an existing patient by `patientFiscalCode`.
 *       - If a patient with that fiscal code already exists, the appointment is linked to that patient.
 *       - If no patient is found, a new patient is created with `patientName` and `patientFiscalCode`.
 *       - The patient does not need to be linked to a user account when created through this endpoint.
 *
 *       Doctor handling:
 *       - The API searches for a doctor by the related user's `doctorName` and the doctor's `doctorSpecialization`.
 *       - If no matching doctor exists, the request returns `404`.
 *       - Before creating the appointment, the API checks whether the doctor already has a non-canceled
 *         appointment on the same date and at the same start time.
 *       - If the doctor is already booked, the request returns `400`.
 *
 *       The `createdById` value must reference an existing user. The response includes the appointment
 *       with its related doctor, patient, creator user, details, and invoice data according to the
 *       appointment include configuration.
 *     tags:
 *       - Appointments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientName
 *               - patientFiscalCode
 *               - doctorName
 *               - doctorSpecialization
 *               - createdById
 *               - description
 *               - date
 *               - start_time
 *               - end_time
 *               - status
 *             properties:
 *               patientName:
 *                 type: string
 *                 example: Mario Rossi
 *               patientFiscalCode:
 *                 type: string
 *                 example: RSSMRA80A01H501U
 *               doctorName:
 *                 type: string
 *                 example: Laura Bianchi
 *               doctorSpecialization:
 *                 type: string
 *                 example: Cardiology
 *               createdById:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: First cardiology visit
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-05-20
 *               start_time:
 *                 type: string
 *                 example: "09:00"
 *               end_time:
 *                 type: string
 *                 example: "09:30"
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, COMPLETED, CANCELED]
 *                 example: SCHEDULED
 *     responses:
 *       201:
 *         description: Appointment created successfully.
 *       400:
 *         description: Missing or invalid payload, or doctor already booked at the requested date and time.
 *       404:
 *         description: The creator user or the requested doctor was not found.
 *       500:
 *         description: Server error while creating the appointment.
 */
const createAppointment = async (req, res) => {
    try {
        const { patientName, patientFiscalCode, doctorName, doctorSpecialization, createdById, description, date, start_time, end_time, status, } = req.body;
        if (!patientName ||
            !patientFiscalCode ||
            !doctorName ||
            !doctorSpecialization ||
            !createdById ||
            !description ||
            !date ||
            !start_time ||
            !end_time ||
            !status ||
            typeof status !== "string") {
            return res.status(400).json({ message: "Missing Fields" });
        }
        const parsedCreatedById = (0, prismaMappers_1.parseInteger)(createdById);
        const parsedDate = (0, prismaMappers_1.parseDateOnly)(date);
        const parsedStartTime = (0, prismaMappers_1.parseTimeOnly)(start_time);
        const parsedEndTime = (0, prismaMappers_1.parseTimeOnly)(end_time);
        if (!parsedCreatedById || !parsedDate || !parsedStartTime || !parsedEndTime || (!patientName && !patientFiscalCode)) {
            return res.status(400).json({ message: "Invalid appointment payload" });
        }
        //check if patientName is provided in the body request and if it is a string
        if (patientName === undefined || typeof patientName !== "string") {
            return res.status(400).json({ message: "patientName must be a string" });
        }
        //check if patientFiscalCode is provided in the body request and if it is a string
        if (patientFiscalCode === undefined || typeof patientFiscalCode !== "string") {
            return res.status(400).json({ message: "patientFiscalCode must be a string" });
        }
        //check if doctorName and doctorSpecialization are provided in the body request
        if (doctorName === undefined || doctorSpecialization === undefined) {
            return res.status(400).json({ message: "doctorName and doctorSpecialization are required fields" });
        }
        //check if user that create the appointment exists in the database
        const user = await connection_1.prisma.user.findUnique({ where: { id: parsedCreatedById } });
        if (!user) {
            return res.status(404).json({ message: "Patient or User not valid" });
        }
        let patient = await connection_1.prisma.patient.findUnique({
            where: {
                fiscalCode: patientFiscalCode,
            },
        });
        //if patient doesn't exist in the database create a new one with the provided data in the request body
        if (!patient) {
            patient = await connection_1.prisma.patient.create({
                data: {
                    name: patientName,
                    fiscalCode: patientFiscalCode,
                },
            });
        }
        //if doctorId exists in the body request then check its availability:
        //2 appointments can't have same doctorId & same date & same start_time
        const doctor = await connection_1.prisma.doctor.findFirst({
            where: {
                user: {
                    name: doctorName
                },
                specialization: doctorSpecialization
            },
            include: {
                user: true
            },
        });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        const docBooked = await connection_1.prisma.appointment.findFirst({
            where: {
                doctorId: doctor.id,
                date: parsedDate,
                status: {
                    not: "CANCELED",
                },
                start_time: parsedStartTime,
            },
        });
        if (docBooked) {
            return res.status(400).json({ message: "Doctor is not available at this date and time" });
        }
        // Create appointment
        const appointment = await connection_1.prisma.appointment.create({
            data: {
                description,
                date: parsedDate,
                start_time: parsedStartTime,
                end_time: parsedEndTime,
                status: "SCHEDULED",
                patient: {
                    connect: {
                        id: patient.id,
                    },
                },
                doctor: {
                    connect: {
                        id: doctor.id,
                    },
                },
                createdBy: {
                    connect: {
                        id: parsedCreatedById,
                    },
                },
            },
            include: prismaMappers_1.appointmentInclude,
        });
        return res.status(201).json((0, prismaMappers_1.serializeAppointment)(appointment));
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Server error while creating new appointment record", error });
    }
};
exports.createAppointment = createAppointment;
/**
 * **GET/appointments**
 *
 *Get all appointments.
 *
 * Each appointment includes:
 *
 * - id: number
 *
 * - description: string
 *
 * - createdById: number(user id)
 *
 * - doctorId: number
 *
 * - patientId: number
 *
 * - date: DateTime
 *
 * - start_time: DateTime
 *
 * - end_time: DateTime
 *
 * - status: string
 *
 * - details: Details[]
 *
 * - Invoice
 * @param req
 * @param res
 * @returns {200} Array of appointments with related data
 * @returns {500} Server error
 */
const getAppointments = async (_req, res) => {
    try {
        const appointments = await connection_1.prisma.appointment.findMany({
            include: prismaMappers_1.appointmentInclude,
        });
        return res.status(200).json((0, prismaMappers_1.serializeAppointments)(appointments));
    }
    catch (error) {
        return res.status(500).json({ message: "server error while getting appointments", error });
    }
};
exports.getAppointments = getAppointments;
/**
 * **GET/appointments/:date**
 *
 * Get appointment filtered by date field.
 *
 * Appointment data(if exists) includes:
 *
 * - id: number
 *
 * - description: string
 *
 * - createdById: number(user id)
 *
 * - doctorId: number
 *
 * - patientId: number
 *
 * - date: DateTime
 *
 * - start_time: DateTime
 *
 * - end_time: DateTime
 *
 * - status: string
 *
 * - details: Details[]
 *
 * - Invoice
 *
 * **appointmentInclude** find the unique relationships between appointment-user-doctor-patient.
 * @param req
 * @param res
 * @returns
 */
const filterByDate = async (req, res) => {
    try {
        const query = req.query.date;
        const parsedDate = (0, prismaMappers_1.parseDateOnly)(query);
        if (!parsedDate) {
            return res.status(400).json({ message: "Missing date column" });
        }
        //get 
        const appointments = await connection_1.prisma.appointment.findMany({
            where: { date: parsedDate },
            include: prismaMappers_1.appointmentInclude,
        });
        return res.status(200).json((0, prismaMappers_1.serializeAppointments)(appointments));
    }
    catch (error) {
        return res.status(500).json({ message: "server error while getting appointments by date", error });
    }
};
exports.filterByDate = filterByDate;
/**
 * **GET/appointments/:doctorId**
 *
 * Get all appointments filtered by doctorId.
 *
 * * Appointment data(if exists) includes:
 *
 * - id: number
 *
 * - description: string
 *
 * - createdById: number(user id)
 *
 * - doctorId: number
 *
 * - patientId: number
 *
 * - date: DateTime
 *
 * - start_time: DateTime
 *
 * - end_time: DateTime
 *
 * - status: string
 *
 * - details: Details[]
 *
 * - Invoice
 *
 * **appointmentInclude** find the unique relationships between appointment-user-doctor-patient.
 * @param req -request data(doctorId)
 * @param res -server response data
 * @returns
 */
const filterByDoctorId = async (req, res) => {
    try {
        const doctorId = (0, prismaMappers_1.parseInteger)(req.query.doctorId);
        if (!doctorId) {
            return res.status(400).json({ message: "Missing doctorId or invalid value" });
        }
        const appointments = await connection_1.prisma.appointment.findMany({
            where: { doctorId },
            include: prismaMappers_1.appointmentInclude,
        });
        return res.status(200).json((0, prismaMappers_1.serializeAppointments)(appointments));
    }
    catch (_error) {
        return res.status(500).json({ message: "server error while getting appointment filtered by doctorId" });
    }
};
exports.filterByDoctorId = filterByDoctorId;
/**
 * **GET/appointments/:patientId**
 *
 * Get all appointments filtered by patientId
 *
 * * Appointment data(if exists) includes:
 *
 * - id: number
 *
 * - description: string
 *
 * - createdById: number(user id)
 *
 * - doctorId: number
 *
 * - patientId: number
 *
 * - date: DateTime
 *
 * - start_time: DateTime
 *
 * - end_time: DateTime
 *
 * - status: string
 *
 * - details: Details[]
 *
 * - Invoice
 *
 * **appointmentInclude** find the unique relationships between appointment-user-doctor-patient.
 * @param req -request data(patientId)
 * @param res -server response data
 * @returns
 */
const filterByPatientId = async (req, res) => {
    try {
        const patientId = (0, prismaMappers_1.parseInteger)(req.query.patientId);
        if (!patientId) {
            return res.status(400).json({ message: "Missing patientId or invalid value" });
        }
        const appointments = await connection_1.prisma.appointment.findMany({
            where: { patientId },
            include: prismaMappers_1.appointmentInclude,
        });
        return res.status(200).json((0, prismaMappers_1.serializeAppointments)(appointments));
    }
    catch (_error) {
        return res.status(500).json({ message: "server error while getting appointments filtered by patientId" });
    }
};
exports.filterByPatientId = filterByPatientId;
/**
 * **DELETE/appointments/:id**
 *
 * Delete an appointment by its id.
 * @param req -request data(id)
 * @param res -message server response
 * @returns {200} -successfull message
 * @returns {500} -server error
 */
const deleteAppointment = async (req, res) => {
    try {
        const id = (0, prismaMappers_1.parseInteger)(req.params.id ?? req.body.id);
        if (!id) {
            return res.status(400).json({ message: "Missing appointment id" });
        }
        await connection_1.prisma.appointment.delete({
            where: { id },
        });
        return res.status(200).json({ message: "appointment removed from the database" });
    }
    catch (error) {
        return res.status(500).json({ message: "server error while delete appointment", error });
    }
};
exports.deleteAppointment = deleteAppointment;
//# sourceMappingURL=appointmentController.js.map