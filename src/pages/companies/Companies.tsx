import { Search, Visibility, Business } from '@mui/icons-material';
import {
    Box,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    CircularProgress
} from '@mui/material';
import { useState, useEffect } from 'react';
import { CompanyMaterialsModal } from '../../components/modals/CompanyMaterialsModal';
import { CompanyDetailsModal } from '../../components/modals/CompanyDetailsModal';
import { useSnackbar } from 'notistack';
import { Company } from '../../Services/auth';
import { companyService } from '../../Services/companyService';

export const CompaniesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCompanyForDetails, setSelectedCompanyForDetails] = useState<Company | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await companyService.getAllCompaniesExcludingAuthenticated();
                setCompanies(data);
            } catch (error) {
                console.error("Failed to fetch companies:", error);
                setError("Erro ao carregar empresas.");
                enqueueSnackbar("Erro ao carregar empresas.", { variant: "error" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanies();
    }, [enqueueSnackbar]);

    const filteredCompanies = companies.filter(company => {
        const searchTermLower = searchTerm.toLowerCase().trim();

        const mainAddress = company.addresses?.find(addr => addr.isMain) || company.addresses?.[0];
        const addressText = mainAddress
            ? `${mainAddress.street}, ${mainAddress.number}${mainAddress.complement ? ' - ' + mainAddress.complement : ''} - ${mainAddress.city}/${mainAddress.state}`
            : '';

        const companyNameLower = company.name.toLowerCase().trim();
        const emailLower = company.email.toLowerCase().trim();
        const cnpjDigitsOnly = company.cnpj.replace(/\D/g, '');
        const phoneDigitsOnly = company.phone.replace(/\D/g, '');
        const addressLower = addressText.toLowerCase().trim();

        const searchTermDigitsOnly = searchTerm.replace(/\D/g, '');

        const matchesName = companyNameLower.includes(searchTermLower);
        const matchesEmail = emailLower.includes(searchTermLower);
        const matchesAddress = addressLower.includes(searchTermLower);
        const matchesCnpj =
            company.cnpj.includes(searchTerm) ||
            (searchTermDigitsOnly !== '' && cnpjDigitsOnly.includes(searchTermDigitsOnly));
        const matchesPhone =
            company.phone.includes(searchTerm) ||
            (searchTermDigitsOnly !== '' && phoneDigitsOnly.includes(searchTermDigitsOnly));

        const matchesMaterial = false;

        return matchesName || matchesEmail || matchesAddress || matchesCnpj || matchesPhone || matchesMaterial;
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

    const handleViewDetails = (company: Company) => {
        setSelectedCompanyForDetails(company);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedCompanyForDetails(null);
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
                    placeholder="Pesquisar por empresa, CNPJ, email, telefone, endereço ou material..."
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

            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer
                        sx={(theme) => ({
                            maxHeight: 'calc(100vh - 300px)',
                            scrollbarColor: `${theme.palette.secondary.light} transparent`,
                            scrollbarWidth: 'thin',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                                background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                borderRadius: '4px',
                                backgroundColor: 'rgba(0,0,0,.9)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,.9)',
                                },
                            },
                        })}
                    >
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
                                {paginatedCompanies.map((company) => {
                                    const mainAddress = company.addresses?.find(addr => addr.isMain) || company.addresses?.[0];
                                    const addressText = mainAddress
                                        ? `${mainAddress.street}, ${mainAddress.number}${mainAddress.complement ? ' - ' + mainAddress.complement : ''} - ${mainAddress.city}/${mainAddress.state}`
                                        : 'N/A';

                                    return (
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
                                                {company.cnpj.replace(
                                                    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                                                    '$1.$2.$3/$4-$5'
                                                )}
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
                                                {addressText}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Visualizar Detalhes">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewDetails(company)}
                                                            sx={{ color: 'primary.main' }}
                                                        >
                                                            <Business fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Visualizar Materiais">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewMaterials(company)}
                                                            sx={{ color: 'info.main' }}
                                                        >
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filteredCompanies.length === 0 && !isLoading && !error && (
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
            )}

            {selectedCompany && (
                <CompanyMaterialsModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    companyName={selectedCompany.name}
                    companyId={selectedCompany.id}
                    materials={selectedCompany.materials || []}
                />
            )}

            {selectedCompanyForDetails && (
                <CompanyDetailsModal
                    open={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
                    company={selectedCompanyForDetails}
                />
            )}
        </Box>
    );
};
