import { Request, Response } from "express";
import { AppDataSource } from "../config/connection";
import { Appointment } from "../entities/Appointment";
import { Invoices } from "../entities/Invoices";
import { Payment } from "../entities/Payment";

/**
 * **POST/invoices**
 * 
 * Add new invoice in the system:
 * - get data request
 *  
 *- Validate Data
 * 
 *- Check if appointment exists
 * 
 *- Check if Invoice already exists
 * 
 *- Create new invoice e save in the database
 * 
 * @param req - invoice request data
 * @param res -server response data
 * @returns 
 */
export const addInvoice = async(req:Request, res:Response) => {
    try{
        const {appointmentId, total, status} = req.body;
        if(!appointmentId || isNaN(appointmentId) || !total || isNaN(total) || !status)
            return res.json({message: "{appointmentId, total price and status are required"})
        const invoiceEntity = AppDataSource.getRepository(Invoices);
        const appointmentEntity = AppDataSource.getRepository(Appointment);

        //check if appointment exists
        const appointment = await appointmentEntity.findOneBy({id:appointmentId});
        if(!appointment)
            return res.status(404).json({message:"Appointment not found"});

        //check if invoices for the appointment already exists
        const existingInvoice = await invoiceEntity.findOne({
            where: { appointment: { id: appointmentId } },
            relations: [
                "appointment",
                "appointment.patient",
                "appointment.doctor",
                "payments"
            ]
        });

        if (existingInvoice) {
            return res.status(400).json({
                message: "Invoice already exists for this appointment",
                invoice: existingInvoice   // data of the existing invoice
            });
        }        
        const invoice = invoiceEntity.create({
            appointment: {id:appointmentId},
            total,
            status
        });

        await invoiceEntity.save(invoice);
        return res.status(201).json(invoice);
    }catch(error){
        return res.status(500).json({message:"server error while adding new invoice"});
    }

}

/**
 * **POST/payments**
 * 
 * Add new payment for invoice in the system:
 * 
 * - Get data request
 * 
 * - Validate data
 * 
 * - Check if invoice exists
 * 
 * - Create new payment and save it in the database
 * 
 * @param req -invoice request data
 * @param res -server response data
 * @returns 
 */
export const addPayment = async(req:Request, res:Response) => {
    try{
        const {invoiceId, amount, paymentDate, status} = req.body;
        if(!invoiceId || isNaN(invoiceId) || !amount || isNaN(amount) || !paymentDate || !status)
            return res.status(400).json({message: "invoiceId, amount, payment date and status are required"});

        const paymentEntity = AppDataSource.getRepository(Payment);
        const invoiceEntity = AppDataSource.getRepository(Invoices);

        const invoice = await invoiceEntity.findOneBy({id:invoiceId});
        if(!invoice)
            return res.status(404).json({message:"Invoice not found"});

        const payment = paymentEntity.create({
            amount,
            paymentDate : paymentDate ? new Date(paymentDate) : new Date(),
            status,
            invoice : {id:invoiceId}
        });
        await paymentEntity.save(payment);
        return res.status(200).json(payment);
    }catch(error){
        return res.status(500).json({message:"server error while adding new payment"});
    }
}

/**
 * **GET/invoices**
 * 
 * Get all invoices + details by using queryBuilder:
 * 
 * - Related appointment
 * 
 * - Related Patient information
 * 
 * - Related doctor information
 * 
 * - Related Payment
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getInvoices = async(req:Request, res:Response) =>{
    try{
        const invoiceEntity = AppDataSource.getRepository(Invoices);

        const invoices = await invoiceEntity
            .createQueryBuilder("invoice")
            .leftJoinAndSelect("invoice.appointment", "appointment")
            .leftJoinAndSelect("appointment.patient", "patient")
            .leftJoinAndSelect("appointment.doctor", "doctor")
            .leftJoinAndSelect("invoice.payments", "payments")
            .getMany();

        return res.status(200).json(invoices);
    }catch(error){
        return res.status(500).json({message: "server error while getting invoices"});
    }
}

/**
 * **GET/payments**
 * 
 * Get all payments + related data
 * @param req 
 * @param res 
 * @returns 
 */
export const getPayments = async(req:Request, res:Response) => {
    try{
        const paymentEntity = AppDataSource.getRepository(Payment);

        const payments = await paymentEntity
            .createQueryBuilder("payment")
            .leftJoinAndSelect("payment.invoice", "invoice")
            .leftJoinAndSelect("invoice.appointment", "appointment")
            .getMany();

        return res.status(200).json(payments);
    }catch(error){
        return res.status(500).json({message:"server error while getting payments"});
    }
}

