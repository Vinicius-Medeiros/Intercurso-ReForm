import { Box, Typography, TextField, List, ListItem, ListItemText, InputAdornment, IconButton, ListItemSecondaryAction, TablePagination, Paper } from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { AddMaterialModal } from '../../components/modals/AddMaterialModal';
import { EditMaterialModal } from '../../components/modals/EditMaterialModal';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';
import { useSnackbar } from 'notistack';

interface Material {
    id: number;
    name: string;
    quantity: number;
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
        { id: 1, name: 'Areia', quantity: 1000 },
        { id: 2, name: 'Cimento', quantity: 500 },
        { id: 3, name: 'Brita', quantity: 750 },
        { id: 4, name: 'Pedra', quantity: 1000 },
        { id: 5, name: 'Tijolo', quantity: 1000 },
        { id: 6, name: 'Tijolo', quantity: 1000 },
        { id: 7, name: 'Tijolo', quantity: 1000 },
        { id: 8, name: 'Tijolo', quantity: 1000 },
        { id: 9, name: 'Tijolo', quantity: 1000 },
        { id: 10, name: 'Tijolo', quantity: 1000 },
    ]);

    const filteredMaterials = materials.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleAddMaterial = (name: string, quantity: number) => {
        const newMaterial: Material = {
            id: materials.length + 1, // Em produção, isso viria do backend
            name,
            quantity
        };
        setMaterials([...materials, newMaterial]);
        enqueueSnackbar('Material adicionado com sucesso!', { variant: 'success' });
    };

    const handleEditMaterial = (id: number, name: string, quantity: number) => {
        setMaterials(materials.map(material =>
            material.id === id ? { ...material, name, quantity } : material
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

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Pesquisar material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
            />

            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                }}
            >
                <Box sx={{boxShadow: "none",}}>
                    <List
                        sx={(theme) => ({
                            maxHeight: 400,
                            overflow: 'auto',
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
                        {paginatedMaterials.map((material) => (
                            <ListItem
                                key={material.id}
                                sx={{
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': {
                                        borderBottom: 'none',
                                    },
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={material.name}
                                    secondary={`Quantidade: ${material.quantity} kg`}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                                <ListItemSecondaryAction>
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
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                        {filteredMaterials.length === 0 && (
                            <ListItem>
                                <ListItemText
                                    primary="Nenhum material encontrado"
                                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                                />
                            </ListItem>
                        )}
                    </List>
                </Box>
                <TablePagination
                    component="div"
                    count={filteredMaterials.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Itens por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
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
                onEdit={handleEditMaterial}
                material={selectedMaterial}
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