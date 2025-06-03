import { Request, Response } from "express";
import { CompanyService } from "../services/company.service";
import { AppError } from "../errors/AppError";
import { z } from 'zod';
import { Address } from "../entities/Address"; // Import Address entity for typing
import { Company } from "../entities/Company"; // Import Company entity for typing
import { instanceToPlain } from "class-transformer";

// Define schemas for company and address validation
const addressSchema = z.object({
    street: z.string().min(1, "Street is required"),
    number: z.string().min(1, "Number is required"),
    complement: z.string().nullable().optional(),
    neighborhood: z.string().min(1, "Neighborhood is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    isMain: z.boolean().default(false).optional(),
    // Include optional fields from entity for better type compatibility
    id: z.string().uuid().optional(),
    company: z.any().optional(), // Allow any for company relationship validation here
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

const createCompanySchema = z.object({
    name: z.string().min(1, "Company name is required"),
    cnpj: z.string().min(14, "CNPJ must be at least 14 characters long"), // Basic CNPJ validation
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone number is required"),
    description: z.string().min(1, "Description is required"),
    addresses: z.array(addressSchema).min(1, "At least one address is required"),
});

const updateCompanySchema = z.object({
    name: z.string().min(1, "Company name is required").optional(),
    cnpj: z.string().min(14, "CNPJ must be at least 14 characters long").optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().min(1, "Phone number is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    addresses: z.array(addressSchema).optional(), // Addresses can be updated/added
});

export class CompanyController {
    private companyService = new CompanyService();

    async createCompany(req: Request, res: Response): Promise<Response> {
        const validation = createCompanySchema.safeParse(req.body);
        if (!validation.success) {
            throw new AppError("Validation error", 400);
        }

        const companyData = validation.data;

        const company = await this.companyService.createCompany(companyData as any);
        return res.status(201).json(company);
    }

    async getAllCompanies(req: Request, res: Response): Promise<Response> {
        const companies = await this.companyService.getAllCompanies();
        return res.status(200).json(companies);
    }

    async getCompanyById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const company = await this.companyService.getCompanyById(id);

        if (!company) {
            throw new AppError("Company not found", 404);
        }

        return res.status(200).json(company);
    }

    async updateCompany(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const validation = updateCompanySchema.safeParse(req.body);
        if (!validation.success) {
             throw new AppError("Validation error", 400);
        }

        const companyData = validation.data;

        const updatedCompany = await this.companyService.updateCompany(id, companyData as any);
        return res.status(200).json(updatedCompany);
    }

    async deleteCompany(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        await this.companyService.deleteCompany(id);
        return res.status(204).send();
    }

    async getAllCompaniesExcludingAuthenticated(req: Request, res: Response): Promise<Response> {
        const companyId = (req as any).user.id; // Get authenticated company ID
        const companies = await this.companyService.getAllCompaniesExcluding(companyId);
        // Use instanceToPlain to serialize entities and remove excluded properties like password
        return res.status(200).json(instanceToPlain(companies));
    }

    // Add other company related controller methods as needed
    async getCompanyMaterials(req: Request, res: Response): Promise<Response> {
        const { companyId } = req.params;

        const materials = await this.companyService.getCompanyMaterials(companyId);

        return res.json(materials);
    }
} 