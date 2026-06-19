import { defineStore } from 'pinia'

export type SectionKey = 'appointments' | 'doctors' | 'patients' | 'users'

export interface AppointmentStat {
  label: string
  value: string
  trend: string
  tone: 'blue' | 'green' | 'amber' | 'red'
}

export interface AppointmentRow {
  id: string
  time: string
  patient: string
  doctor: string
  department: string
  status: 'Confirmed' | 'Pending' | 'Completed'
}

export interface DoctorRow {
  id: string
  name: string
  specialty: string
  availability: string
  appointments: number
  status: string
}

export interface PatientRow {
  id: string
  name: string
  fiscalCode: string
  phone: string
  lastVisit: string
}

export interface UserRow {
  id: string
  name: string
  email: string
  role: string
  status: string
}

export const useAppStore = defineStore('app', {
  state: () => ({
    sections: [
      { key: 'appointments', label: 'Appointments' },
      { key: 'doctors', label: 'Doctors' },
      { key: 'patients', label: 'Patients' },
      { key: 'users', label: 'Users' },
    ] as Array<{ key: SectionKey; label: string }>,

    appointmentStats: [
      {
        label: 'Today appointments',
        value: '24',
        trend: '+4 from yesterday',
        tone: 'blue',
      },
      {
        label: 'Confirmed',
        value: '18',
        trend: '75% of today',
        tone: 'green',
      },
      {
        label: 'Waiting confirmation',
        value: '5',
        trend: 'Needs follow-up',
        tone: 'amber',
      },
      {
        label: 'Cancelled',
        value: '1',
        trend: 'Low cancellation rate',
        tone: 'red',
      },
    ] as AppointmentStat[],

    appointments: [
      {
        id: 'apt-1',
        time: '09:00',
        patient: 'Elena Marino',
        doctor: 'Dr. Marta Rossi',
        department: 'Cardiology',
        status: 'Confirmed',
      },
      {
        id: 'apt-2',
        time: '10:30',
        patient: 'Paolo Ferri',
        doctor: 'Dr. Luca Bianchi',
        department: 'Orthopedics',
        status: 'Pending',
      },
      {
        id: 'apt-3',
        time: '12:00',
        patient: 'Giulia Costa',
        doctor: 'Dr. Sara Verdi',
        department: 'Pediatrics',
        status: 'Completed',
      },
    ] as AppointmentRow[],

    doctors: [
      {
        id: 'doc-1',
        name: 'Dr. Marta Rossi',
        specialty: 'Cardiology',
        availability: 'Today, 14:30',
        appointments: 8,
        status: 'Available',
      },
      {
        id: 'doc-2',
        name: 'Dr. Luca Bianchi',
        specialty: 'Orthopedics',
        availability: 'Tomorrow, 09:00',
        appointments: 5,
        status: 'In visit',
      },
      {
        id: 'doc-3',
        name: 'Dr. Sara Verdi',
        specialty: 'Pediatrics',
        availability: 'Today, 16:00',
        appointments: 6,
        status: 'Available',
      },
    ] as DoctorRow[],

    patients: [
      {
        id: 'pat-1',
        name: 'Elena Marino',
        fiscalCode: 'MRNLNE80A41H501U',
        phone: '+39 333 123 4455',
        lastVisit: '2026-05-28',
      },
      {
        id: 'pat-2',
        name: 'Paolo Ferri',
        fiscalCode: 'FRRPLA76C02F205X',
        phone: '+39 347 908 1150',
        lastVisit: '2026-05-21',
      },
      {
        id: 'pat-3',
        name: 'Giulia Costa',
        fiscalCode: 'CSTGLI92D45L219Q',
        phone: '+39 320 552 7810',
        lastVisit: '2026-05-18',
      },
    ] as PatientRow[],

    users: [
      {
        id: 'usr-1',
        name: 'Admin Clinic',
        email: 'admin@clinic.test',
        role: 'ADMIN',
        status: 'Active',
      },
      {
        id: 'usr-2',
        name: 'Reception Desk',
        email: 'reception@clinic.test',
        role: 'EMPLOYEE',
        status: 'Active',
      },
      {
        id: 'usr-3',
        name: 'Billing Office',
        email: 'billing@clinic.test',
        role: 'EMPLOYEE',
        status: 'Pending',
      },
    ] as UserRow[],
  }),
})
