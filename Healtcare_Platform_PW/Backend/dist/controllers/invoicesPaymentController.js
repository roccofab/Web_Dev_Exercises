"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayments = exports.getInvoices = exports.addPayment = exports.addInvoice = void 0;
const connection_1 = require("../config/connection");
const prismaMappers_1 = require("../utils/prismaMappers");
/**
 * **POST/invoices**
 *
 * Add new invoice in the system:
 * - get data request
 *
 *- Validate Data
 *
 *- Check if appointment exists
 *
 *- Check if Invoice already exists
 *
 *- Create new invoice e save in the database
 *
 * @param req - invoice request data
 * @param res -server response data
 * @returns {201} -the created invoice
 * @returns {500} -server error
 */
const addInvoice = async (req, res) => {
    try {
        const { appointmentId, total, status } = req.body;
        const parsedAppointmentId = (0, prismaMappers_1.parseInteger)(appointmentId);
        const parsedTotal = Number(total);
        if (!parsedAppointmentId || Number.isNaN(parsedTotal) || !status) {
            return res.status(400).json({ message: "{appointmentId, total price and status are required" });
        }
        const appointment = await connection_1.prisma.appointment.findUnique({
            where: { id: parsedAppointmentId },
        });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        const existingInvoice = await connection_1.prisma.invoices.findUnique({
            where: { appointmentId: parsedAppointmentId },
            include: prismaMappers_1.invoiceInclude,
        });
        if (existingInvoice) {
            return res.status(400).json({
                message: "Invoice already exists for this appointment",
                invoice: (0, prismaMappers_1.serializeInvoice)(existingInvoice),
            });
        }
        const invoice = await connection_1.prisma.invoices.create({
            data: {
                appointment: {
                    connect: { id: parsedAppointmentId },
                },
                total: parsedTotal,
                status,
            },
            include: prismaMappers_1.invoiceInclude,
        });
        return res.status(201).json((0, prismaMappers_1.serializeInvoice)(invoice));
    }
    catch (_error) {
        return res.status(500).json({ message: "server error while adding new invoice" });
    }
};
exports.addInvoice = addInvoice;
/**
 * **POST/payments**
 *
 * Add new payment for invoice in the system:
 *
 * - Get data request
 *
 * - Validate data
 *
 * - Check if invoice exists
 *
 * - Create new payment and save it in the database
 *
 * @param req -invoice request data
 * @param res -server response data
 * @returns {200} -created payment
 * @returns {500} -server error
 */
const addPayment = async (req, res) => {
    try {
        const { invoiceId, amount, paymentDate, status } = req.body;
        const parsedInvoiceId = (0, prismaMappers_1.parseInteger)(invoiceId);
        const parsedAmount = Number(amount);
        const parsedPaymentDate = paymentDate ? new Date(paymentDate) : new Date();
        if (!parsedInvoiceId || Number.isNaN(parsedAmount) || Number.isNaN(parsedPaymentDate.getTime()) || !status) {
            return res.status(400).json({ message: "invoiceId, amount, payment date and status are required" });
        }
        const invoice = await connection_1.prisma.invoices.findUnique({
            where: { id: parsedInvoiceId },
        });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        const payment = await connection_1.prisma.payment.create({
            data: {
                amount: parsedAmount,
                paymentDate: parsedPaymentDate,
                status,
                invoice: {
                    connect: { id: parsedInvoiceId },
                },
            },
            include: prismaMappers_1.paymentInclude,
        });
        return res.status(200).json((0, prismaMappers_1.serializePayment)(payment));
    }
    catch (_error) {
        return res.status(500).json({ message: "server error while adding new payment" });
    }
};
exports.addPayment = addPayment;
/**
 * **GET/invoices**
 *
 * Get all invoices + details:
 * Each invoice includes:
 *
 * - id : number
 *
 * - appointmentId: number
 *
 * - total : number
 *
 * - status : string
 *
 * - payments : Payment[] list of payments for the invoice
 * @param req
 * @param res
 * @returns {200} - list of invoices
 * @returns {500} - server error
 */
const getInvoices = async (_req, res) => {
    try {
        const invoices = await connection_1.prisma.invoices.findMany({
            include: prismaMappers_1.invoiceInclude,
        });
        return res.status(200).json(invoices.map(prismaMappers_1.serializeInvoice));
    }
    catch (_error) {
        return res.status(500).json({ message: "server error while getting invoices" });
    }
};
exports.getInvoices = getInvoices;
/**
 * **GET/payments**
 *
 * Get all payments + related data
 *
 * Each payment includes:
 *
 * - id : number
 *
 * - amount : number,
 *
 * - paymentDate : DateTime
 *
 * - status : string
 *
 * - invoiceId : string
 *
 * @param req
 * @param res
 * @returns {200} - created payment
 * @returns {500} - server error
 */
const getPayments = async (_req, res) => {
    try {
        const payments = await connection_1.prisma.payment.findMany({
            include: prismaMappers_1.paymentInclude,
        });
        return res.status(200).json(payments.map(prismaMappers_1.serializePayment));
    }
    catch (_error) {
        return res.status(500).json({ message: "server error while getting payments" });
    }
};
exports.getPayments = getPayments;
//# sourceMappingURL=invoicesPaymentController.js.map