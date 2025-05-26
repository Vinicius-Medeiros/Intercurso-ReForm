import { Box, Typography, TextField, InputAdornment, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Tooltip } from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';
import { useState } from 'react';
import { CompanyMaterialsModal } from '../../components/modals/CompanyMaterialsModal';
import { Material } from '../../types/Material';

interface Company {
    id: number;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    address: string;
}

export const CompaniesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dados de exemplo - substituir por dados reais da API
    const [companies, setCompanies] = useState<Company[]>([
        {
            id: 1,
            name: 'Construtora ABC',
            cnpj: '12.345.678/0001-90',
            email: 'contato@construtoraabc.com.br',
            phone: '(85) 3333-4444',
            address: 'Rua das Construções, 123 - Fortaleza/CE'
        },
        {
            id: 2,
            name: 'Materiais XYZ',
            cnpj: '98.765.432/0001-10',
            email: 'vendas@materiaisxyz.com.br',
            phone: '(85) 4444-5555',
            address: 'Av. dos Materiais, 456 - Fortaleza/CE'
        },
        {
            id: 3,
            name: 'Construções 123',
            cnpj: '45.678.901/0001-23',
            email: 'contato@construcoes123.com.br',
            phone: '(85) 5555-6666',
            address: 'Rua das Obras, 789 - Fortaleza/CE'
        },
        {
            id: 4,
            name: 'Construções 456',
            cnpj: '23.456.789/0001-45',
            email: 'vendas@construcoes456.com.br',
            phone: '(85) 6666-7777',
            address: 'Av. das Construções, 321 - Fortaleza/CE'
        },
        {
            id: 5,
            name: 'Materiais 789',
            cnpj: '34.567.890/0001-56',
            email: 'contato@materiais789.com.br',
            phone: '(85) 7777-8888',
            address: 'Rua dos Materiais, 654 - Fortaleza/CE'
        }
    ]);

    // Dados de exemplo para materiais - substituir por dados reais da API
    const [companyMaterials] = useState<Record<number, Material[]>>({
        1: [
            {
                id: 1,
                name: 'Cimento',
                category: 'Construção',
                quantity: 1000,
                unit: 'kg',
                description: 'Cimento Portland CP-II-32'
            },
            {
                id: 2,
                name: 'Areia',
                category: 'Construção',
                quantity: 5000,
                unit: 'kg',
                description: 'Areia média lavada'
            }
        ],
        2: [
            {
                id: 3,
                name: 'Tijolo',
                category: 'Alvenaria',
                quantity: 2000,
                unit: 'un',
                description: 'Tijolo cerâmico 9x19x19'
            }
        ]
    });

    const filteredCompanies = companies.filter(company => {
        const searchTermLower = searchTerm.toLowerCase().trim();
        const formattedCnpj = company.cnpj;
        const unformattedCnpj = company.cnpj.replace(/\D/g, '');
        const formattedPhone = company.phone;
        const unformattedPhone = company.phone.replace(/\D/g, '');
        const companyNameLower = company.name.toLowerCase().trim();
        const emailLower = company.email.toLowerCase().trim();
        const addressLower = company.address.toLowerCase().trim();

        const matchesName = companyNameLower.includes(searchTermLower);
        const matchesEmail = emailLower.includes(searchTermLower);
        const matchesAddress = addressLower.includes(searchTermLower);
        const matchesCnpj = formattedCnpj.includes(searchTerm) || unformattedCnpj.includes(searchTerm.replace(/\D/g, ''));
        const matchesPhone = formattedPhone.includes(searchTerm) || unformattedPhone.includes(searchTerm.replace(/\D/g, ''));

        return matchesName || matchesEmail || matchesAddress || matchesCnpj || matchesPhone;
    });

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewMaterials = (company: Company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCompany(null);
    };

    const paginatedCompanies = filteredCompanies.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Empresas
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Pesquisar por empresa, CNPJ, email, telefone ou endereço..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(0);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '25%' }}>Empresa</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>CNPJ</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '20%' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>Telefone</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '20%' }}>Endereço</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '5%' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedCompanies.map((company) => (
                                <TableRow
                                    key={company.id}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                        },
                                    }}
                                >
                                    <TableCell sx={{ 
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {company.name}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {company.cnpj}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {company.email}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {company.phone}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {company.address}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Visualizar Materiais">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewMaterials(company)}
                                                sx={{ color: 'info.main' }}
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredCompanies.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        Nenhuma empresa encontrada
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredCompanies.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Empresas por página:"
                    labelDisplayedRows={({ from, to, count }) => `Página: ${from} / ${to} de ${count}`}
                />
            </Paper>

            {selectedCompany && (
                <CompanyMaterialsModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    companyName={selectedCompany.name}
                    materials={companyMaterials[selectedCompany.id] || []}
                />
            )}
        </Box>
    );
};
