import { Request, Response } from "express";
import { AppDataSource } from "../config/connection";
import { User } from "../entities/user";

/**
 * POST/patient
 * 
 * Add new patient in the system.
 * @param req -request data
 * @param res -server response data
 * @returns 
 */
export const addPatient = async(req:Request, res:Response)=>{
    try{
       const {id, name, fiscalCode, userId} = req.body;
       if(!id || isNaN(id) || !name || !userId)
           return res.status(400).json({message:"patiendId,userId and patient name are required fields"});
       const patientEntity = AppDataSource.getRepository("Patient");
       const userEntity = AppDataSource.getRepository(User);

       const user = await userEntity.findOneBy({ id: userId})

       const patient = patientEntity.create({
          id,
          name,
          fiscalCode,
          user
       });

       await patientEntity.save(patient);
       return res.status(201).json(patient);
    }catch(error){
        return res.status(500).json({message:"server error response while adding new patient"});
    }
}