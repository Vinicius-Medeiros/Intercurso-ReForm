import axios from 'axios';
import { Environment } from '../environment';
import { Company } from './auth'; // Import Company interface from auth service
import { Material } from './materialService'; // Import Material interface from material service

const API_URL = Environment.SERVICE_URL || 'http://localhost:3001/api';

export const companyService = {
    async getAllCompaniesExcludingAuthenticated(): Promise<Company[]> {
        const response = await axios.get(`${API_URL}/companies`);
        return response.data;
    },

    getCompanyMaterials: async (companyId: string): Promise<Material[]> => {
        const response = await axios.get(`${API_URL}/companies/${companyId}/materials`);
        return response.data;
    },
}; 