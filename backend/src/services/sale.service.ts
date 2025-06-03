import { AppDataSource } from "../config/data-source";
import { Sale, SaleStatus } from "../entities/Sale";
import { AppError } from "../errors/AppError";
import { Company } from "../entities/Company";
import { Material } from "../entities/Material";

export class SaleService {
    private saleRepository = AppDataSource.getRepository(Sale);
    private companyRepository = AppDataSource.getRepository(Company);
    private materialRepository = AppDataSource.getRepository(Material);

    async createSale(saleData: Partial<Sale> & { companyId: string, materialId: string }): Promise<Sale> {
        const { companyId, materialId, ...rest } = saleData;

        // Check if company and material exist
        const company = await this.companyRepository.findOneBy({ id: companyId });
        const material = await this.materialRepository.findOneBy({ id: materialId });

        if (!company) {
            throw new AppError("Company not found", 404);
        }
        if (!material) {
            throw new AppError("Material not found", 404);
        }

        const sale = this.saleRepository.create({ ...rest, seller: company, material });
        await this.saleRepository.save(sale);
        return sale;
    }

    async getAllSales(): Promise<Sale[]> {
        return this.saleRepository.find({
            relations: ['company', 'material']
        });
    }

    async getSaleById(id: string): Promise<Sale | null> {
        return this.saleRepository.findOne({
            where: { id },
            relations: ['company', 'material']
        });
    }

    async updateSale(id: string, saleData: Partial<Sale>): Promise<Sale> {
        const sale = await this.getSaleById(id);

        if (!sale) {
            throw new AppError("Sale not found", 404);
        }

        this.saleRepository.merge(sale, saleData);
        await this.saleRepository.save(sale);
        return sale;
    }

    async deleteSale(id: string): Promise<void> {
        const sale = await this.getSaleById(id);

        if (!sale) {
            throw new AppError("Sale not found", 404);
        }

        await this.saleRepository.remove(sale);
    }

     async updateSaleStatus(id: string, status: SaleStatus): Promise<Sale> {
        const sale = await this.getSaleById(id);

        if (!sale) {
            throw new AppError("Sale not found", 404);
        }

        sale.status = status;
        await this.saleRepository.save(sale);
        return sale;
    }
} 