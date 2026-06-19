"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.filterById = exports.getUsers = exports.addUser = void 0;
const connection_1 = require("../config/connection");
const prismaMappers_1 = require("../utils/prismaMappers");
//userInclude includes the patient, doctor, and appointments created by the user, avoiding multiple queries
//userInclude allows a better code readibility
const userInclude = {
    patient: true,
    doctor: true,
    createdAppointments: true,
};
const serializeUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    patient: user.patient,
    doctor: user.doctor,
    createdAppointments: (0, prismaMappers_1.serializeAppointments)(user.createdAppointments),
});
/**
 * **POST/user**
 *
 * Add new user in the system:
 *
 * - Get request data
 *
 * - Validate Data
 *
 * - Create new User and save it into the database,
 *     the function create in prisma creates the object and executes the insert query.
 *
 * n.b: **userInclude** avoid to make multiple queries to find the user-doctor-patient
 *   unique relationships(findUnique) in the database, which would result in performance degradation
 * @param req -request data
 * @param res -response server data
 * @returns - user created
 * @returns -server error
 */
const addUser = async (req, res) => {
    try {
        const { id, name, email, password, role } = req.body;
        const parsedId = id === undefined || id === null ? null : (0, prismaMappers_1.parseInteger)(id);
        if (!name || !email || !password || !role || (id !== undefined && parsedId === null)) {
            return res
                .status(400)
                .json({ message: "user id, name, email, password, role are required if you entered check the data type" });
        }
        //create new user and store in the database
        let data;
        if (parsedId !== null) {
            data = {
                id: parsedId,
                name,
                email,
                password,
                role
            };
        }
        else {
            data = {
                name,
                email,
                password,
                role
            };
        }
        const user = await connection_1.prisma.user.create({
            data,
            include: userInclude
        });
        return res.status(201).json(serializeUser(user));
    }
    catch (_error) {
        return res.status(500).json({ message: "error while adding new user in the system" });
    }
};
exports.addUser = addUser;
/**
 * **GET/users**
 *
 * Get all users.
 *
 * Each user includes:
 *
 * - id: number
 *
 * - name: string
 *
 * - email: string
 *
 * - role: string
 *
 * - patient: Patient | null
 *
 * - doctor: doctor | null
 *
 * - createAppointments: Appointment[]
 *
 * Related entities are loaded using userInclude
 * @param _req
 * @param res
 * @returns {200} Array of users with related data
 * @returns {500} Server error
 */
const getUsers = async (_req, res) => {
    try {
        const users = await connection_1.prisma.user.findMany({
            include: userInclude,
        });
        return res.status(200).json(users.map(serializeUser));
    }
    catch (_error) {
        return res.status(500).json({ message: "server error while getting users" });
    }
};
exports.getUsers = getUsers;
/**
 * **GET/users/:id**
 *
 * Get user by id
 *
 * The user data(if exists) includes:
 *
 * - id: number
 *
 * - name: string
 *
 * - email: string
 *
 * - role: string
 *
 * - patient: Patient | null
 *
 * - doctor: doctor | null
 *
 * - createAppointments: Appointment[]
 *
 * Related entities are loaded using userInclude.
 * If no user is found, the response will be null
 * @param req - user id
 * @param res
 * @returns {200} User object with related data or null if not found
 * @returns {400} Invalid or missing user id
 * @returns {500} Server error while retrieving user
 */
const filterById = async (req, res) => {
    try {
        const id = (0, prismaMappers_1.parseInteger)(req.params.id ?? req.body.id ?? req.query.id);
        if (!id) {
            return res.status(400).json({ message: "id is null or not valid" });
        }
        const user = await connection_1.prisma.user.findUnique({
            where: { id },
            include: userInclude,
        });
        return res.status(200).json(user ? serializeUser(user) : null);
    }
    catch (_error) {
        return res.status(500).json({ message: "server error while retrieving user by id" });
    }
};
exports.filterById = filterById;
/**
 * **DELETE/user/:id**
 *
 * Get user by id and remove from the system
 * @param req -request data
 * @param res -server response data
 * @returns {200} -success message
 * @returns {500} -server error
 */
const deleteUser = async (req, res) => {
    try {
        const id = (0, prismaMappers_1.parseInteger)(req.params.id ?? req.body.id);
        if (!id) {
            return res.status(400).json({ message: "Missing userId" });
        }
        await connection_1.prisma.user.delete({
            where: { id },
        });
        return res.status(200).json({ message: "user removed from the system" });
    }
    catch (_error) {
        return res.status(500).json({ message: "server error while removing user" });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map