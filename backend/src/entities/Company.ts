import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { Address } from "./Address";
import { Material } from "./Material";
import { Purchase } from "./Purchase";
import { Sale } from "./Sale";
import bcrypt from "bcryptjs";

@Entity("companies")
export class Company {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    cnpj: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column("text")
    description: string;

    @Column()
    password: string;

    @Column({ default: "user" })
    role: string;

    @OneToMany(() => Address, (address: Address) => address.company, { cascade: ['insert'] })
    addresses: Address[];

    @OneToMany(() => Material, (material: Material) => material.company)
    materials: Material[];

    // Relationships for purchases where this company is the buyer
    @OneToMany(() => Purchase, (purchase: Purchase) => purchase.buyer)
    purchasedItems: Purchase[];

    // Relationships for purchases where this company is the seller
    @OneToMany(() => Purchase, (purchase: Purchase) => purchase.seller)
    soldItems: Purchase[];

    @OneToMany(() => Sale, (sale: Sale) => sale.seller)
    soldSales: Sale[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        if (this.password) {
            this.password = bcrypt.hashSync(this.password, 10);
        }
    }

    comparePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }
} 