import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Company } from "./Company";
import { Purchase } from "./Purchase";
import { Sale } from "./Sale";

@Entity("materials")
export class Material {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    category: string;

    @Column("text")
    description: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column("decimal", { precision: 10, scale: 2 })
    quantity: number;

    @Column()
    unit: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Company, (company: Company) => company.materials)
    @JoinColumn({ name: "company_id" })
    company: Company;

    @OneToMany(() => Purchase, (purchase: Purchase) => purchase.material)
    purchases: Purchase[];

    @OneToMany(() => Sale, (sale: Sale) => sale.material)
    sales: Sale[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 