import { Request, Response } from "express";
import { AppDataSource } from "../config/connection";
import { Appointment } from "../entities/Appointment";
import { User } from "../entities/user";
import { Doctor } from "../entities/doctor";
import { Patient } from "../entities/Patient";

/**
 * **POST/appointment**
 * 
 * Create a new Appointment and insert it into the database. 
 * 
 * Body request fields:
 *- patientId(number)
 * 
 *    -doctorId(number)
 * 
 *    -createdById(number): user id 
 * 
 *    -description(string): appointment description
 * 
 *    -date(date)
 * 
 *    -start_time(time)
 * 
 *    -end_time(time)
 * 
 *    -status(string)
 * 
 * The function create in Prisma manages database relationships, instead of creating relationships between appointment
 *     and doctor-patient, i create an appointment record and then connect it to existing records
 *     in the Patient, User, and Doctor tables using their primary key:
 * -  connect: { id: parsedPatientId }:  connect appointment and patient by id
 * 
 * -  connect: { id: parsedCreatedById }:  connect appointment and user by id
 *
 * -  connect: { id: parsedDoctorId }: connect appointment and doctor by id  
 * 
 * Appointment request body can have the optional field doctorId, if it has you must check his availability:
 *     
 *     - Select all appointments
 *     
 *     - Check if there is already an appointment in the database with the same doctor ID, date, and time: 
 *         if it is return client message error, else create the new appointment
 *   
 * @param req -Appointment data client request
 * @param res  -Appoint data server response
 * @returns 
 */
export const createAppointment = async(req: Request, res:Response)=>{
    try{
        //extract data from the request body
        const {
            patientId,
            doctorId,
            createdById,
            description,
            date,
            start_time,
            end_time,
            status
        } = req.body;

        //get database entity's repositories
        const appointmentEntity = AppDataSource.getRepository(Appointment);
        const userEntity = AppDataSource.getRepository(User);
        const doctorEntity = AppDataSource.getRepository(Doctor);
        const patientEntity = AppDataSource.getRepository(Patient);

        if (!description || !date || !start_time || !end_time || !status)
          return res.status(400).json({ message: "Missing Fields" });


        //search patient and user in the database
        const patient = await patientEntity.findOneBy({ id:patientId});  //get the unique patient by its id
        const user = await userEntity.findOneBy({id:createdById});  //get the unique user that created the appointment by its id
        
        if (!patient || !user) 
           return res.status(404).json({ message: "Patient or User not valid" });

        let doctor = null;

        //if the request contain doctorId search for him in the database, if the input id is not valid return error message
        if (doctorId !== undefined && doctorId !== null) {
           doctor = await doctorEntity.findOneBy({ id: doctorId });

            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }

            //if doctorId exists in the body request then check its availability:
            //2 appointments can't have same doctorId & same date & same start_time
            const docBooked = await appointmentEntity.createQueryBuilder("appointment")
                 .leftJoin("appointment.doctor", "doctor")
                 .where("doctor.id = :doctorId", {doctorId})
                 .andWhere("DATE(appointment.date) = :date", { date })
                 .andWhere("appointment.start_time = :start_time", {start_time})
                 .getOne();

            if(docBooked)
                return res.status(400).json({message: "Doctor is not available at this date and time"});
        }

        //create appointment
        const appointment = appointmentEntity.create({
            description,
            date,
            start_time,
            end_time,
            status,
            patient,
            createdBy:user,
            doctor:doctor ?? undefined
        });

        await appointmentEntity.save(appointment);  //save appointment in the database
        return res.status(201).json(appointment);  //return appointment data in json format

    }catch (error) {
       return res.status(500).json({ message: "Server error while creating new appointment record", error });
    }
}

/**
 * **GET/appointments**
 * 
 *Get all appointments
 * @param req 
 * @param res 
 * @returns 
 */
export const getAppointments = async(req: Request, res:Response) =>{
    try{
        const appointmentEntity = AppDataSource.getRepository(Appointment);  //get appointment entity from database

        const appointments = await appointmentEntity.find({  
            relations: ["patient","doctor", "createdBy"]
        });

        return res.status(201).json(appointments);  //successfull server response
    }catch(error){
        return res.status(500).json({message:"server error while getting appointments", error});  //server error response
    }
}

/**
 * **GET/appointments/:date**
 * 
 * Get appointments filtered by date field.
 * @param req 
 * @param res 
 * @returns 
 */
export const filterByDate = async(req:Request, res:Response) =>{
    try{
        const appointmentEntity = AppDataSource.getRepository(Appointment);
        const query = req.query.date as string;
        if(!query)
            return res.status(400).json({message: "Missing date column"});

        const date = query;

        const appointments = await appointmentEntity.find({
            relations: ["patient", "doctor", "createdBy"],
            where: {date}
        })

        return res.status(201).json(appointments);
    }catch(error){
        return res.status(500).json({ message: "server error while getting appointments by date", error});
    }
}

/**
 * **GET/appointments/:doctorId**
 * 
 * Get all appointments filtered by doctorId.
 * @param req -request data(doctorId)
 * @param res -server response data
 * @returns 
 */
export const filterByDoctorId = async(req:Request, res:Response)=>{
    try{
        const appointmentEntity = AppDataSource.getRepository(Appointment);
        const doctorId = Number(req.query.doctorId);
        if(typeof doctorId !== "number")
            return res.status(400).json({message:"Missing doctorId or invalid value"});

        const appointments = await appointmentEntity.find({
            relations: ["patient", "doctor", "createdBy"],
            where: {
                doctor: {
                    id: doctorId
                }
            }
        });

        return res.status(201).json(appointments);
    }catch(error){
        return res.status(500).json({message:"server error while getting appointment filtered by doctorId"});
    }
}

/**
 * **GET/appointments/:patientId**
 * 
 * Get all appointments filtered by patientId
 * @param req -request data(patientId)
 * @param res -server response data
 * @returns 
 */
export const filterByPatientId = async(req:Request, res:Response)=>{
    try{
        const appointmentEntity = AppDataSource.getRepository(Appointment);
        const patientId = Number(req.query.patientId);
        if(typeof patientId !== "number")
            return res.status(400).json("Missing patientId or invalid value");

        const appointments = await appointmentEntity.find({
            relations: ["patient", "doctor", "createdBy"],
            where: {
                patient: {
                    id: patientId
                }
            }
        });

        return res.status(201).json(appointments);
    }catch(error){
        return res.status(500).json({message:"server error while getting appointments filtered by patientId"});
    }
}

/**
 * **DELETE/appointments/:id**
 * 
 * Delete an appointment by its id.
 * @param req -request data(id)
 * @param res -message server response
 * @returns 
 */
export const deleteAppointment = async(req:Request, res:Response) =>{
    try{
        const { id } = req.body;   //extract id from the body request
        if(!id) return res.status(400).json({message:"Missing appointment id"});
        const appointmentEntity = AppDataSource.getRepository(Appointment);
        await appointmentEntity.delete(id);
        return res.status(200).json({message: "appointment removed from the database"});
    }catch(error){
        return res.status(500).json({message: "server error while delete appointment", error})
    }
}