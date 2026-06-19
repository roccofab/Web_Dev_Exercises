import {Entity,Column, PrimaryGeneratedColumn, ManyToOne,OneToOne, OneToMany, JoinColumn, } from "typeorm";
import { Appointment } from "./Appointment";
import { Payment } from "./Payment";

@Entity()
export class Invoices{
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Appointment)
    @JoinColumn()
    appointment!: Appointment;

    @Column()
    total!: number;

    @Column()
    status!: string;

    @OneToMany(() => Payment, (payment) => payment.invoice)
    payments!: Payment[];
}