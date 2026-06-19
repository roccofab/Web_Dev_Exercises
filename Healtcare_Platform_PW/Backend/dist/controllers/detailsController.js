"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetails = exports.addDetail = void 0;
const connection_1 = require("../config/connection");
const prismaMappers_1 = require("../utils/prismaMappers");
const validDetailTypes = new Set(["DIAGNOSIS", "THERAPY", "REPORT"]);
/**
 * **POST/detail**
 *
 * Add new Detail in the system related to a specific appointment.
 * Body request fileds:
 *
 * - appointmentId: 1 detail linked to 1 appointment(1:1)
 *
 * - type: DIAGNOSIS | ANALYSIS | REPORT
 *
 * - content: medical report content
 *
 * - doctorId: 1 doctor can create multiple details(1:n) and each appointments can have 1 doctor assigned(n:1)
 *
 * **Business Logic:**
 *
 * 1. Get request data
 *
 * 2. Validate Fields
 *
 * 3. Check if appointment exists
 *
 * 4. Get last version of detail for the appointment: versioning enables medical history tracking
 *
 * 5. Create new detail
 *
 * 6. Save the new Detail with:
 *      - ISO timestamp (`createdAt`)
 *      - incremental version
 *
 * @param req -request detail data
 * @param res -server response data
 * @returns {201} -created detail
 * @returns {500} - server error
 */
const addDetail = async (req, res) => {
    try {
        const { appointmentId, type, content, doctorId } = req.body;
        const parsedAppointmentId = (0, prismaMappers_1.parseInteger)(appointmentId);
        const parsedDoctorId = (0, prismaMappers_1.parseInteger)(doctorId);
        if (!parsedAppointmentId || !parsedDoctorId || !content || typeof type !== "string" || !validDetailTypes.has(type)) {
            return res
                .status(400)
                .json({ message: "detail id, appointment id, detail type, detail data are required or data is wrong" });
        }
        const [appointment, doctor, lastVersion] = await Promise.all([
            connection_1.prisma.appointment.findUnique({ where: { id: parsedAppointmentId } }),
            connection_1.prisma.doctor.findUnique({ where: { id: parsedDoctorId } }),
            connection_1.prisma.details.count({ where: { appointmentId: parsedAppointmentId } }),
        ]);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        const detail = await connection_1.prisma.details.create({
            data: {
                appointment: {
                    connect: { id: parsedAppointmentId },
                },
                doctor: {
                    connect: { id: parsedDoctorId },
                },
                type: type,
                content,
                version: lastVersion + 1,
                createdAt: new Date(),
            },
            include: prismaMappers_1.detailInclude,
        });
        return res.status(201).json((0, prismaMappers_1.serializeDetail)(detail));
    }
    catch (_error) {
        return res.status(500).json({ message: "Server error while adding detail" });
    }
};
exports.addDetail = addDetail;
/**
 * **GET/details**
 *
 * Get all details + related data
 *
 * Each detail includes:
 *
 * - id : number,
 *
 * - type : string (DIAGNOSIS | THERAPY | REPORT)
 *
 * - content : string
 *
 * - createdAt : DateTime
 *
 * - doctorId : number
 *
 * - version : number
 *
 * - appointmentId :  number
 *
 * - doctor : Doctor
 *
 * - appointment : Appointment
 * @param req
 * @param res
 * @returns {200} -created appointment
 * @returns {500} - server error
 */
const getDetails = async (_req, res) => {
    try {
        const details = await connection_1.prisma.details.findMany({
            include: prismaMappers_1.detailInclude,
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json(details.map(prismaMappers_1.serializeDetail));
    }
    catch (_error) {
        return res.status(500).json({ message: "server error while getting details" });
    }
};
exports.getDetails = getDetails;
//# sourceMappingURL=detailsController.js.map