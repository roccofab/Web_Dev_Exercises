import { Entity, PrimaryGeneratedColumn, Column,OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Patient{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    fiscalCode!: string;

    @OneToOne(() => User)
    @JoinColumn({ name: "userId" })
    user!: User;
}