import { Add, Delete, Edit, Search } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { AddMaterialModal } from '../../components/modals/AddMaterialModal';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';
import { EditMaterialModal } from '../../components/modals/EditMaterialModal';
import { CreateMaterialRequest, Material, materialService, UpdateMaterialRequest } from '../../Services/materialService';

export const MaterialsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await materialService.getAllMaterials();
                setMaterials(data);
            } catch (error) {
                console.error("Failed to fetch materials:", error);
                setError("Erro ao carregar materiais.");
                enqueueSnackbar("Erro ao carregar materiais.", { variant: "error" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterials();
    }, [enqueueSnackbar]);

    const filteredMaterials = materials.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const handleAddMaterial = async (data: CreateMaterialRequest) => {
        try {
            const newMaterial = await materialService.createMaterial(data);
            setMaterials([...materials, newMaterial]);
            enqueueSnackbar('Material adicionado com sucesso!', { variant: 'success' });
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to add material:", error);
            const message = (error as any).response?.data?.message || "Erro ao adicionar material!";
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const handleEditMaterial = async (id: string, data: UpdateMaterialRequest) => {
        try {
            const updatedMaterial = await materialService.updateMaterial(id, data);
            setMaterials(materials.map(material =>
                material.id === id
                    ? updatedMaterial
                    : material
            ));
            enqueueSnackbar('Material atualizado com sucesso!', { variant: 'success' });
            setIsEditModalOpen(false);
            setSelectedMaterial(null);
        } catch (error) {
            console.error("Failed to edit material:", error);
            const message = (error as any).response?.data?.message || "Erro ao atualizar material!";
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const handleDeleteMaterial = async (id: string) => {
        try {
            await materialService.deleteMaterial(id);
            setMaterials(materials.filter(material => material.id !== id));
            enqueueSnackbar('Material removido com sucesso!', { variant: 'success' });
            setIsDeleteModalOpen(false);
            setSelectedMaterial(null);
        } catch (error) {
            console.error("Failed to delete material:", error);
            const message = (error as any).response?.data?.message || "Erro ao remover material!";
            enqueueSnackbar(message, { variant: 'error' });
        }
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

            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : (
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
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '12%' }}>Preço por unidade</TableCell>
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
                                            {Number(material.quantity).toLocaleString('pt-BR')} {material.unit}
                                        </TableCell>
                                        <TableCell sx={{
                                            maxWidth: 0,
                                            whiteSpace: 'normal',
                                            wordWrap: 'break-word'
                                        }}>
                                            {Number(material.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {material.unit}
                                        </TableCell>
                                        <TableCell sx={{
                                            maxWidth: 0,
                                            whiteSpace: 'normal',
                                            wordWrap: 'break-word',
                                            fontWeight: 'bold'
                                        }}>
                                            {(material.quantity * material.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
            )}

            <AddMaterialModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddMaterial as (data: CreateMaterialRequest) => void}
            />

            <EditMaterialModal
                open={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedMaterial(null);
                }}
                material={selectedMaterial}
                onEdit={handleEditMaterial as (id: string, data: UpdateMaterialRequest) => void}
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