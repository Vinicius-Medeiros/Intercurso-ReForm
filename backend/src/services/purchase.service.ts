import { AppDataSource } from "../config/data-source";
import { Company } from "../entities/Company";
import { Material } from "../entities/Material";
import { Purchase, PurchaseStatus } from "../entities/Purchase";
import { Sale, SaleStatus } from "../entities/Sale";
import { AppError } from "../errors/AppError";

export class PurchaseService {
    private purchaseRepository = AppDataSource.getRepository(Purchase);
    private companyRepository = AppDataSource.getRepository(Company);
    private materialRepository = AppDataSource.getRepository(Material);
    private saleRepository = AppDataSource.getRepository(Sale);

    async createPurchase(
        buyerId: string,
        sellerId: string,
        materialId: string,
        quantity: number,
        unitPrice: number,
        totalValue: number
    ): Promise<Purchase> {
        // Validate material exists and belongs to seller
        const material = await this.materialRepository.findOne({
            where: { id: materialId },
            relations: ['company']
        });

        if (!material) {
            throw new AppError("Material not found", 404);
        }

        if (material.company.id !== sellerId) {
            throw new AppError("Material does not belong to seller", 403);
        }

        // Validate quantity is available
        if (material.quantity < quantity) {
            throw new AppError("Insufficient material quantity", 400);
        }

        const purchase = this.purchaseRepository.create({
            buyer: { id: buyerId },
            seller: { id: sellerId },
            material: { id: materialId },
            quantity,
            unitPrice,
            totalValue: totalValue,
            status: PurchaseStatus.PENDING
        });

        return this.purchaseRepository.save(purchase);
    }

    async approvePurchase(purchaseId: string, sellerId: string): Promise<Purchase> {
        const purchase = await this.purchaseRepository.findOne({
            where: { id: purchaseId },
            relations: ['seller', 'material']
        });

        if (!purchase) {
            throw new AppError("Purchase not found", 404);
        }

        if (purchase.seller.id !== sellerId) {
            throw new AppError("Not authorized to approve this purchase", 403);
        }

        if (purchase.status !== PurchaseStatus.PENDING) {
            throw new AppError("Purchase is not pending", 400);
        }

        purchase.status = PurchaseStatus.APPROVED;
        return this.purchaseRepository.save(purchase);
    }

    private async createOrUpdateSale(purchase: Purchase, status: SaleStatus, reason: string | null = null): Promise<void> {
        let sale = await this.saleRepository.findOne({
            where: { purchaseId: purchase.id }
        });

        if (!sale) {
            sale = this.saleRepository.create({
                purchaseId: purchase.id,
                purchase: purchase,
                contractNumber: `SALE-${purchase.id.substring(0, 8)}`,
                quantity: purchase.quantity,
                unitPrice: purchase.unitPrice,
                totalValue: purchase.totalValue,
                seller: purchase.seller,
                material: purchase.material,
                saleDate: purchase.createdAt,
                status: status,
                reason: reason,
                statusChangeDate: new Date()
            });
        } else {
            sale.status = status;
            sale.reason = reason;
            sale.statusChangeDate = new Date();
        }

        await this.saleRepository.save(sale);
    }

    async denyPurchase(purchaseId: string, sellerId: string, reason: string): Promise<Purchase> {
        const purchase = await this.purchaseRepository.findOne({
            where: { id: purchaseId },
            relations: ['seller', 'material']
        });

        if (!purchase) {
            throw new AppError("Purchase not found", 404);
        }

        if (purchase.seller.id !== sellerId) {
            throw new AppError("Not authorized to deny this purchase", 403);
        }

        if (purchase.status !== PurchaseStatus.PENDING) {
            throw new AppError("Purchase is not pending", 400);
        }

        purchase.status = PurchaseStatus.DENIED;
        purchase.denialReason = reason;
        const updatedPurchase = await this.purchaseRepository.save(purchase);
        
        // Create/update sale record
        await this.createOrUpdateSale(updatedPurchase, SaleStatus.DENIED, reason);
        
        return updatedPurchase;
    }

    async cancelPurchase(purchaseId: string, userId: string, reason: string): Promise<Purchase> {
        const purchase = await this.purchaseRepository.findOne({
            where: { id: purchaseId },
            relations: ['seller', 'material']
        });

        if (!purchase) {
            throw new AppError("Purchase not found", 404);
        }

        if (purchase.seller.id !== userId && purchase.buyer.id !== userId) {
            throw new AppError("Not authorized to cancel this purchase", 403);
        }

        purchase.status = PurchaseStatus.CANCELLED;
        purchase.cancellationReason = reason;
        const updatedPurchase = await this.purchaseRepository.save(purchase);
        
        // Create/update sale record
        await this.createOrUpdateSale(updatedPurchase, SaleStatus.CANCELLED, reason);
        
        return updatedPurchase;
    }

    async completePurchase(purchaseId: string, sellerId: string): Promise<Purchase> {
        const purchase = await this.purchaseRepository.findOne({
            where: { id: purchaseId },
            relations: ['seller', 'material']
        });

        if (!purchase) {
            throw new AppError("Purchase not found", 404);
        }

        if (purchase.seller.id !== sellerId) {
            throw new AppError("Not authorized to complete this purchase", 403);
        }

        if (purchase.status !== PurchaseStatus.APPROVED) {
            throw new AppError("Purchase must be approved to be completed", 400);
        }

        // Update material quantity
        const material = await this.materialRepository.findOneBy({ id: purchase.material.id });
        if (material) {
            material.quantity -= purchase.quantity;
            await this.materialRepository.save(material);
        }

        purchase.status = PurchaseStatus.COMPLETED;
        const updatedPurchase = await this.purchaseRepository.save(purchase);
        
        // Create/update sale record
        await this.createOrUpdateSale(updatedPurchase, SaleStatus.COMPLETED);
        
        return updatedPurchase;
    }

    async getCompanyPurchases(companyId: string, type: 'buyer' | 'seller'): Promise<Purchase[]> {
        const where = type === 'buyer' 
            ? { buyer: { id: companyId } }
            : { seller: { id: companyId } };

        return this.purchaseRepository.find({
            where,
            relations: ['buyer', 'seller', 'material'],
            order: { createdAt: 'DESC' }
        });
    }

    async getAllPurchases(): Promise<Purchase[]> {
        return this.purchaseRepository.find({
            relations: ['company', 'material']
        });
    }

    async getPurchaseById(id: string): Promise<Purchase | null> {
        return this.purchaseRepository.findOne({
            where: { id },
            relations: ['buyer', 'seller', 'material']
        });
    }

    async updatePurchase(id: string, purchaseData: Partial<Purchase>): Promise<Purchase> {
        const purchase = await this.getPurchaseById(id);

        if (!purchase) {
            throw new AppError("Purchase not found", 404);
        }

        this.purchaseRepository.merge(purchase, purchaseData);
        await this.purchaseRepository.save(purchase);
        return purchase;
    }

    async deletePurchase(id: string): Promise<void> {
        const purchase = await this.getPurchaseById(id);

        if (!purchase) {
            throw new AppError("Purchase not found", 404);
        }

        await this.purchaseRepository.remove(purchase);
    }

     async updatePurchaseStatus(id: string, status: PurchaseStatus): Promise<Purchase> {
        const purchase = await this.getPurchaseById(id);

        if (!purchase) {
            throw new AppError("Purchase not found", 404);
        }

        purchase.status = status;
        await this.purchaseRepository.save(purchase);
        return purchase;
    }
} 