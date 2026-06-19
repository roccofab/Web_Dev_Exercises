import apiClient from './axios_client';

export type AppointmentTableRow = {
    id: number
    time: string
    patient: string
    patientFiscalCode: string
    doctor: string
    status: string
    statusClass: 'confirmed' | 'pending' | 'completed' | 'canceled'
}

const formatAppointmentTime = (startTime: string | null | undefined): string => {
    if (!startTime) {
        return 'N/A'
    }

    return startTime.slice(0, 5)
}

const mapAppointmentStatus = (
    status: string | null | undefined,
): Pick<AppointmentTableRow, 'status' | 'statusClass'> => {
    switch ((status ?? '').toUpperCase()) {
        case 'COMPLETED':
            return { status: 'Completed', statusClass: 'completed' }
        case 'CANCELED':
            return { status: 'Canceled', statusClass: 'canceled' }
        case 'SCHEDULED':
            return { status: 'Scheduled', statusClass: 'confirmed' }
        default:
            return { status: status ?? 'N/A', statusClass: 'pending' }
    }
}

const mapAppointmentRow = (appointment: Record<string, unknown>): AppointmentTableRow => {
    const patient = appointment.patient as Record<string, unknown> | undefined
    const doctor = appointment.doctor as Record<string, unknown> | undefined
    const doctorUser = doctor?.user as Record<string, unknown> | undefined
    const { status, statusClass } = mapAppointmentStatus(appointment.status as string | undefined)

    return {
        id: Number(appointment.id),
        time: formatAppointmentTime(appointment.start_time as string | undefined),
        patient: (patient?.name as string | undefined) ?? 'N/A',
        patientFiscalCode: (patient?.fiscalCode as string | undefined) ?? 'N/A',
        doctor: (doctorUser?.name as string | undefined) ?? 'N/A',
        status,
        statusClass,
    }
}

/**
 * GET /appointments
 * 
 * Fetches the list of appointments from the API 
 * and returns an array of appointment objects with id, time, patient, doctor, and status.
 * @returns  array of appointment objects with id, start_time, patient, doctor, and status.
 */
export const fetchAppointments = async (): Promise<AppointmentTableRow[]> => {
    try{
        const {data} = await apiClient.get('/appointments')
        if (!data) {
            return []
        }
        
        return data.map((appointment: Record<string, unknown>) => mapAppointmentRow(appointment))
    }catch(error){
        console.error('Error while fetching appointments:', error);
        return [];
    }
}

/**
 * GET /appointments/by-patient
 * 
 *  Fetches the list of appointments by fiscal code from the API
 *  and returns an array of appointment objects with id, time, patient, doctor, and status.
 * @param fiscalCode 
 * @returns  array of appointment objects with id, time, patient, doctor, and status.
 */ 
export const fetchAppByFiscalCode = async (fiscalCode: string) => {
    try {
        const { data } = await apiClient.get('/appointments/by-patient', {params: { patientSearch: fiscalCode },})
        if (!data) {
            return []
        }

        return data.map((appointment: any) => ({
            id: Number(appointment.id),
            time: appointment.start_time ?? 'N/A',
            patient: appointment.patient?.user?.name ?? appointment.patient?.name ?? 'Patient Name Unavailable',
            doctor: appointment.doctor?.user?.name ?? appointment.doctor?.name ?? 'Doctor Name Unavailable',
            status: appointment.status ?? 'N/A',
        }))
    } catch (error) {
        console.error('Error while fetching appointments by fiscal code:', error)
        return []
    }
}

/**
 * GET /appointments/by-doctor
 * 
 * Fetches the list of appointments by doctor name from the API
 * and returns an array of appointment objects with id, time, patient, doctor, and status.
 * @param doctorName 
 * @returns  array of appointment objects with id, time, patient, doctor, and status.
 */
export const fetchAppByDoctorName = async (doctorId: number | string) => {
    try {
        const { data } = await apiClient.get('/appointments/by-doctor', {params: { doctorId: Number(doctorId) },})

        if (!data) {
            return []
        }

        return data.map((appointment: any) => ({
            id: Number(appointment.id),
            time: appointment.start_time ?? 'N/A',
            patient: appointment.patient?.user?.name ?? appointment.patient?.name ?? 'Patient Name Unavailable',
            doctor: appointment.doctor?.user?.name ?? appointment.doctor?.name ?? 'Doctor Name Unavailable',
            status: appointment.status ?? 'N/A',
        }))
    } catch (error) {
        console.error('Error while fetching appointments by doctor id:', error)
        return []
    }
}

/**
 * GET /appointments/by-date
 * 
 * Fetches the list of appointments by date from the API 
 * and returns an array of appointment objects with id, time, patient, doctor, and status.
 * @param date 
 * @returns  array of appointment objects with id, time, patient, doctor, and status.
 */
export const fetchAppByDate = async (date: string) => {
    try{
        const {data} = await apiClient.get('/appointments/by-date', { params: { date } })
        if (!data) {
            return []
        }

        return data.map((appointment:any)=> ({
            id: Number(appointment.id),
            time : appointment.start_time ?? 'N/A',
            patient: appointment.patient?.user?.name ?? appointment.patient?.name ?? 'Patient Name Unavailable',
            doctor: appointment.doctor?.user?.name ?? appointment.doctor?.name ?? 'Doctor Name Unavailable',
            status: appointment.status ?? 'N/A',
        }))
    }catch(error){
        console.error('Error while fetching appointments by date:', error);
        return [];
    }   
}

