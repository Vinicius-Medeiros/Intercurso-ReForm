import { Delete, Edit, Info, MoreVert, Search, Visibility, Warning } from '@mui/icons-material';
import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    Menu,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from 'date-fns/locale';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { openContractInNewTab } from '../../components/contracts/ContractViewer';
import { CancelPurchaseModal } from '../../components/modals/CancelPurchaseModal';
import { EditPurchaseModal } from '../../components/modals/EditPurchaseModal';
import { ReasonInputModal } from '../../components/modals/ReasonInputModal';
import { Purchase, purchaseService, PurchaseStatus } from '../../Services/purchaseService';

export const PurchasesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('todos');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [purchaseToCancel, setPurchaseToCancel] = useState<Purchase | null>(null);
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
    const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { enqueueSnackbar } = useSnackbar();

    const [purchases, setPurchases] = useState<Purchase[]>([]);

    const fetchPurchases = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await purchaseService.getCompanyPurchases('buyer');
            console.log(data);
            setPurchases(data);
        } catch (error) {
            console.error("Failed to fetch purchases:", error);
            setError("Erro ao carregar compras.");
            enqueueSnackbar("Erro ao carregar compras.", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, [enqueueSnackbar]);

    const filteredPurchases = purchases.filter(purchase => {
        const searchTermLower = searchTerm.toLowerCase().trim();
        const companyNameLower = purchase.seller.name.toLowerCase().trim();
        const cnpjDigitsOnly = purchase.seller.cnpj.replace(/\D/g, '');
        const materialLower = purchase.material.name.toLowerCase().trim();
        const purchaseDate = new Date(purchase.createdAt);

        const startDateNoTime = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
        const endDateNoTime = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
        const purchaseDateNoTime = new Date(purchaseDate.setHours(0, 0, 0, 0));

        const matchesSearch = (
            companyNameLower.includes(searchTermLower) ||
            materialLower.includes(searchTermLower) ||
            purchase.seller.cnpj.includes(searchTerm) ||
            (searchTerm.replace(/\D/g, '') !== '' && cnpjDigitsOnly.includes(searchTerm.replace(/\D/g, '')))
        );

        const matchesStatus = statusFilter === 'todos' || purchase.status === statusFilter;

        const matchesDate = (!startDateNoTime || purchaseDateNoTime >= startDateNoTime) &&
            (!endDateNoTime || purchaseDateNoTime <= endDateNoTime);

        return matchesSearch && matchesStatus && matchesDate;
    });

    const getStatusColor = (status: PurchaseStatus) => {
        switch (status) {
            case PurchaseStatus.PENDING:
                return '#FFA726'; // Laranja
            case PurchaseStatus.APPROVED:
                return '#66BB6A'; // Verde
            case PurchaseStatus.COMPLETED:
                return '#42A5F5'; // Azul
            case PurchaseStatus.DENIED:
                return '#EF5350'; // Vermelho
            case PurchaseStatus.CANCELLED:
                return '#757575'; // Cinza
            default:
                return '#757575';
        }
    };

    const getStatusLabel = (status: PurchaseStatus) => {
        switch (status) {
            case PurchaseStatus.PENDING:
                return 'PENDENTE'; // Laranja
            case PurchaseStatus.APPROVED:
                return 'APROVADA'; // Verde
            case PurchaseStatus.COMPLETED:
                return 'CONCLUÍDA'; // Azul
            case PurchaseStatus.DENIED:
                return 'NEGADA'; // Vermelho
            case PurchaseStatus.CANCELLED:
                return 'CANCELADA'; // Cinza
            default:
                return 'DESCONHECIDO';
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedPurchases = filteredPurchases.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, purchaseId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedPurchaseId(purchaseId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPurchaseId(null);
    };

    const handleEdit = (id: string) => {
        handleMenuClose();
        const purchase = purchases.find(p => p.id === id);
        if (purchase) {
            setSelectedPurchase(purchase);
            setIsEditModalOpen(true);
        }
    };

    const handleDelete = (id: string) => {
        handleMenuClose();
        const purchase = purchases.find(p => p.id === id);
        if (purchase) {
            setPurchaseToCancel(purchase);
            setIsCancelModalOpen(true);
        }
    };

    const handleViewContract = async (id: string) => {
        handleMenuClose();
        const purchase = purchases.find(p => p.id === id);
        if (purchase) {
            await openContractInNewTab({
                type: 'purchase',
                purchase: purchase
            });
        }
    };

    const isCancelDisabled = (status: PurchaseStatus) => {
        return status === PurchaseStatus.COMPLETED ||
            status === PurchaseStatus.DENIED ||
            status === PurchaseStatus.CANCELLED;
    };

    const handleUpdatePurchase = async (id: string, quantity: number, totalValue: number) => {
        try {
            // Call the backend API to update the purchase
            await purchaseService.updatePurchase(id, { quantity: Number(quantity), totalValue });
            enqueueSnackbar('Compra atualizada com sucesso!', { variant: 'success' });
            // Refetch purchases to update the list
            fetchPurchases();
        } catch (error) {
            console.error("Failed to update purchase:", error);
            enqueueSnackbar('Erro ao atualizar compra.', { variant: 'error' });
        }
    };

    const handleConfirmCancelModal = (id: string) => {
        setIsCancelModalOpen(false);
        setPendingCancelId(id);
        setIsReasonModalOpen(true);
    };

    const handleReasonConfirm = async (reason: string) => {
        if (pendingCancelId) {
            await handleConfirmCancel(pendingCancelId, reason);
            setPendingCancelId(null);
        }
        setIsReasonModalOpen(false);
        setPurchaseToCancel(null);
    };

    const handleConfirmCancel = async (id: string, reason: string) => {
        try {
            await purchaseService.cancelPurchase(id, reason);
            enqueueSnackbar('Compra cancelada com sucesso!', { variant: 'success' });
            fetchPurchases();
        } catch (error) {
            console.error("Failed to cancel purchase:", error);
            enqueueSnackbar('Erro ao cancelar compra.', { variant: 'error' });
        }
    };

    const isPriceDifferent = (purchase: Purchase) => {
        return Number(purchase.totalValue) != Number((purchase.quantity * purchase.unitPrice).toFixed(2));
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Compras
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Pesquisar por empresa ou material..."
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
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(0);
                        }}
                    >
                        <MenuItem value="todos">Todos</MenuItem>
                        <MenuItem value={PurchaseStatus.PENDING}>Pendente</MenuItem>
                        <MenuItem value={PurchaseStatus.APPROVED}>Aprovado</MenuItem>
                        <MenuItem value={PurchaseStatus.COMPLETED}>Concluído</MenuItem>
                        <MenuItem value={PurchaseStatus.DENIED}>Negado</MenuItem>
                        <MenuItem value={PurchaseStatus.CANCELLED}>Cancelado</MenuItem>
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                    <DatePicker
                        label="Data Inicial"
                        value={startDate}
                        onChange={(newValue: Date | null) => {
                            setStartDate(newValue);
                            setPage(0);
                        }}
                        slotProps={{
                            textField: {
                                variant: 'outlined',
                                sx: { minWidth: 200 }
                            }
                        }}
                    />
                    <DatePicker
                        label="Data Final"
                        value={endDate}
                        onChange={(newValue: Date | null) => {
                            setEndDate(newValue);
                            setPage(0);
                        }}
                        slotProps={{
                            textField: {
                                variant: 'outlined',
                                sx: { minWidth: 200 }
                            }
                        }}
                    />
                </LocalizationProvider>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer
                    sx={(theme) => ({
                        maxHeight: 'calc(100vh - 550px)',
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
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>Material</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '10%' }}>Quantidade</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '10%' }}>Valor</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '10%' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '10%' }}>Data</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '5%' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedPurchases.map((purchase) => (
                                <TableRow
                                    key={purchase.id}
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
                                        {purchase.seller.name}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {purchase.seller.cnpj.replace(
                                            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                                            '$1.$2.$3/$4-$5'
                                        )}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {purchase.material.name}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {Number(purchase.quantity).toLocaleString('pt-BR')} {purchase.material.unit}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'regular' }}>
                                            {Number(purchase.totalValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            {isPriceDifferent(purchase) && (
                                                <Tooltip title="Valor diferente do estabelecido por kg">
                                                    <Warning sx={{ color: 'warning.main' }} />
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ display: 'flex', alignItems: 'center', fontWeight: 'regular' }}>
                                        <Box
                                            sx={{
                                                display: 'inline-block',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                bgcolor: getStatusColor(purchase.status),
                                                color: 'white',
                                                fontWeight: 500,
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            {getStatusLabel(purchase.status)}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'regular' }}>
                                            {(purchase.denialReason != null || purchase.cancellationReason != null) && (
                                                <Tooltip title={purchase.denialReason != null ? purchase.denialReason : purchase.cancellationReason}>
                                                    <Info sx={{ color: '#228BE6' }} />
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(purchase.createdAt).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, purchase.id)}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <MoreVert fontSize="small" />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl) && selectedPurchaseId === purchase.id}
                                            onClose={handleMenuClose}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            sx={(theme) => ({
                                                '& .MuiPaper-root': {
                                                    mt: 0.65,
                                                    ml: 4,
                                                    bgcolor: 'secondary.dark',
                                                    color: 'white',
                                                    overflow: 'visible',
                                                    '& .MuiMenuItem-root': {
                                                        '&:hover': {
                                                            bgcolor: 'secondary.main'
                                                        }
                                                    },
                                                    '&::before, &::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        display: 'block',
                                                        width: 0,
                                                        height: 0,
                                                        left: '-9px',
                                                    },
                                                    '&::before': {
                                                        top: '0px',
                                                        borderTop: '12px solid transparent',
                                                        borderBottom: '12px solid transparent',
                                                        borderRight: '12px solid rgba(0,0,0,0.12)',
                                                    },
                                                    '&::after': {
                                                        top: '0px',
                                                        borderTop: '10px solid transparent',
                                                        borderBottom: '10px solid transparent',
                                                        borderRight: `10px solid ${theme.palette.secondary.dark}`,
                                                    }
                                                }
                                            })}
                                        >
                                            <MenuItem
                                                onClick={() => handleEdit(purchase.id)}
                                                disabled={isCancelDisabled(purchase.status) || purchase.status === PurchaseStatus.APPROVED}
                                            >
                                                <Edit fontSize="small" sx={{ mr: 1 }} />
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => handleDelete(purchase.id)}
                                                disabled={isCancelDisabled(purchase.status)}
                                            >
                                                <Delete fontSize="small" sx={{ mr: 1 }} />
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem onClick={() => handleViewContract(purchase.id)}>
                                                <Visibility fontSize="small" sx={{ mr: 1 }} />
                                                Visualizar Contrato
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredPurchases.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                        Nenhuma compra encontrada
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredPurchases.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Compras por página:"
                    labelDisplayedRows={({ from, to, count }) => `Página: ${from} / ${to} de ${count}`}
                />
            </Paper>

            {selectedPurchase && (
                <EditPurchaseModal
                    open={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedPurchase(null);
                    }}
                    purchase={selectedPurchase}
                    onUpdate={handleUpdatePurchase}
                />
            )}

            {purchaseToCancel && (
                <CancelPurchaseModal
                    open={isCancelModalOpen}
                    onClose={() => {
                        setIsCancelModalOpen(false);
                        setPurchaseToCancel(null);
                    }}
                    purchase={purchaseToCancel}
                    onConfirm={() => handleConfirmCancelModal(purchaseToCancel.id)}
                />
            )}

            <ReasonInputModal
                open={isReasonModalOpen}
                onClose={() => {
                    setIsReasonModalOpen(false);
                    setPendingCancelId(null);
                }}
                title="Motivo do Cancelamento"
                description="Por favor, informe o motivo do cancelamento da compra."
                onConfirm={handleReasonConfirm}
            />
        </Box>
    );
}; 