import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { CompanyInfo } from './components/CompanyInfo';
import { Addresses } from './components/Addresses';
import { Dashboard } from './components/Dashboard';
import { AddressModal } from '../../components/modals/AddressModal';
import { useSnackbar } from 'notistack';
import { authService, Company, DashboardData } from '../../Services/auth';

// Remove the local Address interface definition
// interface Address { ... }

// Define AccountAddress type based on backend serialized Address entity (without 'company')
interface AccountAddress {
    id?: string; // ID is present for existing addresses, optional for new ones
    street: string;
    number: string;
    complement?: string; // Optional
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isMain: boolean;
    createdAt?: string; // Dates are likely strings from JSON
    updatedAt?: string; // Dates are likely strings from JSON
}

// Define CompanyInfoType based on backend Company entity structure for display
export type CompanyInfoType = {
    name: string;
    cnpj: string; // CNPJ from backend will be cleaned
    email: string;
    phone: string;
    description: string;
}

export const AccountPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [company, setCompany] = useState<Company | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<AccountAddress | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        totalPurchases: 0,
        totalSpent: 0,
        totalSales: 0,
        activeMaterials: 0,
        lastPurchase: '',
        lastSale: ''
    });
    const { enqueueSnackbar } = useSnackbar();

    // Fetch company data and dashboard data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch both company data and dashboard data in parallel
                const [companyResponse, dashboardResponse] = await Promise.all([
                    authService.getAuthenticatedCompany(),
                    authService.getDashboardData()
                ]);
                
                setCompany(companyResponse.company);
                setDashboardData(dashboardResponse.dashboard);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                enqueueSnackbar("Erro ao carregar dados.", { variant: "error" });
                setCompany(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [enqueueSnackbar]);

    // Extract company info and addresses from the fetched company object
    const companyInfo: CompanyInfoType = { // Derived state for CompanyInfo component
        name: company?.name || '',
        cnpj: company?.cnpj || '',
        email: company?.email || '',
        phone: company?.phone || '',
        description: company?.description || '',
    };

    // Use AccountAddress type for addresses derived from company object
    const addresses: AccountAddress[] = company?.addresses || []; // Derived state for Addresses component

    const handleEditCompanyInfo = async (updatedInfo: CompanyInfoType) => {
        // Check if data has actually changed before sending update
        if (company && (company.name !== updatedInfo.name || company.email !== updatedInfo.email ||
            company.phone !== updatedInfo.phone || company.description !== updatedInfo.description)) {
            try {
                // Send only the changed fields for company info
                const updatePayload = {
                    name: updatedInfo.name,
                    email: updatedInfo.email,
                    phone: updatedInfo.phone,
                    description: updatedInfo.description,
                    // CNPJ cannot be changed via this endpoint based on backend schema
                };

                // Include current addresses in the update payload to avoid deleting them
                // Note: A more robust approach would be dedicated address endpoints
                const fullUpdatePayload = {
                    ...updatePayload,
                    // Map AccountAddress type to backend expected Partial<Address>,
                    // backend update schema expects a specific structure for addresses array
                    addresses: addresses.map(addr => ({
                        id: addr.id, // Include ID for existing addresses
                        street: addr.street,
                        number: addr.number,
                        complement: addr.complement,
                        neighborhood: addr.neighborhood,
                        city: addr.city,
                        state: addr.state,
                        zipCode: addr.zipCode,
                        isMain: addr.isMain,
                        // createdAt and updatedAt are backend managed, do not send
                    }))
                }

                // Cast to Partial<Company> because updateAuthenticatedCompany expects Partial<Company>
                const response = await authService.updateAuthenticatedCompany(fullUpdatePayload as Partial<Company>);
                setCompany(response.company); // Update local state with fresh data from backend
            enqueueSnackbar(`Informações da empresa atualizadas com sucesso!`, { variant: "success", })
            } catch (error) {
                console.error("Failed to update company info:", error);
                const message = (error as any).response?.data?.message || "Erro ao atualizar informações da empresa!";
                enqueueSnackbar(message, { variant: "error" });
            }
        }
    };

    const handleAddAddress = () => {
        // Use AccountAddress type for the new address object
        setSelectedAddress(null);
        setIsAddressModalOpen(true);
    };

    // Use AccountAddress type for the address parameter
    const handleEditAddress = (address: AccountAddress) => {
        setSelectedAddress(address);
        setIsAddressModalOpen(true);
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!company) return; // Should not happen if data is loaded

        const updatedAddresses = addresses.filter(addr => addr.id !== addressId);

        try {
            // Send the entire updated company object with the modified addresses array
            const response = await authService.updateAuthenticatedCompany({
                ...company,
                addresses: updatedAddresses
            } as Partial<Company>); // Cast to Partial<Company>
            setCompany(response.company); // Update local state with fresh data from backend
            enqueueSnackbar(`Endereço removido com sucesso!`, { variant: "success", })
        } catch (error) {
            console.error("Failed to delete address:", error);
            const message = (error as any).response?.data?.message || "Erro ao remover endereço!";
            enqueueSnackbar(message, { variant: "error" });
        }
    };

    const handleSetMainAddress = async (addressId: string) => {
        if (!company) return; // Should not happen if data is loaded

        // Map over the local addresses array to update the isMain flag
        const updatedAddresses = addresses.map(addr => ({
            ...addr,
            isMain: addr.id === addressId
        }));

        try {
            // Send the entire updated company object with the modified addresses array
            const response = await authService.updateAuthenticatedCompany({
                ...company,
                addresses: updatedAddresses
            } as Partial<Company>); // Cast to Partial<Company>
            setCompany(response.company);
            enqueueSnackbar(`Endereço principal atualizado com sucesso!`, { variant: "success", })
        } catch (error) {
            console.error("Failed to set main address:", error);
            const message = (error as any).response?.data?.message || "Erro ao definir endereço principal!";
            enqueueSnackbar(message, { variant: "error" });
        }
    };

    const handleSaveAddress = async (addressData: Omit<AccountAddress, 'id' | 'isMain' | 'createdAt' | 'updatedAt'>) => {
        if (!company) return; // Should not happen if data is loaded

        let updatedAddresses: AccountAddress[];

        if (selectedAddress) {
            // Editing existing address
            updatedAddresses = addresses.map(addr =>
                addr.id === selectedAddress?.id // Use optional chaining for selectedAddress
                    ? { ...addr, ...addressData }
                    : addr
            );
        } else {
            // Adding new address
            const newAddress: AccountAddress = {
                // No ID for new addresses, backend will generate
                ...addressData,
                isMain: addresses.length === 0 // If it's the first address, it will be main
            };
            updatedAddresses = [...addresses, newAddress];
        }

        try {
            // Send the entire updated company object with the new addresses array
            const response = await authService.updateAuthenticatedCompany({
                ...company,
                addresses: updatedAddresses
            } as Partial<Company>); // Cast to Partial<Company>
            setCompany(response.company); // Update local state with fresh data from backend
            enqueueSnackbar(`Endereço salvo com sucesso!`, { variant: "success", })
        } catch (error) {
            console.error("Failed to save address:", error);
            const message = (error as any).response?.data?.message || "Erro ao salvar endereço!";
            enqueueSnackbar(message, { variant: "error" });
        }
    };

    // Show loading indicator while fetching data
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!company && !isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="error">Erro ao carregar dados da empresa. Tente novamente mais tarde.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Minha Conta
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {/* Pass companyInfo and addresses to child components */}
                    <CompanyInfo
                        companyInfo={companyInfo}
                        onEdit={handleEditCompanyInfo}
                    />
                    <Addresses
                        // Pass addresses with AccountAddress type
                        addresses={addresses.sort((a, b) => {
                            if (a.isMain && !b.isMain) {
                                return -1;
                            }
                            if (!a.isMain && b.isMain) {
                                return 1;
                            }
                            return 0;
                        })}
                        onAddAddress={handleAddAddress}
                        onEditAddress={handleEditAddress}
                        // Pass ID as string for handlers
                        onDeleteAddress={handleDeleteAddress as (id: string) => void}
                        onSetMainAddress={handleSetMainAddress as (id: string) => void}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Dashboard data={dashboardData} />
                </Grid>
            </Grid>

            {/* AddressModal needs to be updated to handle backend interaction */}
            <AddressModal
                open={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                // Pass selectedAddress with AccountAddress type
                address={selectedAddress}
                // onSave handler needs to be updated for backend interaction
                onSave={handleSaveAddress as (data: Omit<AccountAddress, 'id' | 'isMain' | 'createdAt' | 'updatedAt'>) => void}
            />
        </Box>
    );
}; 