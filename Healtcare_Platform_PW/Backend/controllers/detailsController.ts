import { Request, Response } from "express";
import { Appointment } from "../entities/Appointment";
import { AppDataSource } from "../config/connection";
import { Details } from "../entities/Details";
import { Doctor } from "../entities/doctor";

/**
 * **POST/detail**
 * 
 * Add new Detail in the system related to a specific appointment.
 * Body request fileds:
 * 
 * - appointmentId: 1 detail linked to 1 appointment(1:1)
 * 
 * - type: DIAGNOSIS | ANALYSIS | REPORT
 * 
 * - content: medical report content
 * 
 * - doctorId: 1 doctor can create multiple details(1:n) and each appointments can have 1 doctor assigned(n:1)
 * 
 * **Business Logic:**
 * 
 * 1. Get request data
 * 
 * 2. Validate Fields
 * 
 * 3. Check if appointment exists
 * 
 * 4. Get last version of detail for the appointment: versioning enables medical history tracking
 * 
 * 5. Create new detail
 * 
 * 6. Save the new Detail with:
 *      - ISO timestamp (`createdAt`)
 *      - incremental version
 * 
 * @param req -request detail data
 * @param res -server response data
 * @returns 
 */
export const addDetail = async(req:Request, res:Response)=>{
    try{
        const {appointmentId, type, content, doctorId} = req.body;
        if (!appointmentId || isNaN(appointmentId) || !type || !content || !doctorId)
            return res.status(400).json({message:"detail id, appointment id, detail type, detail data are required or data is wrong"});

        const detailEntity = AppDataSource.getRepository(Details);
        const appointmentRepo = AppDataSource.getRepository(Appointment);
        const doctorEntity = AppDataSource.getRepository(Doctor);

        const appointment = await appointmentRepo.findOne({
            where: { id: appointmentId },
            relations: ["doctor"]
        });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const doctor = await doctorEntity.findOneBy({ id: doctorId });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const lastVersion = await detailEntity.count({
            where: { appointment: { id: appointmentId } }
        });

        const detail = detailEntity.create({
            appointment,
            doctor,
            type,
            content,
            version: lastVersion + 1,
            createdAt: new Date()
        });

        await detailEntity.save(detail);

        return res.status(201).json(detail);
    }catch(error){
        return res.status(500).json({message:"Server error while adding detail"});
    }
}

/**
 * **GET/details**
 * 
 * Get all details + related data
 * @param req 
 * @param res 
 * @returns 
 */
export const getDetails = async(req:Request, res:Response) =>{
    try{
        const detailEntity = AppDataSource.getRepository(Details);

        const details = await detailEntity
            .createQueryBuilder("detail")
            .leftJoinAndSelect("detail.appointment", "appointment")
            .leftJoinAndSelect("appointment.patient", "patient")
            .leftJoinAndSelect("appointment.doctor", "doctor")
            .orderBy("detail.createdAt", "DESC")
            .getMany();


        return res.status(200).json(details);
            
    }catch(error) {
      return res.status(500).json({message:"server error while getting details"});
    }
}