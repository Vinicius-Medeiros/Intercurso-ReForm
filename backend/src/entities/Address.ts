import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Company } from "./Company";
import { Exclude } from 'class-transformer';

@Entity("addresses")
export class Address {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    street: string;

    @Column()
    number: string;

    @Column({ nullable: true })
    complement: string;

    @Column()
    neighborhood: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    zipCode: string;

    @Column({ default: false })
    isMain: boolean;

    @ManyToOne(() => Company, company => company.addresses)
    @JoinColumn({ name: "company_id" })
    @Exclude()
    company: Company;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 