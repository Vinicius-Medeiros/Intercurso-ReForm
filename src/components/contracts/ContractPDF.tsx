import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import { Purchase, PurchaseStatus } from '../../Services/purchaseService';
import { Sale, SaleStatus } from '../../Services/saleService';

// Register fonts
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
    ]
});

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Roboto',
    },
    header: {
        marginBottom: 30,
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 10,
        color: '#1a237e',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 500,
        color: '#424242',
        marginBottom: 5,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 10,
        color: '#1a237e',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: '40%',
        fontSize: 12,
        fontWeight: 500,
        color: '#616161',
    },
    value: {
        width: '60%',
        fontSize: 12,
        color: '#212121',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 50,
        right: 50,
        textAlign: 'center',
        fontSize: 10,
        color: '#757575',
        borderTop: '1px solid #e0e0e0',
        paddingTop: 10,
    },
    signature: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureBox: {
        width: '45%',
        borderTop: '1px solid #000',
        paddingTop: 5,
        textAlign: 'center',
        fontSize: 10,
    },
    status: {
        textAlign: 'center',
        padding: '5px 10px',
        borderRadius: 3,
        fontSize: 10,
        fontWeight: 500,
        color: '#fff',
        width: 100,
        marginVertical: 5,
        marginHorizontal: 'auto',
    },
    centeredBoldText: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 600,
        marginTop: 5,
        color: '#212121',
    },
});

// Define the new contract data type
interface PurchaseContractData {
    type: 'purchase';
    purchase: Purchase;
}

interface SaleContractData {
    type: 'sale';
    sale: Sale;
}

type ContractPDFData = PurchaseContractData | SaleContractData;

// Update getStatusColor and getStatusLabel to handle both PurchaseStatus and SaleStatus
const getStatusColor = (status: PurchaseStatus | SaleStatus) => {
    switch (status) {
        case PurchaseStatus.PENDING:
        case SaleStatus.PENDING:
            return '#FFA726'; // Laranja
        case PurchaseStatus.APPROVED:
        case SaleStatus.APPROVED:
            return '#66BB6A'; // Verde
        case PurchaseStatus.COMPLETED:
        case SaleStatus.COMPLETED:
            return '#42A5F5'; // Azul
        case PurchaseStatus.DENIED:
            return '#EF5350'; // Vermelho
        case PurchaseStatus.CANCELLED:
        case SaleStatus.CANCELLED:
            return '#757575'; // Cinza
        default:
            return '#757575';
    }
};

const getStatusLabel = (status: PurchaseStatus | SaleStatus) => {
    switch (status) {
        case PurchaseStatus.PENDING:
        case SaleStatus.PENDING:
            return 'PENDENTE';
        case PurchaseStatus.APPROVED:
        case SaleStatus.APPROVED:
            return 'APROVADO';
        case PurchaseStatus.COMPLETED:
        case SaleStatus.COMPLETED:
            return 'CONCLUÍDO';
        case PurchaseStatus.DENIED:
            return 'NEGADO'; // Use DENIED for purchases
        case PurchaseStatus.CANCELLED:
        case SaleStatus.CANCELLED:
            return 'CANCELADO';
        default:
            return 'DESCONHECIDO'; // Return a default string instead of calling toUpperCase()
    }
};

