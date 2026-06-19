export const appointmentInclude = {
  patient: true,
  doctor: {
    include: {
      user: true,
    },
  },
  createdBy: true,
} as const;

export const invoiceInclude = {
  appointment: {
    include: {
      patient: true,
      doctor: true,
    },
  },
  payments: true,
} as const;

export const paymentInclude = {
  invoice: {
    include: {
      appointment: true,
    },
  },
} as const;

export const detailInclude = {
  appointment: {
    include: {
      patient: true,
      doctor: true,
    },
  },
  doctor: true,
} as const;

const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
const isoTimeOnly = /^\d{2}:\d{2}(:\d{2})?$/;

export const parseDateOnly = (value: unknown): Date | null => {
  if (typeof value !== "string" || !isoDateOnly.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const parseTimeOnly = (value: unknown): Date | null => {
  if (typeof value !== "string" || !isoTimeOnly.test(value)) {
    return null;
  }

  const normalized = value.length === 5 ? `${value}:00` : value;
  const parsed = new Date(`1970-01-01T${normalized}.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const parseInteger = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

const formatDateOnly = (value: Date | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  return value.toISOString().slice(0, 10);
};

const formatTimeOnly = (value: Date | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  return value.toISOString().slice(11, 19);
};

export const serializeAppointment = <T extends Record<string, unknown>>(appointment: T) => ({
  ...appointment,
  date: formatDateOnly(appointment.date as Date | undefined),
  start_time: formatTimeOnly(appointment.start_time as Date | undefined),
  end_time: formatTimeOnly(appointment.end_time as Date | undefined),
});

export const serializeAppointments = <T extends Record<string, unknown>>(appointments: T[]) =>
  appointments.map(serializeAppointment);

export const serializeDetail = <T extends Record<string, unknown>>(detail: T) => ({
  ...detail,
  appointment:
    detail.appointment && typeof detail.appointment === "object"
      ? serializeAppointment(detail.appointment as Record<string, unknown>)
      : detail.appointment,
});

export const serializeInvoice = <T extends Record<string, unknown>>(invoice: T) => ({
  ...invoice,
  appointment:
    invoice.appointment && typeof invoice.appointment === "object"
      ? serializeAppointment(invoice.appointment as Record<string, unknown>)
      : invoice.appointment,
});

export const serializePayment = <T extends Record<string, unknown>>(payment: T) => ({
  ...payment,
  invoice:
    payment.invoice && typeof payment.invoice === "object"
      ? serializeInvoice(payment.invoice as Record<string, unknown>)
      : payment.invoice,
});
