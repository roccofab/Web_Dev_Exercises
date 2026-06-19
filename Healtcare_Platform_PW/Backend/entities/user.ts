import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm";
import { Doctor } from "./doctor";
import { Patient } from "./Patient";
import { Appointment } from "./Appointment";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    role!: string;

    @OneToOne(() => Doctor, (doctor: Doctor) => doctor.user)
    doctor!: Doctor;

    @OneToOne(() => Patient, (patient) => patient.user)
    patient!: Patient;

    @OneToMany(() => Appointment, (appt: Appointment) => appt.createdBy)
    createdAppointments!: Appointment[];
}