import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AppError } from "../errors/AppError";
import { z } from 'zod';
import { CompanyService } from "../services/company.service";
import { AppDataSource } from "../config/data-source";
import { Company } from "../entities/Company";
import { instanceToPlain } from "class-transformer";

// Define schema for login request body
const loginSchema = z.object({
    cnpj: z.string().min(14, "CNPJ must be at least 14 characters long").nonempty("CNPJ is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Define schema for registration request body
const registerSchema = z.object({
    name: z.string().min(1, "Company name is required"),
    cnpj: z.string().min(14, "CNPJ must be at least 14 characters long").nonempty("CNPJ is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone number is required"),
    description: z.string().min(1, "Description is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    addresses: z.array(z.object({
        street: z.string().min(1, "Street is required"),
        number: z.string().min(1, "Number is required"),
        complement: z.string().optional(),
        neighborhood: z.string().min(1, "Neighborhood is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string().min(1, "Zip code is required"),
        isMain: z.boolean().optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional()
    })).optional(),
});

// Define schema for update company request body
const updateCompanySchema = z.object({
    name: z.string().min(1, "Company name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().min(1, "Phone number is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    addresses: z.array(z.object({
        id: z.string().optional(), // Allow ID for updates
        street: z.string().min(1, "Street is required"),
        number: z.string().min(1, "Number is required"),
        complement: z.string().optional(),
        neighborhood: z.string().min(1, "Neighborhood is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string().min(1, "Zip code is required"),
        isMain: z.boolean().optional(),
        // createdAt and updatedAt are usually not updated directly via API
    })).optional(),
});

// Define schema for change password request body
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});

export class AuthController {
    private authService = new AuthService();
    private companyService = new CompanyService();

    async login(req: Request, res: Response): Promise<Response> {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            throw new AppError("Validation error", 400);
        }

        const { cnpj, password } = validation.data;

        const { company, token } = await this.authService.login(cnpj, password);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

         // Use instanceToPlain to serialize the entity and remove excluded properties
        return res.status(200).json({ company: instanceToPlain(company) });
    }

    async register(req: Request, res: Response): Promise<Response> {
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            console.error("Registration Validation Error:", validation.error.errors);
            throw new AppError("Validation error", 400);
        }

        const companyData = validation.data;
        const { addresses, ...companyBaseData } = companyData;

        // Ensure addresses is an array, even if optional and not provided
        const addressesArray = addresses || [];

        const newCompany = await this.companyService.createCompany({
            ...companyBaseData,
            addresses: addressesArray
        } as any); // Casting to any temporarily due to potential type mismatch with addresses

        // Use instanceToPlain to serialize the entity and remove excluded properties
        return res.status(201).json({ company: instanceToPlain(newCompany) });
    }

    async getAuthenticatedCompany(req: Request, res: Response): Promise<Response> {
        // Assuming authenticateMiddleware attaches user (company) to req.user
        const companyId = (req as any).user.id; 

        const company = await this.companyService.getCompanyById(companyId);

        if (!company) {
             // This case should ideally not happen if auth middleware is correct,
             // but handle defensively.
            throw new AppError("Authenticated company not found", 404);
        }
        
        // Use instanceToPlain to serialize the entity and remove excluded properties
        return res.status(200).json({ company: instanceToPlain(company) });
    }

    async updateAuthenticatedCompany(req: Request, res: Response): Promise<Response> {
         const validation = updateCompanySchema.safeParse(req.body);
         if (!validation.success) {
             throw new AppError("Validation error", 400);
         }

         const companyId = (req as any).user.id;
         const companyData = validation.data;

         const updatedCompany = await this.companyService.updateCompany(companyId, companyData as any);

         // Use instanceToPlain to serialize the entity and remove excluded properties
         return res.status(200).json({ company: instanceToPlain(updatedCompany) });
    }

    async changePassword(req: Request, res: Response): Promise<Response> {
        const validation = changePasswordSchema.safeParse(req.body);
        if (!validation.success) {
            throw new AppError("Validation error", 400);
        }

        const { currentPassword, newPassword } = validation.data;
        const companyId = (req as any).user.id; // Assuming user is attached by auth middleware

        const companyRepository = AppDataSource.getRepository(Company);
        const company = await companyRepository.findOneBy({ id: companyId });

        if (!company) {
            throw new AppError("Company (User) not found", 404);
        }

        if (!company.comparePassword(currentPassword)) {
            throw new AppError("Invalid current password", 400);
        }

        company.password = newPassword;
        await companyRepository.save(company);

         // Use instanceToPlain to serialize the entity and remove excluded properties
        return res.status(200).json({ company: instanceToPlain(company), message: "Password changed successfully" });
    }

    async getDashboardData(req: Request, res: Response): Promise<Response> {
        const companyId = (req as any).user.id;
        const dashboardData = await this.authService.getDashboardData(companyId);
        return res.status(200).json({ dashboard: dashboardData });
    }

    // Add other auth related controller methods as needed
} 