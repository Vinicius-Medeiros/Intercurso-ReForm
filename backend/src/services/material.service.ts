import { AppDataSource } from "../config/data-source";
import { Material } from "../entities/Material";
import { AppError } from "../errors/AppError";
import { Company } from "../entities/Company";

export class MaterialService {
    private materialRepository = AppDataSource.getRepository(Material);
    private companyRepository = AppDataSource.getRepository(Company);

    async createMaterial(materialData: Partial<Material> & { companyId: string }): Promise<Material> {
        const { companyId, ...rest } = materialData;

        const company = await this.companyRepository.findOneBy({ id: companyId });

        if (!company) {
            throw new AppError("Company not found", 404);
        }

        const material = this.materialRepository.create({ ...rest, company });
        await this.materialRepository.save(material);
        return material;
    }

    async getAllMaterialsByCompany(companyId: string): Promise<Material[]> {
        return this.materialRepository.find({
            where: { company: { id: companyId } },
            relations: ['company']
        });
    }

    async getMaterialById(id: string, companyId: string): Promise<Material | null> {
        return this.materialRepository.findOne({
            where: { id, company: { id: companyId } },
            relations: ['company']
        });
    }

    async updateMaterial(id: string, companyId: string, materialData: Partial<Material>): Promise<Material> {
        const material = await this.getMaterialById(id, companyId);

        if (!material) {
            throw new AppError("Material not found or does not belong to company", 404);
        }

        this.materialRepository.merge(material, materialData);
        await this.materialRepository.save(material);
        return material;
    }

    async deleteMaterial(id: string, companyId: string): Promise<void> {
        const material = await this.getMaterialById(id, companyId);

        if (!material) {
            throw new AppError("Material not found or does not belong to company", 404);
        }

        await this.materialRepository.remove(material);
    }
} 