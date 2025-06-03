import { Purchase } from '../../Services/purchaseService';
import { Sale } from '../../Services/saleService';
import { generateContractPDF } from './ContractPDF';

interface PurchaseContractData {
    type: 'purchase';
    purchase: Purchase;
}

interface SaleContractData {
    type: 'sale';
    sale: Sale;
}

type ContractData = PurchaseContractData | SaleContractData;

export const openContractInNewTab = async (data: ContractData) => {
    const pdfUrl = await generateContractPDF(data);
    window.open(pdfUrl, '_blank');
}; 