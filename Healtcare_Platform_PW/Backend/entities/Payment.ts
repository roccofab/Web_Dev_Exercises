import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Invoices } from "./Invoices";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  amount!: number;

  @Column()
  paymentDate!: Date;

  @Column()
  status!: string;

  @ManyToOne(() => Invoices, (invoice) => invoice.payments)
  invoice!: Invoices;
}