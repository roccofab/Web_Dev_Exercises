import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from "typeorm";
import { Appointment } from "./Appointment";
import { Doctor } from "./doctor";

@Entity()
export class Details{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    type!: "DIAGNOSIS" | "THERAPY" | "REPORT";
    
    @Column()
    content!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date; 
    

    @ManyToOne(() => Doctor)
    doctor!: Doctor;

    @Column()
    version!: number;

    @OneToOne(() => Appointment)
    @JoinColumn()
    appointment!: Appointment;

}