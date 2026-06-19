import apiClient from './axios_client'

export interface appointmentPayload {
    patientName: string,
    patientFiscalCode: string,
    doctorName: string,
    doctorSpecialization: string,
    createdById: number,
    description: string,
    date: string,
    startTime: string,
    endTime: string,
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED'
}

/**
 * POST /appointments
 * 
 * Creates a new appointment in the API
 * @param payload - data containing patient name, patient fiscal code, doctor name, doctor specialization, created by id, date, start time, end time, and status of the appointment.
 * @returns The created appointment object with id, time, patient, doctor, and status.
 */
export const createAppointment = async(payload: appointmentPayload) => {
    try{
        const {data} = await apiClient.post('/appointments', {
            patientName: payload.patientName,
            patientFiscalCode: payload.patientFiscalCode,
            doctorName: payload.doctorName,
            doctorSpecialization: payload.doctorSpecialization,
            createdById: payload.createdById,
            description: payload.description,
            date: payload.date,
            start_time: payload.startTime,
            end_time: payload.endTime,
            status: payload.status,
        })
        return data
    } catch (error) {
        console.error('Error while creating appointment:', error)
        throw error
    }
}