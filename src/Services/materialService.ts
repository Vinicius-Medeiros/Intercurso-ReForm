import axios from 'axios';
import { Environment } from '../environment';

const API_URL = Environment.SERVICE_URL || 'http://localhost:3001/api';

// Define Material interface based on backend entity
export interface Material {
    id: string; // Backend IDs are UUIDs (strings)
    name: string;
    category: string;
    description: string;
    quantity: number; // Store as number
    price: number; // Store as number (price per unit)
    unit: string;
    isActive: boolean;
    createdAt: string; // Dates as strings
    updatedAt: string; // Dates as strings
}

// Define types for requests (omit backend-managed fields)
export type CreateMaterialRequest = Omit<Material, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>;
export type UpdateMaterialRequest = Partial<CreateMaterialRequest> & { isActive?: boolean }; // Allow updating isActive

export const materialService = {
    async getAllMaterials(): Promise<Material[]> {
        const response = await axios.get(`${API_URL}/materials`);
        return response.data;
    },

    async createMaterial(data: CreateMaterialRequest): Promise<Material> {
        const response = await axios.post(`${API_URL}/materials`, data);
        return response.data;
    },

    async updateMaterial(id: string, data: UpdateMaterialRequest): Promise<Material> {
        const response = await axios.put(`${API_URL}/materials/${id}`, data);
        return response.data;
    },

    async deleteMaterial(id: string): Promise<void> {
        await axios.delete(`${API_URL}/materials/${id}`);
    },
}; 