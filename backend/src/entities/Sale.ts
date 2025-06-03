import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Company } from "./Company";
import { Material } from "./Material";

export enum SaleStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

@Entity("sales")
export class Sale {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    contractNumber: string;

    @Column("decimal", { precision: 10, scale: 2 })
    quantity: number;

    @Column("decimal", { precision: 10, scale: 2 })
    unitPrice: number;

    @Column("decimal", { precision: 10, scale: 2 })
    totalValue: number;

    @Column({
        type: "enum",
        enum: SaleStatus,
        default: SaleStatus.PENDING
    })
    status: SaleStatus;

    @Column({ type: "date" })
    saleDate: Date;

    @Column({ type: "date", nullable: true })
    deliveryDate: Date;

    @Column({ type: "date", nullable: true })
    paymentDate: Date;

    @Column("text", { nullable: true })
    notes: string;

    @ManyToOne(() => Company, (company: Company) => company.soldItems)
    @JoinColumn({ name: "seller_id" })
    seller: Company;

    @ManyToOne(() => Material, (material: Material) => material.sales)
    @JoinColumn({ name: "material_id" })
    material: Material;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 