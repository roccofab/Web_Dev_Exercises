import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";
import { Doctor } from "./doctor";
import { Patient } from "./Patient";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @ManyToOne(() => User, (user: User) => user.createdAppointments)
    createdBy!: User;

    @ManyToOne(() => Doctor, {nullable:true})
    doctor?: Doctor;

    @ManyToOne(() => Patient)
    patient!: Patient;

    @Column({type: "date"})
    date!: string;

    @Column({type: "time"})
    start_time!: string;

    @Column({type: "time"})
    end_time!: string;

    @Column()
    status!: string;
}
