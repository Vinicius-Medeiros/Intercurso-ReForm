import axios from 'axios';
import { Environment } from '../environment';
import { Material } from './materialService';

const API_URL = Environment.SERVICE_URL || 'http://localhost:3001/api';

// Configure axios to include credentials (cookies) in requests
axios.defaults.withCredentials = true;

// Types
export interface LoginRequest {
    cnpj: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    description: string;
    password: string;
    role: string;
    addresses?: {
        street: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        isMain?: boolean;
    }[];
    materials?: any[];
    purchases?: any[];
    sales?: any[];
}

export interface Company {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    description: string;
    role: string;
    addresses?: {
        id: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        complement: string;
        neighborhood: string;
        number: string,
        isMain: boolean;
    }[];
    materials?: Material[];
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    company: Company;
}

export interface DashboardData {
    totalPurchases: number;
    totalSpent: number;
    totalSales: number;
    activeMaterials: number;
    lastPurchase: string;
}

// Auth service
export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/auth/login`, data);
        // Cookie is handled automatically by the browser
        return response.data;
    },

    async register(data: RegisterRequest): Promise<{ company: Company }> {
        const response = await axios.post(`${API_URL}/auth/register`, data);
        return response.data;
    },

    async getAuthenticatedCompany(): Promise<{ company: Company }> {
        const response = await axios.get(`${API_URL}/auth/me`);
        return response.data;
    },

    async updateAuthenticatedCompany(data: Partial<Company>): Promise<{ company: Company }> {
        const response = await axios.patch(`${API_URL}/auth/me`, data);
        return response.data;
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<{ company: Company; message: string }> {
        const response = await axios.patch(`${API_URL}/auth/change-password`, {
            currentPassword,
            newPassword
        });
        return response.data;
    },

    async logout(): Promise<void> {
        // The backend handles token invalidation through cookie expiration
        // We just need to clear any local state
        localStorage.removeItem('user');
    },

    async getDashboardData(): Promise<{ dashboard: DashboardData }> {
        const response = await axios.get(`${API_URL}/auth/dashboard`);
        return response.data;
    }
};