export type DoctorSectionRow = {
    id: number
    name: string
    specialization: string
    availability: string
    appointments: number
    status: string
}

const mapDoctorRow = (doctor: Record<string, unknown>): DoctorSectionRow => {
    const user = doctor.user as Record<string, unknown> | undefined

    return {
        id: Number(doctor.id),
        name: (user?.name as string | undefined) ?? 'N/A',
        specialization: (doctor.specialization as string | undefined) ?? 'N/A',
        availability: 'N/A',
        appointments: Number((doctor._count as Record<string, unknown> | undefined)?.appointments) || 0,
        status: 'Active',
    }
}

/**
 * GET /doctors
 *  Fetches the list of doctors from the API and returns an array of doctor objects with id and name.
 * @returns array of doctor objects with id and name.
 */
export const fetchDoctors = async (): Promise<DoctorSectionRow[]> => {
    try{
        const {data} = await apiClient.get('/doctors')
        if (!data) {
            return []
        }
        
        return data.map((doctor: Record<string, unknown>) => mapDoctorRow(doctor))
    }catch(error){
        console.error('Error while fetching doctors:', error);
        return [];
    }
}

/**
 * GET /appointments/by-doctor
 *
 * Fetches appointments using a doctor id.
 * @param doctorId
 * @returns array of appointment objects.
 */
export const fetchByDoctorName = async (doctorId: number | string) => {
    try {
        const { data } = await apiClient.get('/appointments/by-doctor', { params: { doctorId: Number(doctorId) },})
        if (!data) {
            return []
        }

        return data.map((appointment: any) => ({
            id: Number(appointment.id),
            time: appointment.start_time ?? 'N/A',
            patient: appointment.patient?.user?.name ?? appointment.patient?.name ?? 'Patient Name Unavailable',
            doctor: appointment.doctor?.user?.name ?? appointment.doctor?.name ?? 'Doctor Name Unavailable',
            status: appointment.status ?? 'N/A',
        }))
    } catch (error) {
        console.error('Error while fetching appointments by doctor id:', error)
        return []
    }
}

export type PatientSectionRow = {
    id: number
    name: string
    fiscalCode: string
    phone: string
    lastVisit: string
}

const formatDateOnly = (value: string | Date | null | undefined): string => {
    if (!value) {
        return 'N/A'
    }

    if (typeof value === 'string') {
        return value.slice(0, 10)
    }

    return value.toISOString().slice(0, 10)
}

const mapPatientRow = (patient: Record<string, unknown>): PatientSectionRow => {
    const user = patient.user as Record<string, unknown> | undefined
    const appointments = patient.appointments as Array<Record<string, unknown>> | undefined
    const latestAppointment = appointments?.[0]

    return {
        id: Number(patient.id),
        name: (patient.name as string | undefined) ?? (user?.name as string | undefined) ?? 'N/A',
        fiscalCode: (patient.fiscalCode as string | undefined) ?? 'N/A',
        phone: 'N/A',
        lastVisit: formatDateOnly(latestAppointment?.date as string | Date | undefined),
    }
}

/**
 * Fetches the list of patients from the API and returns an array of patient objects with id, name, fiscalCode, and visitsCount.
 * @returns array of patient objects with id, name, fiscalCode, and visitsCount.
 */
export const fetchPatients = async (): Promise<PatientSectionRow[]> => {
    try{
        const {data} = await apiClient.get('/patients')
        if (!data) {
            return []
        }

        return data.map((patient: Record<string, unknown>) => mapPatientRow(patient))
    }catch(error){
        console.error('Error while fetching patients:', error);
        return [];
    }
}

/**
 * Fetches the patient data by fiscal code from the API and returns an array of patient objects with id, name, fiscalCode, and visitsCount.
 * @param fiscalCode  
 * @returns  array of patient objects with id, name, fiscalCode, and visitsCount.
 */
export const fetchPatientByFiscalCode = async (fiscalCode: string): Promise<PatientSectionRow[]> => {
    try {
        const { data } = await apiClient.get('/patients/by-fiscal-code', {params: { fiscalCode },})
        if (!data) {
            return []
        }

        return [mapPatientRow(data as Record<string, unknown>)]
    } catch (error) {
        console.error('Error while fetching patient by fiscal code:', error)
        return []
    }
}

export type UserSectionRow = {
    id: number
    name: string
    email: string
    role: string
    status: string
}

const mapUserRow = (user: Record<string, unknown>): UserSectionRow => ({
    id: Number(user.id),
    name: (user.name as string | undefined) ?? 'N/A',
    email: (user.email as string | undefined) ?? 'N/A',
    role: (user.role as string | undefined) ?? 'N/A',
    status: 'Active',
})

/**
 * Fetches the list of users from the API and returns an array of user objects with id, name, email, and role.
 * @returns  array of user objects with id, name, email, and role.
 */
export const fetchUsers = async (): Promise<UserSectionRow[]> => {
    try{
        const {data} = await apiClient.get('/users')
        if (!data) {
            return []
        }
        return data.map((user: Record<string, unknown>) => mapUserRow(user))
    }catch(error){
        console.error('Error while fetching users:', error);
        return [];
    }
}
