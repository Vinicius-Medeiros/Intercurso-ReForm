import { AppError } from "../errors/AppError";
// import { UserService } from "./user.service"; // Remove UserService import
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Company } from "../entities/Company"; // Import Company entity
import { AppDataSource } from "../config/data-source"; // Import AppDataSource
import { Purchase, PurchaseStatus } from "../entities/Purchase";
import { Material } from "../entities/Material";
import { Sale } from "../entities/Sale";

dotenv.config();

// Define a type for the company data to be returned after authentication (excluding password and methods)
type AuthenticatedCompany = Omit<Company, 'password' | 'hashPassword' | 'comparePassword'>;

interface DashboardData {
    totalPurchases: number;
    totalSpent: number;
    totalSales: number;
    activeMaterials: number;
    lastPurchase: string;
}

export class AuthService {
    // private userService = new UserService(); // Remove UserService instance
    private companyRepository = AppDataSource.getRepository(Company); // Use Company repository
    private purchaseRepository = AppDataSource.getRepository(Purchase);
    private materialRepository = AppDataSource.getRepository(Material);
    private saleRepository = AppDataSource.getRepository(Sale);

    async login(cnpj: string, password: string): Promise<{ company: AuthenticatedCompany, token: string }> {
        // Find company by CNPJ instead of email
        const company = await this.companyRepository.findOneBy({ cnpj });

        if (!company || !company.comparePassword(password)) {
            throw new AppError("Invalid CNPJ or password", 401);
        }

        const jwtSecret = process.env.JWT_SECRET as Secret;
        if (!jwtSecret) {
            console.error("cai aqui")
            throw new AppError("JWT secret not configured", 500);
        }

        const token = jwt.sign(
            { id: company.id, role: company.role },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } as SignOptions
        );

        // Rename the destructured password to companyPassword to avoid naming conflict
        const { password: companyPassword, hashPassword, comparePassword, ...companyWithoutSensitiveInfo } = company;

        return { company: companyWithoutSensitiveInfo as AuthenticatedCompany, token };
    }

    // We'll handle registration directly in the AuthController using CompanyService or repository
    // The changePassword logic will also be updated to work with Company

    async getDashboardData(companyId: string): Promise<DashboardData> {
        // Get purchases where this company is the buyer
        const purchasedItems = await this.purchaseRepository.find({
            where: { buyer: { id: companyId }, status: PurchaseStatus.COMPLETED },
            // Include material relation if needed for totalSpent calculation (it is not currently needed)
            // relations: ['material']
        });

        const totalPurchases = purchasedItems.length;
        const totalSpent = purchasedItems.reduce((sum, purchase) => sum + Number(purchase.totalValue), 0);

        // Get sales where this company is the seller
        const sales = await this.saleRepository.find({
            where: { seller: { id: companyId } },
            // Include material relation if needed for totalSales calculation (it is not currently needed)
            // relations: ['material']
        });

        const totalSales = sales.reduce((sum, sale) => sum + Number(sale.totalValue), 0);

        // Get active materials count (assuming Material entity still has a 'company' relation)
        const activeMaterials = await this.materialRepository.count({
            where: { 
                company: { id: companyId },
                isActive: true // Assuming 'isActive' column exists on Material
            }
        });

        // Get last purchase date (from purchasedItems)
        const lastPurchase = purchasedItems.length > 0
            ? purchasedItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt.toLocaleDateString('pt-BR')
            : '';

        return {
            totalPurchases,
            totalSpent,
            totalSales,
            activeMaterials,
            lastPurchase
        };
    }

    // Add other authentication related methods as needed
} 