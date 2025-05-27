import { Box, Typography, Grid } from '@mui/material';
import { useState } from 'react';
import { CompanyInfo } from './components/CompanyInfo';
import { Addresses } from './components/Addresses';
import { Dashboard } from './components/Dashboard';
import { AddressModal } from '../../components/modals/AddressModal';
import { useSnackbar } from 'notistack';

interface Address {
    id: number;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isMain: boolean;
}

export type CompanyInfoType = {
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    description: string;
}

export const AccountPage = () => {
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const { enqueueSnackbar } = useSnackbar()

    // Dados de exemplo - substituir por dados reais da API
    const [companyInfo, setCompanyInfo] = useState<CompanyInfoType>({
        name: 'Construtora ABC',
        cnpj: '12.345.678/0001-90',
        email: 'contato@construtoraabc.com.br',
        phone: '(85) 3333-4444',
        description: 'Empresa especializada em construções sustentáveis e projetos de grande porte.'
    });

    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: 1,
            street: 'Rua das Construções',
            number: '123',
            complement: 'Sala 45',
            neighborhood: 'Centro',
            city: 'Fortaleza',
            state: 'CE',
            zipCode: '60000-000',
            isMain: true
        },
        {
            id: 2,
            street: 'Av. dos Materiais',
            number: '456',
            neighborhood: 'Aldeota',
            city: 'Fortaleza',
            state: 'CE',
            zipCode: '60150-000',
            isMain: false
        },
        {
            id: 3,
            street: 'Av. WS',
            number: '150',
            neighborhood: 'Washington Soares',
            city: 'Fortaleza',
            state: 'CE',
            zipCode: '60000-000',
            isMain: false
        }
    ]);

    // Dados de exemplo para o dashboard
    const dashboardData = {
        totalPurchases: 150,
        totalSpent: 450000,
        totalSales: 680000,
        activeMaterials: 25,
        lastPurchase: '15/03/2024'
    };

    const handleEditCompanyInfo = (updatedInfo: typeof companyInfo) => {
        if (companyInfo !== updatedInfo) {
            setCompanyInfo(updatedInfo);
            enqueueSnackbar(`Informações da empresa atualizadas com sucesso!`, { variant: "success", })
        }
    };

    const handleAddAddress = () => {
        setSelectedAddress(null);
        setIsAddressModalOpen(true);
    };

    const handleEditAddress = (address: Address) => {
        setSelectedAddress(address);
        setIsAddressModalOpen(true);
    };

    const handleDeleteAddress = (addressId: number) => {
        setAddresses(addresses.filter(addr => addr.id !== addressId));
    };

    const handleSetMainAddress = (addressId: number) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isMain: addr.id === addressId
        })));
    };

    const handleSaveAddress = (addressData: Omit<Address, 'id' | 'isMain'>) => {
        if (selectedAddress) {
            // Editar endereço existente
            setAddresses(addresses.map(addr =>
                addr.id === selectedAddress.id
                    ? { ...addr, ...addressData }
                    : addr
            ));
            enqueueSnackbar(`Informações de endereço atualizadas com sucesso!`, { variant: "success", })
        } else {
            // Adicionar novo endereço
            const newAddress: Address = {
                id: Math.max(...addresses.map(a => a.id)) + 1,
                ...addressData,
                isMain: addresses.length === 0 // Se for o primeiro endereço, será o principal
            };
            setAddresses([...addresses, newAddress]);
            enqueueSnackbar(`Novo endereço adicionado com sucesso!`, { variant: "success", })
        }
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Minha Conta
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <CompanyInfo
                        companyInfo={companyInfo}
                        onEdit={handleEditCompanyInfo}
                    />
                    <Addresses
                        addresses={addresses}
                        onAddAddress={handleAddAddress}
                        onEditAddress={handleEditAddress}
                        onDeleteAddress={handleDeleteAddress}
                        onSetMainAddress={handleSetMainAddress}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Dashboard data={dashboardData} />
                </Grid>
            </Grid>

            <AddressModal
                open={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                address={selectedAddress}
                onSave={handleSaveAddress}
            />
        </Box>
    );
}; 