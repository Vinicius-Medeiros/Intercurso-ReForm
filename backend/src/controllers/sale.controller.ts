import { Request, Response } from "express";
import { SaleService } from "../services/sale.service";
import { AppError } from "../errors/AppError";
import { z } from 'zod';
import { SaleStatus } from "../entities/Sale";
import { Sale } from "../entities/Sale";

// Define schemas for sale validation
const createSaleSchema = z.object({
    contractNumber: z.string().min(1, "Contract number is required"),
    quantity: z.number().positive("Quantity must be a positive number"),
    unitPrice: z.number().positive("Unit price must be a positive number"),
    totalValue: z.number().positive("Total value must be a positive number"),
    status: z.nativeEnum(SaleStatus).default(SaleStatus.PENDING).optional(),
    saleDate: z.string().transform(str => new Date(str)),
    deliveryDate: z.string().transform(str => new Date(str)).nullable().optional(),
    paymentDate: z.string().transform(str => new Date(str)).nullable().optional(),
    notes: z.string().nullable().optional(),
    companyId: z.string().uuid("Invalid company ID format"),
    materialId: z.string().uuid("Invalid material ID format"),
});

const updateSaleSchema = z.object({
    contractNumber: z.string().min(1, "Contract number is required").optional(),
    quantity: z.number().positive("Quantity must be a positive number").optional(),
    unitPrice: z.number().positive("Unit price must be a positive number").optional(),
    totalValue: z.number().positive("Total value must be a positive number").optional(),
    status: z.nativeEnum(SaleStatus).optional(),
    saleDate: z.string().transform(str => new Date(str)).optional(),
    deliveryDate: z.string().transform(str => new Date(str)).nullable().optional(),
    paymentDate: z.string().transform(str => new Date(str)).nullable().optional(),
    notes: z.string().nullable().optional(),
    // companyId and materialId should not be updated via this endpoint in a typical scenario
});

const updateSaleStatusSchema = z.object({
    status: z.nativeEnum(SaleStatus),
});

export class SaleController {
    private saleService = new SaleService();

    async createSale(req: Request, res: Response): Promise<Response> {
        const validation = createSaleSchema.safeParse(req.body);
        if (!validation.success) {
            throw new AppError("Validation error", 400);
        }

        const saleData = validation.data;
        const sale = await this.saleService.createSale(saleData as any);
        return res.status(201).json(sale);
    }

    async getAllSales(req: Request, res: Response): Promise<Response> {
        const sales = await this.saleService.getAllSales();
        return res.status(200).json(sales);
    }

    async getSaleById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const sale = await this.saleService.getSaleById(id);

        if (!sale) {
            throw new AppError("Sale not found", 404);
        }

        return res.status(200).json(sale);
    }

    async updateSale(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const validation = updateSaleSchema.safeParse(req.body);
        if (!validation.success) {
             throw new AppError("Validation error", 400);
        }

        const saleData = validation.data;

        // Create a new object excluding null date fields if they exist and are null
        const dataToUpdate: Partial<typeof saleData> = { ...saleData };
        if (dataToUpdate.deliveryDate === null) {
             delete dataToUpdate.deliveryDate;
        }
         if (dataToUpdate.paymentDate === null) {
             delete dataToUpdate.paymentDate;
        }

        const updatedSale = await this.saleService.updateSale(id, dataToUpdate as Partial<Sale>);
        return res.status(200).json(updatedSale);
    }

     async updateSaleStatus(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const validation = updateSaleStatusSchema.safeParse(req.body);
        if (!validation.success) {
             throw new AppError("Validation error", 400);
        }

        const { status } = validation.data;
        const updatedSale = await this.saleService.updateSaleStatus(id, status);
        return res.status(200).json(updatedSale);
    }

    async deleteSale(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        await this.saleService.deleteSale(id);
        return res.status(204).send();
    }
} 