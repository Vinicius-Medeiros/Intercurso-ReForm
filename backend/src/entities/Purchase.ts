import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./Company";
import { Material } from "./Material";

export enum PurchaseStatus {
    PENDING = "pending",
    APPROVED = "approved",
    DENIED = "denied",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}

@Entity("purchases")
export class Purchase {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Company, { eager: true })
    buyer: Company;

    @ManyToOne(() => Company, { eager: true })
    seller: Company;

    @ManyToOne(() => Material, { eager: true })
    material: Material;

    @Column("decimal", { precision: 10, scale: 2 })
    quantity: number;

    @Column("decimal", { precision: 10, scale: 2 })
    unitPrice: number;

    @Column("decimal", { precision: 10, scale: 2 })
    totalValue: number;

    @Column({
        type: "enum",
        enum: PurchaseStatus,
        default: PurchaseStatus.PENDING
    })
    status: PurchaseStatus;

    @Column({ nullable: true })
    denialReason?: string;

    @Column({ nullable: true })
    cancellationReason?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 