import { Request, Response } from "express";
import { z } from 'zod';
import { Purchase, PurchaseStatus } from "../entities/Purchase";
import { AppError } from "../errors/AppError";
import { PurchaseService } from "../services/purchase.service";

// Define schemas for purchase validation
const createPurchaseSchema = z.object({
    sellerId: z.string().uuid(),
    materialId: z.string().uuid(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    totalValue: z.number().positive()
});

const updatePurchaseSchema = z.object({
    contractNumber: z.string().min(1, "Contract number is required").optional(),
    quantity: z.number().positive("Quantity must be a positive number").optional(),
    unitPrice: z.number().positive("Unit price must be a positive number").optional(),
    totalValue: z.number().positive("Total value must be a positive number").optional(),
    status: z.nativeEnum(PurchaseStatus).optional(),
    purchaseDate: z.string().transform(str => new Date(str)).optional(),
    deliveryDate: z.string().transform(str => new Date(str)).nullable().optional(),
    paymentDate: z.string().transform(str => new Date(str)).nullable().optional(),
    notes: z.string().nullable().optional(),
    // companyId and materialId should not be updated via this endpoint in a typical scenario
});

const updatePurchaseStatusSchema = z.object({
    reason: z.string().optional()
});

const denyPurchaseSchema = z.object({
    reason: z.string().optional()
});

export class PurchaseController {
    private purchaseService = new PurchaseService();

    async createPurchase(req: Request, res: Response): Promise<Response> {
        const buyerId = (req as any).user.id;
        const validation = createPurchaseSchema.safeParse(req.body);

        if (!validation.success) {
            throw new AppError("Validation error", 400);
        }

        const { sellerId, materialId, quantity, unitPrice, totalValue } = validation.data;

        const purchase = await this.purchaseService.createPurchase(
            buyerId,
            sellerId,
            materialId,
            quantity,
            unitPrice,
            totalValue
        );

        return res.status(201).json(purchase);
    }

    async approvePurchase(req: Request, res: Response): Promise<Response> {
        const sellerId = (req as any).user.id;
        const { purchaseId } = req.params;

        const purchase = await this.purchaseService.approvePurchase(purchaseId, sellerId);
        return res.json(purchase);
    }

    async denyPurchase(req: Request, res: Response): Promise<Response> {
        const sellerId = (req as any).user.id;
        const { purchaseId } = req.params;
        const validation = denyPurchaseSchema.safeParse(req.body);

        if (!validation.success) {
            throw new AppError("Validation error", 400);
        }

        const { reason } = validation.data;

        const purchase = await this.purchaseService.denyPurchase(purchaseId, sellerId, reason || "No reason provided");
        return res.json(purchase);
    }

    async cancelPurchase(req: Request, res: Response): Promise<Response> {
        const userId = (req as any).user.id;
        const { purchaseId } = req.params;
        const validation = updatePurchaseStatusSchema.safeParse(req.body);

        if (!validation.success) {
            throw new AppError("Validation error", 400);
        }

        const { reason } = validation.data;

        const purchase = await this.purchaseService.cancelPurchase(purchaseId, userId, reason || "No reason provided");
        return res.json(purchase);
    }

    async completePurchase(req: Request, res: Response): Promise<Response> {
        const sellerId = (req as any).user.id;
        const { purchaseId } = req.params;

        const purchase = await this.purchaseService.completePurchase(purchaseId, sellerId);
        return res.json(purchase);
    }

    async getCompanyPurchases(req: Request, res: Response): Promise<Response> {
        const companyId = (req as any).user.id;
        const { type } = req.query;

        if (type !== 'buyer' && type !== 'seller') {
            throw new AppError("Invalid purchase type. Must be 'buyer' or 'seller'", 400);
        }

        const purchases = await this.purchaseService.getCompanyPurchases(companyId, type as 'buyer' | 'seller');
        return res.json(purchases);
    }

    async getAllPurchases(req: Request, res: Response): Promise<Response> {
        const purchases = await this.purchaseService.getAllPurchases();
        return res.status(200).json(purchases);
    }

    async getPurchaseById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const purchase = await this.purchaseService.getPurchaseById(id);

        if (!purchase) {
            throw new AppError("Purchase not found", 404);
        }

        return res.status(200).json(purchase);
    }

    async updatePurchase(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const validation = updatePurchaseSchema.safeParse(req.body);
        if (!validation.success) {
             throw new AppError("Validation error", 400);
        }

        const purchaseData = validation.data;

        // Create a new object excluding null date fields if they exist and are null
        const dataToUpdate: Partial<typeof purchaseData> = { ...purchaseData };
        if (dataToUpdate.deliveryDate === null) {
             delete dataToUpdate.deliveryDate;
        }
         if (dataToUpdate.paymentDate === null) {
             delete dataToUpdate.paymentDate;
        }

        const updatedPurchase = await this.purchaseService.updatePurchase(id, dataToUpdate as Partial<Purchase>);
        return res.status(200).json(updatedPurchase);
    }

     async updatePurchaseStatus(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const validation = updatePurchaseStatusSchema.safeParse(req.body);
        if (!validation.success) {
             throw new AppError("Validation error", 400);
        }

        const { status } = validation.data;
        const updatedPurchase = await this.purchaseService.updatePurchaseStatus(id, status);
        return res.status(200).json(updatedPurchase);
    }

    async deletePurchase(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        await this.purchaseService.deletePurchase(id);
        return res.status(204).send();
    }
} 