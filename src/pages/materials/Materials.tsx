import { Box, Typography, TextField, List, ListItem, ListItemText, InputAdornment, IconButton, ListItemSecondaryAction, TablePagination, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { AddMaterialModal } from '../../components/modals/AddMaterialModal';
import { EditMaterialModal } from '../../components/modals/EditMaterialModal';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';
import { useSnackbar } from 'notistack';

export interface Material {
    id: number;
    name: string;
    category: string;
    description: string;
    quantity: number;
    pricePerKg: number;
}

export const MaterialsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { enqueueSnackbar } = useSnackbar();

    // Dados de exemplo - substituir por dados reais da API
    const [materials, setMaterials] = useState<Material[]>([
        {
            id: 1,
            name: 'Areia',
            category: 'Agregados',
            description: 'Areia média para construção civil, ideal para assentamento de tijolos e revestimentos.',
            quantity: 1000,
            pricePerKg: 0.15
        },
        {
            id: 2,
            name: 'Cimento',
            category: 'Cimentos',
            description: 'Cimento Portland CP-II-32, indicado para estruturas de concreto em geral.',
            quantity: 500,
            pricePerKg: 0.45
        },
        {
            id: 3,
            name: 'Brita',
            category: 'Agregados',
            description: 'Brita 1, pedra britada para concreto e pavimentação.',
            quantity: 750,
            pricePerKg: 0.25
        },
        {
            id: 4,
            name: 'Tijolo',
            category: 'Alvenaria',
            description: 'Tijolo cerâmico 9x19x19cm, para alvenaria estrutural.',
            quantity: 2000,
            pricePerKg: 0.80
        },
        {
            id: 5,
            name: 'Aço',
            category: 'Aços',
            description: 'Aço CA-50, barras de aço para armadura de concreto.',
            quantity: 1500,
            pricePerKg: 3.00
        }
    ]);

    const filteredMaterials = materials.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginação
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedMaterials = filteredMaterials.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleAddMaterial = (name: string, category: string, description: string, quantity: number, pricePerKg: number) => {
        const newMaterial: Material = {
            id: materials.length + 1,
            name,
            category,
            description,
            quantity,
            pricePerKg,
        };
        setMaterials([...materials, newMaterial]);
        enqueueSnackbar('Material adicionado com sucesso!', { variant: 'success' });
    };

    const handleEditMaterial = (id: number, name: string, category: string, description: string, quantity: number, pricePerKg: number) => {
        setMaterials(materials.map(material => 
            material.id === id 
                ? { ...material, name, category, description, quantity, pricePerKg }
                : material
        ));
        enqueueSnackbar('Material atualizado com sucesso!', { variant: 'success' });
    };

    const handleDeleteMaterial = (id: number) => {
        setMaterials(materials.filter(material => material.id !== id));
        setIsDeleteModalOpen(false);
        setSelectedMaterial(null);
        enqueueSnackbar('Material removido com sucesso!', { variant: 'success' });
    };

    const openEditModal = (material: Material) => {
        setSelectedMaterial(material);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (material: Material) => {
        setSelectedMaterial(material);
        setIsDeleteModalOpen(true);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Materiais
                </Typography>
                <IconButton
                    color="primary"
                    onClick={() => setIsAddModalOpen(true)}
                    sx={{
                        bgcolor: 'secondary.main',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'secondary.dark',
                        }
                    }}
                >
                    <Add />
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Pesquisar por nome, categoria ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                }}
            >
                <TableContainer sx={(theme) => ({
                    maxHeight: 'calc(100vh - 520px)',
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
                })}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>Categoria</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '25%' }}>Descrição</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '12%' }}>Quantidade</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '12%' }}>Preço por kg</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '12%' }}>Total</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '9%' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedMaterials.map((material) => (
                                <TableRow
                                    key={material.id}
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
                                        {material.name}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {material.category}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {material.description}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {material.quantity.toLocaleString('pt-BR')} kg
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {material.pricePerKg.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                        fontWeight: 'bold'
                                    }}>
                                        {(material.quantity * material.pricePerKg).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            edge="end"
                                            onClick={() => openEditModal(material)}
                                            sx={{ mr: 1 }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={() => openDeleteModal(material)}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredMaterials.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Materiais por página:"
                    labelDisplayedRows={({ from, to, count }) => `Página: ${from} / ${to} de ${count}`}
                />
            </Paper>

            <AddMaterialModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddMaterial}
            />

            <EditMaterialModal
                open={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedMaterial(null);
                }}
                material={selectedMaterial}
                onEdit={handleEditMaterial}
            />

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedMaterial(null);
                }}
                onConfirm={() => selectedMaterial && handleDeleteMaterial(selectedMaterial.id)}
                materialName={selectedMaterial?.name || ''}
            />
        </Box>
    );
}; 