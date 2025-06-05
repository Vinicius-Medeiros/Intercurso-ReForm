import axios from 'axios';
import { Environment } from '../environment';

const API_URL = Environment.SERVICE_URL || 'http://localhost:3001/api';

export enum PurchaseStatus {
    PENDING = "pending",
    APPROVED = "approved",
    DENIED = "denied",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}

export interface Purchase {
    id: string;
    buyer: {
        id: string;
        name: string;
        cnpj: string;
    };
    seller: {
        id: string;
        name: string;
        cnpj: string;
    };
    material: {
        id: string;
        name: string;
        category: string;
        unit: string;
    };
    quantity: number;
    unitPrice: number;
    totalValue: number;
    status: PurchaseStatus;
    denialReason?: string;
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePurchaseRequest {
    sellerId: string;
    materialId: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
}

export interface UpdatePurchaseRequest {
    quantity?: number;
    unitPrice?: number;
    totalValue?: number;
    status?: PurchaseStatus;
}

const purchaseService = {
    async createPurchase(data: CreatePurchaseRequest): Promise<Purchase> {
        const response = await axios.post(`${API_URL}/purchases`, data);
        return response.data;
    },

    async getCompanyPurchases(type: 'buyer' | 'seller'): Promise<Purchase[]> {
        const response = await axios.get(`${API_URL}/purchases?type=${type}`);
        return response.data;
    },

    async approvePurchase(purchaseId: string): Promise<Purchase> {
        const response = await axios.post(`${API_URL}/purchases/${purchaseId}/approve`);
        return response.data;
    },

    async denyPurchase(purchaseId: string, reason?: string): Promise<Purchase> {
        const response = await axios.post(`${API_URL}/purchases/${purchaseId}/deny`, { reason });
        return response.data;
    },

    async cancelPurchase(purchaseId: string, reason?: string): Promise<Purchase> {
        const response = await axios.post(`${API_URL}/purchases/${purchaseId}/cancel`, {
            status: PurchaseStatus.CANCELLED,
            reason
        });
        return response.data;
    },

    async completePurchase(purchaseId: string): Promise<Purchase> {
        const response = await axios.post(`${API_URL}/purchases/${purchaseId}/complete`);
        return response.data;
    },

    async updatePurchase(purchaseId: string, data: UpdatePurchaseRequest): Promise<Purchase> {
        const response = await axios.patch(`${API_URL}/purchases/${purchaseId}`, data);
        return response.data;
    }
};

export { purchaseService };

