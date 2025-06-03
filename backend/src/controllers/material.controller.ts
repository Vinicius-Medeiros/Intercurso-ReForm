import { Request, Response } from "express";
import { MaterialService } from "../services/material.service";
import { AppError } from "../errors/AppError";
import { z } from 'zod';

// Define schemas for material validation
const createMaterialSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(0, "Quantity must be a non-negative number"),
    price: z.number().min(0, "Price must be a non-negative number"),
    unit: z.string().min(1, "Unit is required"),
    isActive: z.boolean().optional(),
    // companyId will be taken from authenticated user
});

const updateMaterialSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    category: z.string().min(1, "Category is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    quantity: z.number().min(0, "Quantity must be a non-negative number").optional(),
    price: z.number().min(0, "Price must be a non-negative number").optional(),
    unit: z.string().min(1, "Unit is required").optional(),
    isActive: z.boolean().optional(),
});

export class MaterialController {
    private materialService = new MaterialService();

    async createMaterial(req: Request, res: Response): Promise<Response> {
        const validation = createMaterialSchema.safeParse(req.body);
        if (!validation.success) {
            throw new AppError("Validation error", 400);
        }

        const materialData = validation.data;
        const companyId = (req as any).user.id; // Get companyId from authenticated user

        const material = await this.materialService.createMaterial({ ...materialData, companyId });
        return res.status(201).json(material);
    }

    async getAllMaterials(req: Request, res: Response): Promise<Response> {
        const companyId = (req as any).user.id; // Get companyId from authenticated user
        const materials = await this.materialService.getAllMaterialsByCompany(companyId);
        return res.status(200).json(materials);
    }

    async getMaterialById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const companyId = (req as any).user.id; // Get companyId from authenticated user
        const material = await this.materialService.getMaterialById(id, companyId);

        if (!material) {
            throw new AppError("Material not found", 404);
        }

        return res.status(200).json(material);
    }

    async updateMaterial(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const validation = updateMaterialSchema.safeParse(req.body);
        if (!validation.success) {
             throw new AppError("Validation error", 400);
        }

        const materialData = validation.data;
        const companyId = (req as any).user.id; // Get companyId from authenticated user

        const updatedMaterial = await this.materialService.updateMaterial(id, companyId, materialData);
        return res.status(200).json(updatedMaterial);
    }

    async deleteMaterial(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const companyId = (req as any).user.id; // Get companyId from authenticated user
        await this.materialService.deleteMaterial(id, companyId);
        return res.status(204).send();
    }
} 