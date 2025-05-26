import { Delete, Edit, MoreVert, Search, Visibility } from '@mui/icons-material';
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
    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { ContractState } from '../../enums/ContractState';

interface Purchase {
    id: number;
    companyName: string;
    cnpj: string;
    material: string;
    quantity: number;
    value: number;
    status: ContractState;
    date: string;
}

export const PurchasesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('todos');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);

    // Dados de exemplo - substituir por dados reais da API
    const [purchases, setPurchases] = useState<Purchase[]>([
        {
            id: 1,
            companyName: 'Construtora ABC',
            cnpj: '12.345.678/0001-90',
            material: 'Areia',
            quantity: 1000,
            value: 150.00,
            status: ContractState.PENDING,
            date: '2025-03-15'
        },
        {
            id: 2,
            companyName: 'Materiais XYZ',
            cnpj: '98.765.432/0001-10',
            material: 'Cimento',
            quantity: 500,
            value: 225.00,
            status: ContractState.ACCEPTED,
            date: '2025-03-14'
        },
        {
            id: 3,
            companyName: 'Construções 123',
            cnpj: '45.678.901/0001-23',
            material: 'Brita',
            quantity: 750,
            value: 187.50,
            status: ContractState.COMPLETED,
            date: '2025-03-13'
        },
        {
            id: 4,
            companyName: 'Construções 456',
            cnpj: '23.456.789/0001-45',
            material: 'Pedra',
            quantity: 1200,
            value: 360.00,
            status: ContractState.REJECTED,
            date: '2025-03-12'
        },
        {
            id: 5,
            companyName: 'Materiais 789',
            cnpj: '34.567.890/0001-56',
            material: 'Tijolo',
            quantity: 2000,
            value: 1600.00,
            status: ContractState.CANCELLED,
            date: '2025-03-11'
        },
        {
            id: 6,
            companyName: 'Construções Delta',
            cnpj: '56.789.012/0001-78',
            material: 'Argamassa',
            quantity: 800,
            value: 320.00,
            status: ContractState.PENDING,
            date: '2025-03-10'
        },
        {
            id: 7,
            companyName: 'Materiais Omega',
            cnpj: '67.890.123/0001-89',
            material: 'Cal',
            quantity: 600,
            value: 180.00,
            status: ContractState.ACCEPTED,
            date: '2025-03-09'
        },
        {
            id: 8,
            companyName: 'Construções Sigma',
            cnpj: '78.901.234/0001-90',
            material: 'Aço',
            quantity: 1500,
            value: 4500.00,
            status: ContractState.COMPLETED,
            date: '2025-03-08'
        },
        {
            id: 9,
            companyName: 'Materiais Beta',
            cnpj: '89.012.345/0001-01',
            material: 'Tinta',
            quantity: 300,
            value: 900.00,
            status: ContractState.REJECTED,
            date: '2025-03-07'
        },
        {
            id: 10,
            companyName: 'Construções Gama',
            cnpj: '90.123.456/0001-12',
            material: 'Vidro',
            quantity: 400,
            value: 1200.00,
            status: ContractState.CANCELLED,
            date: '2025-03-06'
        },
    ]);

    const filteredPurchases = purchases.filter(purchase => {
        const searchTermLower = searchTerm.toLowerCase();
        const formattedCnpj = purchase.cnpj;
        const unformattedCnpj = purchase.cnpj.replace(/\D/g, '');
        const purchaseDate = new Date(purchase.date);

        const startDateNoTime = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
        const endDateNoTime = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
        const purchaseDateNoTime = new Date(purchaseDate.setHours(0, 0, 0, 0));

        const matchesSearch = (
            purchase.companyName.toLowerCase().includes(searchTermLower) ||
            purchase.material.toLowerCase().includes(searchTermLower) ||
            formattedCnpj.includes(searchTerm) ||
            unformattedCnpj.includes(searchTerm.replace(/\D/g, ''))
        );

        const matchesStatus = statusFilter === 'todos' || purchase.status === statusFilter;

        const matchesDate = (!startDateNoTime || purchaseDateNoTime >= startDateNoTime) &&
            (!endDateNoTime || purchaseDateNoTime <= endDateNoTime);

        return matchesSearch && matchesStatus && matchesDate;
    });

    const getStatusColor = (status: ContractState) => {
        switch (status) {
            case ContractState.PENDING:
                return '#FFA726'; // Laranja
            case ContractState.ACCEPTED:
                return '#66BB6A'; // Verde
            case ContractState.COMPLETED:
                return '#42A5F5'; // Azul
            case ContractState.REJECTED:
                return '#EF5350'; // Vermelho
            case ContractState.CANCELLED:
                return '#757575'; // Cinza
            default:
                return '#757575';
        }
    };

    const getStatusLabel = (status: ContractState) => {
        return status;
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

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, purchaseId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedPurchaseId(purchaseId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPurchaseId(null);
    };

    const handleEdit = (id: number) => {
        handleMenuClose();
        console.log('Editar compra:', id);
    };

    const handleDelete = (id: number) => {
        handleMenuClose();
        console.log('Excluir compra:', id);
    };

    const handleViewContract = (id: number) => {
        handleMenuClose();
        console.log('Visualizar contrato:', id);
    };

    const isCancelDisabled = (status: ContractState) => {
        return status === ContractState.COMPLETED ||
            status === ContractState.REJECTED ||
            status === ContractState.CANCELLED;
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
                        <MenuItem value={ContractState.PENDING}>Pendente</MenuItem>
                        <MenuItem value={ContractState.ACCEPTED}>Aprovado</MenuItem>
                        <MenuItem value={ContractState.COMPLETED}>Concluído</MenuItem>
                        <MenuItem value={ContractState.REJECTED}>Negado</MenuItem>
                        <MenuItem value={ContractState.CANCELLED}>Cancelado</MenuItem>
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
                <TableContainer sx={{ maxHeight: 'calc(100vh - 550px)' }}>
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
                                        {purchase.companyName}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {purchase.cnpj}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {purchase.material}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {purchase.quantity.toLocaleString('pt-BR')} kg
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {purchase.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                    <TableCell>
                                        {new Date(purchase.date).toLocaleDateString('pt-BR')}
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
                                            <MenuItem onClick={() => handleEdit(purchase.id)}>
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
        </Box>
    );
}; 