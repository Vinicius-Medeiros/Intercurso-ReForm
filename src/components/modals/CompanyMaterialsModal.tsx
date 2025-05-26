import { Close } from '@mui/icons-material';
import { Dialog,
     DialogContent,
     DialogTitle,
     IconButton,
     Paper,
     Table,
     TableBody,
     TableCell,
     TableContainer,
     TableHead,
     TableRow,
     Typography 
} from '@mui/material';
import { Material } from '../../types/Material';

interface CompanyMaterialsModalProps {
    open: boolean;
    onClose: () => void;
    companyName: string;
    materials: Material[];
}

export const CompanyMaterialsModal = ({ open, onClose, companyName, materials }: CompanyMaterialsModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    minHeight: '60vh',
                    maxHeight: '80vh',
                }
            }}
        >
            <DialogTitle sx={{ 
                m: 0, 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                bgcolor: 'primary.main',
                color: 'white'
            }}>
                <Typography variant="h6">
                    Materiais da Empresa: {companyName}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        }
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
                <TableContainer component={Paper} sx={{ maxHeight: 'calc(80vh - 200px)' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '30%' }}>Material</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '20%' }}>Categoria</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>Quantidade</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>Unidade</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '20%' }}>Descrição</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {materials.map((material) => (
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
                                        {material.quantity.toLocaleString('pt-BR')}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {material.unit}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        maxWidth: 0,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word'
                                    }}>
                                        {material.description}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {materials.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                        Nenhum material encontrado para esta empresa
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
}; 