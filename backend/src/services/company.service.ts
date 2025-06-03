import { AppDataSource } from "../config/data-source";
import { Company } from "../entities/Company";
import { AppError } from "../errors/AppError";
import { Address } from "../entities/Address";
import { instanceToPlain } from 'class-transformer';
import { Not } from "typeorm";
import { Material } from "../entities/Material";

// Define a type for the company data to be returned after creation/update (excluding password and methods)
type CompanyWithoutSensitiveInfo = Omit<Company, 'password' | 'hashPassword' | 'comparePassword'>;

export class CompanyService {
    private companyRepository = AppDataSource.getRepository(Company);
    private addressRepository = AppDataSource.getRepository(Address);

    async createCompany(companyData: Partial<Company> & { addresses: Partial<Address>[] }): Promise<CompanyWithoutSensitiveInfo> {
        const { addresses: addressData, ...companyBaseData } = companyData;

        // Check if company with CNPJ or email already exists (assuming email is also unique for login)
        const existingCompany = await this.companyRepository.findOneBy([{ cnpj: companyData.cnpj }, { email: companyData.email }]);
        if (existingCompany) {
            throw new AppError("Company with this CNPJ or email already exists", 409);
        }

        const company = this.companyRepository.create(companyBaseData);

        // Create and associate addresses
        if (addressData && addressData.length > 0) {
            const createdAddresses = addressData.map(address => this.addressRepository.create(address));
            createdAddresses.forEach(address => address.company = company);
            company.addresses = createdAddresses; 
        }

        await this.companyRepository.save(company);

        // Use instanceToPlain to serialize the entity and remove excluded properties
        return instanceToPlain(company) as CompanyWithoutSensitiveInfo;
    }

    async getAllCompanies(): Promise<Company[]> {
        return this.companyRepository.find({
            relations: ['addresses']
        });
    }

    async getCompanyById(id: string): Promise<Company | null> {
        return this.companyRepository.findOne({
            where: { id },
            relations: ['addresses', 'materials', 'purchasedItems', 'soldSales']
        });
    }

    async updateCompany(id: string, companyData: Partial<Company> & { addresses?: Partial<Address>[] }): Promise<CompanyWithoutSensitiveInfo> {
        const company = await this.getCompanyById(id);

        if (!company) {
            throw new AppError("Company not found", 404);
        }

        const { addresses: addressData, ...rest } = companyData;

        // Update company data
        this.companyRepository.merge(company, rest);

        // Update or add addresses
        if (addressData !== undefined) {
            if (company.addresses && company.addresses.length > 0) {
                 await this.addressRepository.remove(company.addresses);
            }

            company.addresses = []; 

             if (addressData && addressData.length > 0) {
                const updatedAddresses = addressData.map(address => this.addressRepository.create(address));
                updatedAddresses.forEach(address => address.company = company);
                company.addresses = updatedAddresses; 
            }
        }
         // If a new password is provided in rest, the BeforeUpdate hook will handle hashing.
        // If addresses are provided, the service handles updating them.

        await this.companyRepository.save(company);

        // Use instanceToPlain to serialize the entity and remove excluded properties
        return instanceToPlain(company) as CompanyWithoutSensitiveInfo;
    }

    async deleteCompany(id: string): Promise<void> {
        const company = await this.companyRepository.findOneBy({ id });

        if (!company) {
            throw new AppError("Company not found", 404);
        }

        await this.companyRepository.remove(company);
    }

    async getAllCompaniesExcluding(companyId: string): Promise<Company[]> {
        return this.companyRepository.find({
            where: { id: Not(companyId) },
            relations: ['addresses', 'materials'], // Include materials in the relations
        });
    }

    async getCompanyMaterials(companyId: string): Promise<Material[]> {
        const company = await this.companyRepository.findOne({
            where: { id: companyId },
            relations: ['materials'],
        });

        if (!company) {
            throw new AppError('Company not found', 404);
        }

        return company.materials;
    }

    // Add other company related service methods as needed
} 