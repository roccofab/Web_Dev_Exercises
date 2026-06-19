"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializePayment = exports.serializeInvoice = exports.serializeDetail = exports.serializeAppointments = exports.serializeAppointment = exports.parseInteger = exports.parseTimeOnly = exports.parseDateOnly = exports.detailInclude = exports.paymentInclude = exports.invoiceInclude = exports.appointmentInclude = void 0;
exports.appointmentInclude = {
    patient: true,
    doctor: true,
    createdBy: true,
};
exports.invoiceInclude = {
    appointment: {
        include: {
            patient: true,
            doctor: true,
        },
    },
    payments: true,
};
exports.paymentInclude = {
    invoice: {
        include: {
            appointment: true,
        },
    },
};
exports.detailInclude = {
    appointment: {
        include: {
            patient: true,
            doctor: true,
        },
    },
    doctor: true,
};
const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
const isoTimeOnly = /^\d{2}:\d{2}(:\d{2})?$/;
const parseDateOnly = (value) => {
    if (typeof value !== "string" || !isoDateOnly.test(value)) {
        return null;
    }
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};
exports.parseDateOnly = parseDateOnly;
const parseTimeOnly = (value) => {
    if (typeof value !== "string" || !isoTimeOnly.test(value)) {
        return null;
    }
    const normalized = value.length === 5 ? `${value}:00` : value;
    const parsed = new Date(`1970-01-01T${normalized}.000Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};
exports.parseTimeOnly = parseTimeOnly;
const parseInteger = (value) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
};
exports.parseInteger = parseInteger;
const formatDateOnly = (value) => {
    if (!value) {
        return null;
    }
    return value.toISOString().slice(0, 10);
};
const formatTimeOnly = (value) => {
    if (!value) {
        return null;
    }
    return value.toISOString().slice(11, 19);
};
const serializeAppointment = (appointment) => ({
    ...appointment,
    date: formatDateOnly(appointment.date),
    start_time: formatTimeOnly(appointment.start_time),
    end_time: formatTimeOnly(appointment.end_time),
});
exports.serializeAppointment = serializeAppointment;
const serializeAppointments = (appointments) => appointments.map(exports.serializeAppointment);
exports.serializeAppointments = serializeAppointments;
const serializeDetail = (detail) => ({
    ...detail,
    appointment: detail.appointment && typeof detail.appointment === "object"
        ? (0, exports.serializeAppointment)(detail.appointment)
        : detail.appointment,
});
exports.serializeDetail = serializeDetail;
const serializeInvoice = (invoice) => ({
    ...invoice,
    appointment: invoice.appointment && typeof invoice.appointment === "object"
        ? (0, exports.serializeAppointment)(invoice.appointment)
        : invoice.appointment,
});
exports.serializeInvoice = serializeInvoice;
const serializePayment = (payment) => ({
    ...payment,
    invoice: payment.invoice && typeof payment.invoice === "object"
        ? (0, exports.serializeInvoice)(payment.invoice)
        : payment.invoice,
});
exports.serializePayment = serializePayment;
//# sourceMappingURL=prismaMappers.js.map