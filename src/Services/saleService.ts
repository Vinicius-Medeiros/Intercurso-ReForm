import axios from 'axios';
import { Environment } from '../environment';
import { Company } from './auth'; // Import Company if Sale entity relates to it
import { Material } from './materialService'; // Import Material if Sale entity relates to it

const API_URL = Environment.SERVICE_URL || 'http://localhost:3001/api';

export enum SaleStatus {
    PENDING = "pending",
    APPROVED = "approved",
    DENIED = "denied",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

export interface Sale {
    id: string;
    contractNumber: string;
    seller: Company; // Assuming Sale has a ManyToOne relation to Company named 'seller'
    buyer: Company; // Assuming Sale has a ManyToOne relation to Company named 'buyer'
    material: Material; // Assuming Sale has a ManyToOne relation to Material
    quantity: number;
    unitPrice: number;
    totalValue: number;
    status: SaleStatus;
    saleDate: string; // Assuming Date comes as string from backend
    deliveryDate?: string | null; // Assuming nullable Date comes as string or null
    paymentDate?: string | null; // Assuming nullable Date comes as string or null
    notes?: string | null;
    establishedPricePerKg?: number; // Assuming this field exists on backend Sale entity
    denialReason?: string | null; // Assuming this field exists on backend Sale entity
    cancellationReason?: string | null; // Assuming this field exists on backend Sale entity
    createdAt: string;
    updatedAt: string;
}

// Define request interfaces if needed
// export interface CreateSaleRequest { /* ... */ }
// export interface UpdateSaleRequest { /* ... */ }

const saleService = {
    // Placeholder methods
    async createSale(/* data: CreateSaleRequest */): Promise<Sale> {
        // const response = await axios.post(`${API_URL}/sales`, data);
        // return response.data;
        console.log("createSale called");
        return {} as Sale; // Placeholder for buyer side
    },

    async getCompanySales(type: 'buyer' | 'seller'): Promise<Sale[]> {
        // Implement fetching sales for buyer or seller
        const response = await axios.get(`${API_URL}/purchases?type=${type}`); // Note: Using /purchases endpoint for now as per backend routes
        return response.data;
    },

    async approveSale(saleId: string): Promise<Sale> {
        // Implement approve sale
        const response = await axios.post(`${API_URL}/purchases/${saleId}/approve`); // Note: Using /purchases endpoint for actions
        return response.data;
    },

    async rejectSale(saleId: string, reason?: string): Promise<Sale> {
        // Implement reject sale
        const response = await axios.post(`${API_URL}/purchases/${saleId}/deny`, { reason }); // Note: Using /purchases endpoint and deny action
        return response.data;
    },

    async cancelSale(saleId: string, reason?: string): Promise<Sale> {
        // Implement cancel sale
        const response = await axios.post(`${API_URL}/purchases/${saleId}/cancel`, { reason }); // Note: Using /purchases endpoint and cancel action
        return response.data;
    },

    async completeSale(saleId: string): Promise<Sale> {
        // Implement complete sale
        const response = await axios.post(`${API_URL}/purchases/${saleId}/complete`); // Note: Using /purchases endpoint and complete action
        return response.data;
    }
    
    // Add other sale related methods as needed
};

export { saleService };
