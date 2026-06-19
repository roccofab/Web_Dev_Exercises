"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctor = exports.addDoctor = void 0;
const connection_1 = require("../config/connection");
const prismaMappers_1 = require("../utils/prismaMappers");
/**
 * **POST/doctor**
 *
 * Add new Doctor to the database
 *
 * Body request fields:
 * - id (number)
 * - specialization (string)
 * - userId (number): the user id that insert the doctor in the database
 *
 *
 * @param req -request data
 * @param res -server response data
 * @returns {400} - client error request data
 * @returns {200} -created doctor
 * @returns {500} - server error
 */
const addDoctor = async (req, res) => {
    try {
        const { id, specialization, userId } = req.body;
        const parsedId = id === undefined || id === null ? null : (0, prismaMappers_1.parseInteger)(id);
        const parsedUserId = (0, prismaMappers_1.parseInteger)(userId);
        if (!specialization || !parsedUserId || (id !== undefined && parsedId === null)) {
            return res.status(400).json({ message: "Missing doctor data in the request or not valid data" });
        }
        const user = await connection_1.prisma.user.findUnique({ where: { id: parsedUserId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let data;
        if (parsedId != null) {
            data = {
                id: parsedId,
                specialization,
                userId: parsedUserId,
            };
        }
        else {
            data = {
                specialization,
                user: {
                    connect: { id: parsedUserId },
                },
            };
        }
        const doctor = await connection_1.prisma.doctor.create({
            data,
            include: {
                user: true,
            },
        });
        return res.status(201).json(doctor);
    }
    catch (error) {
        return res.status(500).json({ message: "server error response while adding new doctor in the database", error });
    }
};
exports.addDoctor = addDoctor;
/**
 * **DELETE/doctor/:id**
 *
 * Delete a doctor identyfied by id from the database.
 * @param req -request data(id)
 * @param res -server response data
 */
const deleteDoctor = async (req, res) => {
    try {
        const id = (0, prismaMappers_1.parseInteger)(req.params.id ?? req.body.id);
        if (!id) {
            return res.status(400).json({ message: "Missing doctorId" });
        }
        await connection_1.prisma.doctor.delete({
            where: { id },
        });
        return res.status(200).json({ message: "Doctor removed from the database" });
    }
    catch (error) {
        return res.status(500).json({ message: "server error response while removing doctor", error });
    }
};
exports.deleteDoctor = deleteDoctor;
//# sourceMappingURL=doctorController.js.map