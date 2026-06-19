import { Request, response, Response } from "express";
import { AppDataSource } from "../config/connection";
import { User } from "../entities/user";
import { Doctor } from "../entities/doctor";
import { request } from "node:http";
import { spec } from "node:test/reporters";

/**
 * **POST/doctor**
 * 
 * Add new Doctor to the database
 * @param req -request data
 * @param res -server response data
 */
export const addDoctor = async(req:Request, res:Response)=>{
    try{
        const {id,specialization,userId} = req.body;
        if(!id || isNaN(id) || !specialization || !userId || isNaN(userId))
            return res.status(400).json({message:"Missing doctor data in the request or not valid data"});

        const doctorEntity = AppDataSource.getRepository(Doctor);

        const userEntity = AppDataSource.getRepository(User);

        const user = await userEntity.findOneBy({ id: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const doctor = doctorEntity.create({
            id,
            specialization,
            user
        });

        await doctorEntity.save(doctor);
        return res.status(201).json(doctor);
    }catch(error){
        return res.status(500).json({message:"server error response while adding new doctor in the database"});
    }
}

/**
 * **DELETE/doctor/:id**
 * 
 * Delete a doctor from the database.
 * @param req -request data(id)
 * @param res -server response data
 */
export const deleteDoctor = async(req:Request, res:Response)=>{
    try{
        const {id} = req.body;
        if(!id) return res.status(400).json({message:"Missing doctorId"});
        const doctorEntity = AppDataSource.getRepository("doctor");
        await doctorEntity.delete(id);
        return res.status(200).json({message:"Doctor removed from the database"});
    }catch(error){
        return res.status(500).json({message:"server error response while removing doctor"});
    }
}