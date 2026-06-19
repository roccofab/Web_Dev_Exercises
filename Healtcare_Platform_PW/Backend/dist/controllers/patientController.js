"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPatient = void 0;
const connection_1 = require("../config/connection");
const prismaMappers_1 = require("../utils/prismaMappers");
/**
 * POST/patient
 *
 * Add new patient in the system.
 * @param req -request data
 * @param res -server response data
 * @returns {201} -patient created
 * @returns {500} -server error
 */
const addPatient = async (req, res) => {
    let data;
    try {
        const { id, name, fiscalCode, userId } = req.body;
        const parsedId = id === undefined || id === null ? null : (0, prismaMappers_1.parseInteger)(id);
        const parsedUserId = (0, prismaMappers_1.parseInteger)(userId);
        if (!name || !parsedUserId || (id !== undefined && parsedId === null)) {
            return res.status(400).json({ message: "patiendId,userId and patient name are required fields" });
        }
        const user = await connection_1.prisma.user.findUnique({ where: { id: parsedUserId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (parsedId !== null) {
            data = {
                id: parsedId,
                name,
                fiscalCode: fiscalCode ?? null,
                userId: parsedUserId,
            };
        }
        else {
            data = {
                name,
                fiscalCode: fiscalCode ?? null,
                user: {
                    connect: { id: parsedUserId },
                },
            };
        }
        const patient = await connection_1.prisma.patient.create({ data, include: { user: true }, });
        return res.status(201).json(patient);
    }
    catch (_error) {
        return res.status(500).json({ message: "server error response while adding new patient" });
    }
};
exports.addPatient = addPatient;
//# sourceMappingURL=patientController.js.map