export const generateContractPDF = async (data: ContractPDFData) => {
    // Access data based on type
    const contractType = data.type === 'purchase' ? 'COMPRA' : 'VENDA';
    const currentDate = new Date().toLocaleDateString('pt-BR');

    const materialName = data.type === 'purchase' ? data.purchase.material.name : data.sale.material.name;
    const quantity = data.type === 'purchase' ? data.purchase.quantity : data.sale.quantity;
    const totalValue = data.type === 'purchase' ? data.purchase.totalValue : data.sale.totalValue;
    const contractDate = new Date(data.type === 'purchase' ? data.purchase.createdAt : data.sale.createdAt).toLocaleDateString('pt-BR'); // Use createdAt for date
    const status = data.type === 'purchase' ? data.purchase.status : data.sale.status;

    const getPriceInfo = () => {
        let obj
        if (data.type === 'sale') {
            obj = data.sale
        } else {
            obj = data.purchase
        }

        const diffPrice = obj.unitPrice * obj.quantity != obj.totalValue
        const isDescount = obj.unitPrice * obj.quantity > obj.totalValue

        return (
            <>
                <View style={styles.row}>
                    <Text style={styles.label}>Preço Estabelecido ({obj.material.unit}):</Text>
                    <Text style={styles.value}>{Number(obj.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {obj.material.unit}</Text>
                </View>
                {diffPrice && (
                    <>
                        <View style={styles.row}>
                            <Text style={styles.label}>Preço Final ({obj.material.unit}):</Text>
                            <Text style={styles.value}>{(Number(obj.totalValue) / obj.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {obj.material.unit}</Text>
                        </View>
                        <View style={{ width: '100%', textAlign: 'center', marginTop: 5 }}>
                            <Text style={styles.centeredBoldText}>Foi acordado que esse {isDescount ? 'desconto' : 'valorização'} no valor seria aceito.</Text>
                        </View>
                    </>
                )}
            </>
        )
    }

    const applyCnpjMask = (cnpj: string) => {
        return cnpj.replace(
            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
            '$1.$2.$3/$4-$5'
        )
    }

    const getContractId = () => {
        let obj
        if (data.type === 'sale') {
            obj = data.sale
        } else {
            obj = data.purchase
        }

        return (obj.id.match(/\d/g) || []).slice(0, 4).join('')
    }

    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>CONTRATO DE {contractType}</Text>
                    <Text style={[styles.status, { backgroundColor: getStatusColor(status) }]}>{getStatusLabel(status)}</Text>
                    <Text style={styles.subtitle}>PROPOSTA COMERCIAL</Text>
                    <Text style={styles.subtitle}>Nº {getContractId()}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>INFORMAÇÕES GERAIS</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Data do Contrato:</Text>
                        <Text style={styles.value}>{currentDate}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Data da Proposta:</Text>
                        <Text style={styles.value}>{contractDate}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={styles.value}>{getStatusLabel(status)}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PARTES ENVOLVIDAS</Text>
                    {/* Use companyName and companyCnpj based on contract type */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Empresa {data.type === 'purchase' ? 'Compradora' : 'Vendedora'}:</Text>
                        <Text style={styles.value}>{data.type === 'purchase' ? data.purchase.buyer.name : data.sale.seller.name} {/* Use buyer.name for purchase, seller.name for sale */}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CNPJ:</Text>
                        <Text style={styles.value}>{data.type === 'purchase' ? applyCnpjMask(data.purchase.buyer.cnpj) : applyCnpjMask(data.sale.seller.cnpj)} {/* Use buyer.cnpj for purchase, seller.cnpj for sale */}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Empresa {data.type === 'purchase' ? 'Vendedora' : 'Compradora'}:</Text>
                        <Text style={styles.value}>{data.type === 'purchase' ? data.purchase.seller.name : data.sale.buyer.name} {/* Use seller.name for purchase, buyer.name for sale */}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CNPJ:</Text>
                        <Text style={styles.value}>{data.type === 'purchase' ? applyCnpjMask(data.purchase.seller.cnpj) : applyCnpjMask(data.sale.buyer.cnpj)} {/* Use seller.cnpj for purchase, buyer.cnpj for sale */}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DETALHES DO MATERIAL</Text>
                    {/* Use materialName */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Material:</Text>
                        <Text style={styles.value}>{materialName}</Text>
                    </View>
                    {/* Use quantity and unit */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Quantidade:</Text>
                        <Text style={styles.value}>{Number(quantity).toLocaleString('pt-BR')} {data.type === 'purchase' ? data.purchase.material.unit : data.sale.material.unit} {/* Use material.unit */}</Text>
                    </View>
                    {/* Use totalValue */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Valor Total:</Text>
                        <Text style={styles.value}>{Number(totalValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
                    </View>
                    {getPriceInfo()}
                </View>

                {/* Add denial/cancellation reason if status is DENIED or CANCELLED */}
                {data.type === 'purchase' && (data.purchase.status === PurchaseStatus.DENIED || data.purchase.status === PurchaseStatus.CANCELLED) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{data.purchase.status === PurchaseStatus.DENIED ? 'MOTIVO DA NEGATIVA' : 'MOTIVO DO CANCELAMENTO'}</Text>
                        <Text style={styles.value}>{data.purchase.status === PurchaseStatus.DENIED ? data.purchase.denialReason : data.purchase.cancellationReason}</Text>
                    </View>
                )}
                {data.type === 'sale' && (data.sale.status === SaleStatus.DENIED || data.sale.status === SaleStatus.CANCELLED) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{data.sale.status === SaleStatus.DENIED ? 'MOTIVO DA REJEIÇÃO' : 'MOTIVO DO CANCELAMENTO'}</Text>
                        <Text style={styles.value}>{data.sale.status === SaleStatus.DENIED ? data.sale.denialReason : data.sale.cancellationReason} {/* Assuming rejectionReason for sales */}</Text>
                    </View>
                )}


                <View style={styles.signature}>
                    <View style={styles.signatureBox}>
                        <Text>_________________________</Text>
                        <Text>{data.type === 'purchase' ? data.purchase.buyer.name : data.sale.seller.name}</Text> {/* Use buyer.name for purchase, seller.name for sale */}
                        <Text>{data.type === 'purchase' ? 'EMPRESA COMPRADORA' : 'EMPRESA VENDEDORA'}</Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text>_________________________</Text>
                        <Text>{data.type === 'purchase' ? data.purchase.seller.name : data.sale.buyer.name}</Text> {/* Use seller.name for purchase, buyer.name for sale */}
                        <Text>{data.type === 'purchase' ? 'EMPRESA VENDEDORA' : 'EMPRESA COMPRADORA'}</Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Documento gerado em {currentDate}
                </Text>
            </Page>
        </Document>
    );

    const blob = await pdf(<MyDocument />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    return pdfUrl;
}; 