import { Delete, Edit, MoreVert, Search, Visibility, Warning } from '@mui/icons-material';
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
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { ReasonInputModal } from '../../components/modals/ReasonInputModal';
import { Sale, saleService, SaleStatus } from '../../Services/saleService';

export const SalesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('todos');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
    const [sales, setSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
        color?: string;
    } | null>(null);
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
    const [pendingDenyId, setPendingDenyId] = useState<string | null>(null);
    const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    const fetchSales = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await saleService.getCompanySales('seller');
            setSales(data);
        } catch (error) {
            console.error("Failed to fetch sales:", error);
            setError("Erro ao carregar vendas.");
            enqueueSnackbar("Erro ao carregar vendas.", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [enqueueSnackbar]);

    const filteredSales = sales.filter(sale => {
        const searchTermLower = searchTerm.toLowerCase().trim();
        const companyNameLower = sale.buyer.name.toLowerCase().trim();
        const cnpjDigitsOnly = sale.buyer.cnpj.replace(/\D/g, '');
        const materialLower = sale.material.name.toLowerCase().trim();
        const saleDate = new Date(sale.createdAt);

        const startDateNoTime = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
        const endDateNoTime = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
        const saleDateNoTime = new Date(saleDate.setHours(0, 0, 0, 0));

        const matchesSearch = (
            companyNameLower.includes(searchTermLower) ||
            materialLower.includes(searchTermLower) ||
            sale.buyer.cnpj.includes(searchTerm) ||
            (searchTerm.replace(/\D/g, '') !== '' && cnpjDigitsOnly.includes(searchTerm.replace(/\D/g, '')))
        );

        const matchesStatus = statusFilter === 'todos' || sale.status === statusFilter;

        const matchesDate = (!startDateNoTime || saleDateNoTime >= startDateNoTime) &&
            (!endDateNoTime || saleDateNoTime <= endDateNoTime);

        return matchesSearch && matchesStatus && matchesDate;
    });

    const getStatusColor = (status: SaleStatus) => {
        switch (status) {
            case SaleStatus.PENDING:
                return '#FFA726';
            case SaleStatus.APPROVED:
                return '#66BB6A';
            case SaleStatus.COMPLETED:
                return '#42A5F5';
            case SaleStatus.DENIED:
                return '#EF5350';
            case SaleStatus.CANCELLED:
                return '#757575';
            default:
                return '#757575';
        }
    };

    const getStatusLabel = (status: SaleStatus) => {
        switch (status) {
            case SaleStatus.PENDING:
                return 'PENDENTE'; // Laranja
            case SaleStatus.APPROVED:
                return 'APROVADA'; // Verde
            case SaleStatus.COMPLETED:
                return 'CONCLUÍDA'; // Azul
            case SaleStatus.DENIED:
                return 'NEGADA'; // Vermelho
            case SaleStatus.CANCELLED:
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

    const paginatedSales = filteredSales.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, saleId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedSaleId(saleId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSaleId(null);
    };

    const handleAction = (action: SaleStatus, saleId: string) => {
        handleMenuClose();
        const sale = sales.find(s => s.id === saleId);
        if (!sale) return;

        let title = '';
        let description = '';
        let onConfirm: () => void = () => {};
        let color = '';

        switch (action) {
            case SaleStatus.APPROVED:
                title = 'Confirmar Aprovação';
                description = `Tem certeza que deseja aprovar a proposta de venda de ${sale.material.name} para ${sale.buyer.name}?`;
                onConfirm = async () => {
                    try {
                        await saleService.approveSale(saleId);
                        enqueueSnackbar('Proposta aprovada com sucesso!', { variant: 'success' });
                        fetchSales();
                    } catch (error) {
                        console.error("Failed to approve sale:", error);
                        enqueueSnackbar('Erro ao aprovar proposta.', { variant: 'error' });
                    }
                    setConfirmModal(null);
                };
                color = '#66BB6A';
                break;
            case SaleStatus.DENIED:
                title = 'Confirmar Negação';
                description = `Tem certeza que deseja negar a proposta de venda de ${sale.material.name} para ${sale.buyer.name}?`;
                onConfirm = () => {
                    setConfirmModal(null);
                    setPendingDenyId(saleId);
                    setIsReasonModalOpen(true);
                };
                color = '#EF5350';
                break;
            case SaleStatus.CANCELLED:
                title = 'Confirmar Cancelamento';
                description = `Tem certeza que deseja cancelar a proposta de venda de ${sale.material.name} para ${sale.buyer.name}?`;
                onConfirm = () => {
                    setConfirmModal(null);
                    setPendingCancelId(saleId);
                    setIsReasonModalOpen(true);
                };
                color = '#757575';
                break;
            case SaleStatus.COMPLETED:
                title = 'Confirmar Conclusão';
                description = `Tem certeza que deseja marcar como concluída a proposta de venda de ${sale.material.name} para ${sale.buyer.name}? Esta ação não pode ser desfeita.`;
                onConfirm = async () => {
                    try {
                        await saleService.completeSale(saleId);
                        enqueueSnackbar('Proposta concluída com sucesso!', { variant: 'success' });
                        fetchSales();
                    } catch (error) {
                        console.error("Failed to complete sale:", error);
                        enqueueSnackbar('Erro ao concluir proposta.', { variant: 'error' });
                    }
                    setConfirmModal(null);
                };
                color = '#42A5F5';
                break;
        }

        setConfirmModal({
            open: true,
            title,
            description,
            onConfirm,
            color
        });
    };

    const handleViewContract = async (sale: Sale) => {
        handleMenuClose();
        await openContractInNewTab({
            type: 'sale',
            sale: sale
        });
    };

    const isActionDisabled = (status: SaleStatus, action: SaleStatus) => {
        switch (action) {
            case SaleStatus.APPROVED:
            case SaleStatus.DENIED:
                return status !== SaleStatus.PENDING;
            case SaleStatus.CANCELLED:
                return status !== SaleStatus.APPROVED && status !== SaleStatus.PENDING;
            case SaleStatus.COMPLETED:
                return status !== SaleStatus.APPROVED;
            default:
                return true;
        }
    };

    const isPriceDifferent = (sale: Sale) => {
        return Number(sale.totalValue) != Number((sale.quantity * sale.unitPrice).toFixed(2));
    };

    const handleReasonConfirm = async (reason: string) => {
        if (pendingDenyId) {
            try {
                await saleService.rejectSale(pendingDenyId, reason);
                enqueueSnackbar('Proposta negada com sucesso!', { variant: 'success' });
                fetchSales();
            } catch (error) {
                console.error("Failed to deny sale:", error);
                enqueueSnackbar('Erro ao negar proposta.', { variant: 'error' });
            }
            setPendingDenyId(null);
        } else if (pendingCancelId) {
            try {
                await saleService.cancelSale(pendingCancelId, reason);
                enqueueSnackbar('Proposta cancelada com sucesso!', { variant: 'success' });
                fetchSales();
            } catch (error) {
                console.error("Failed to cancel sale:", error);
                enqueueSnackbar('Erro ao cancelar proposta.', { variant: 'error' });
            }
            setPendingCancelId(null);
        }
        setIsReasonModalOpen(false);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                Vendas
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
                        <MenuItem value={SaleStatus.PENDING}>Pendente</MenuItem>
                        <MenuItem value={SaleStatus.APPROVED}>Aprovado</MenuItem>
                        <MenuItem value={SaleStatus.COMPLETED}>Concluído</MenuItem>
                        <MenuItem value={SaleStatus.DENIED}>Negado</MenuItem>
                        <MenuItem value={SaleStatus.CANCELLED}>Cancelado</MenuItem>
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
                            {paginatedSales.map((sale) => (
                                <TableRow
                                    key={sale.id}
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
                                        {sale.buyer.name}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {sale.buyer.cnpj.replace(
                                            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                                            '$1.$2.$3/$4-$5'
                                        )}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {sale.material.name}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {Number(sale.quantity).toLocaleString('pt-BR')} {sale.material.unit}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'regular' }}>
                                            {Number(sale.totalValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            {isPriceDifferent(sale) && (
                                                <Tooltip title="Valor diferente do estabelecido por kg">
                                                    <Warning sx={{ color: 'warning.main' }} />
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: 'inline-block',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                bgcolor: getStatusColor(sale.status),
                                                color: 'white',
                                                fontWeight: 500,
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            {getStatusLabel(sale.status)}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, sale.id)}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <MoreVert fontSize="small" />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl) && selectedSaleId === sale.id}
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
                                                onClick={() => handleAction(SaleStatus.APPROVED, sale.id)}
                                                disabled={isActionDisabled(sale.status, SaleStatus.APPROVED)}
                                            >
                                                <Edit fontSize="small" sx={{ mr: 1 }} />
                                                Aprovar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => handleAction(SaleStatus.DENIED, sale.id)}
                                                disabled={isActionDisabled(sale.status, SaleStatus.DENIED)}
                                            >
                                                <Delete fontSize="small" sx={{ mr: 1 }} />
                                                Negar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => handleAction(SaleStatus.CANCELLED, sale.id)}
                                                disabled={isActionDisabled(sale.status, SaleStatus.CANCELLED)}
                                            >
                                                <Delete fontSize="small" sx={{ mr: 1 }} />
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => handleAction(SaleStatus.COMPLETED, sale.id)}
                                                disabled={isActionDisabled(sale.status, SaleStatus.COMPLETED)}
                                            >
                                                <Edit fontSize="small" sx={{ mr: 1 }} />
                                                Concluir
                                            </MenuItem>
                                            <MenuItem onClick={() => handleViewContract(sale)}>
                                                <Visibility fontSize="small" sx={{ mr: 1 }} />
                                                Visualizar Contrato
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredSales.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                        Nenhuma venda encontrada
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredSales.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Vendas por página:"
                    labelDisplayedRows={({ from, to, count }) => `Página: ${from} / ${to} de ${count}`}
                />
            </Paper>

            <ConfirmModal
                open={confirmModal?.open || false}
                onClose={() => setConfirmModal(null)}
                onConfirm={confirmModal?.onConfirm || (() => {})}
                title={confirmModal?.title || ''}
                message={confirmModal?.description || ''}
                confirmText="Confirmar"
                cancelText="Cancelar"
                color={confirmModal?.color}
            />

            <ReasonInputModal
                open={isReasonModalOpen}
                onClose={() => {
                    setIsReasonModalOpen(false);
                    setPendingDenyId(null);
                    setPendingCancelId(null);
                }}
                title={pendingDenyId ? "Motivo da Negação" : "Motivo do Cancelamento"}
                description={pendingDenyId ? "Por favor, informe o motivo da negação da proposta." : "Por favor, informe o motivo do cancelamento da proposta."}
                onConfirm={handleReasonConfirm}
            />
        </Box>
    );
}; 