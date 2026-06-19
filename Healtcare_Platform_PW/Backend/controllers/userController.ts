import { Request, Response } from "express";
import { AppDataSource } from "../config/connection";
import { Appointment } from "../entities/Appointment";
import { Doctor } from "../entities/doctor";
import { User } from "../entities/user";

/**
 * **POST/user**
 * 
 * Add new user in the system.
 * @param req -request data
 * @param res -response server data
 */
export const addUser = async(req:Request, res:Response)=>{
    try{
        const {id, name, email, password, role} = req.body;
        if(!id || isNaN(id) || !name || !email || !password || !role)
            return res.status(400).json({message: "user id, name, email, password, role are required if you entered check the data type"});

        const userEntity = AppDataSource.getRepository(User);
        
        const user = userEntity.create({
            id,
            name,
            email,
            password,
            role
        });

        await userEntity.save(user);
        return res.status(201).json(user);
    }catch(error){
        return res.status(500).json({message: "error while adding new user in the system"});
    }
}

/**
 * **GET/user**
 * 
 * Get all users
 * @param req 
 * @param res 
 * @returns 
 */
export const getUsers = async(req:Request, res:Response)=>{
    try{
        const userEntity = AppDataSource.getRepository("user");

        const users = await userEntity.find({
            relations:["patient","doctor", "createdAppointments"]
        });

        return res.status(200).json(users);
    }catch(error){
        return res.status(500).json({message:"server error while getting users"});
    }
}

export const filterById = async(req:Request, res:Response)=>{
    try{
        const {id} = req.body;
        if(!id || isNaN(id))
            return res.status(400).json({message:"id is null or not valid"});

        const userEntity = AppDataSource.getRepository("user");
        const user = await userEntity.find({
            relations:["patient","doctor","createdAppointments"],
            where: {id}
        });

        return res.status(200).json(user);
    }catch(error){
        return res.status(500).json({message:"server error while retrieving user by id"});
    }
}

/**
 * **DELETE/user/:id**
 * 
 * Get user by id and remove from the system
 * @param req -request data
 * @param res -server response data
 * @returns 
 */
export const deleteUser = async(req:Request, res:Response)=>{
    try{
        const {id} = req.body;
        if(!id) return res.status(400).json({message:"Missing userId"});

        const userEntity = AppDataSource.getRepository("user");
        await userEntity.delete(id);
        return res.status(200).json({message: "user removed from the system"});
    }catch(error){
        return res.status(500).json({message:"server error while removing user"});
    }
}