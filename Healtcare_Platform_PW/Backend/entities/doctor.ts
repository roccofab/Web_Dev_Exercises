import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, OneToOne, OneToMany } from "typeorm";
import { User } from "./user";
import { Appointment } from "./Appointment";

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    specialization!: string;

    @OneToOne(() => User, (user: User) => user.doctor)
    @JoinColumn()
    user!: User;

    @OneToMany(() => Appointment, (appt: Appointment) => appt.doctor)
    appointments!: Appointment[];
}
