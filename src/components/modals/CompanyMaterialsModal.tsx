import { Close, AttachMoney } from '@mui/icons-material';
import { 
    Dialog,
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
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    Box,
    Tooltip,
    styled
} from '@mui/material';
import { Material } from '../../types/Material';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CompanyMaterialsModalProps {
    open: boolean;
    onClose: () => void;
    companyName: string;
    materials: Material[];
    onPurchase: (materialId: number, quantity: number, totalValue: number) => void;
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    marginTop: theme.spacing(2),
    '&:before': {
        display: 'none',
    },
}));

export const CompanyMaterialsModal = ({ open, onClose, companyName, materials, onPurchase }: CompanyMaterialsModalProps) => {
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [quantity, setQuantity] = useState<string>('');
    const [totalValue, setTotalValue] = useState<string>('');
    const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);

    const handlePurchaseClick = (material: Material) => {
        if (selectedMaterial?.id === material.id) {
            setSelectedMaterial(null);
            setQuantity('');
            setTotalValue('');
            setIsAccordionExpanded(false);
        } else {
            setSelectedMaterial(material);
            setQuantity('');
            setTotalValue('');
            setIsAccordionExpanded(true);
        }
    };

    const handleQuantityChange = (newQuantity: string) => {
        setQuantity(newQuantity);
        if (selectedMaterial && newQuantity) {
            const calculatedValue = Number(newQuantity) * selectedMaterial.pricePerKg;
            setTotalValue(calculatedValue.toFixed(2));
        } else {
            setQuantity('');
            setTotalValue('');
        }
    };

    const handleTotalValueChange = (newValue: string) => {
        setTotalValue(newValue);
        if (selectedMaterial && newValue) {
            setTotalValue(newValue);
        } else {
            setTotalValue('');
        }
    };

    const handlePurchase = () => {
        if (selectedMaterial && quantity && totalValue) {
            onPurchase(selectedMaterial.id, Number(quantity), Number(totalValue));
            setSelectedMaterial(null);
            setQuantity('');
            setTotalValue('');
            setIsAccordionExpanded(false);
        }
    };

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
                <Typography variant="h6" fontWeight="400">
                    Materiais da Empresa:{' '}
                    <Typography component="span" variant="h6" fontWeight="bolder" display="inline">
                        {companyName}
                    </Typography>
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.3)'
                        }
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
                <TableContainer
                    component={Paper} 
                    sx={(theme) => ({ 
                        maxHeight: 'calc(80vh - 480px)',
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
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '25%' }}>Material</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>Categoria</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '25%' }}>Descrição</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>Quantidade</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '15%' }}>Preço por kg</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: '5%' }}>Ação</TableCell>
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
                                    <TableCell>
                                        <Tooltip title="Comprar">
                                            <IconButton
                                                onClick={() => handlePurchaseClick(material)}
                                                color={selectedMaterial?.id === material.id ? "warning" : "success"}
                                            >
                                                <AttachMoney />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {materials.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        Nenhum material encontrado para esta empresa
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {selectedMaterial && (
                    <StyledAccordion expanded={isAccordionExpanded} onChange={() => setIsAccordionExpanded(!isAccordionExpanded)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" sx={{ 
                                borderBottom: '2px solid',
                                borderColor: 'secondary.main',
                                pb: 1,
                                width: '100%'
                            }}>
                                Efetuar Compra
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Material"
                                    value={selectedMaterial.name}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    focused
                                />
                                <TextField
                                    label="Categoria"
                                    value={selectedMaterial.category}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    focused
                                />
                                <TextField
                                    label="Descrição"
                                    value={selectedMaterial.description}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    focused
                                />
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        label="Quantidade (kg)"
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                        fullWidth
                                        InputProps={{
                                            inputProps: { min: 0, step: "0.01" }
                                        }}
                                    />
                                    <TextField
                                        label="Valor Total (R$)"
                                        type="number"
                                        value={totalValue}
                                        onChange={(e) => handleTotalValueChange(e.target.value)}
                                        fullWidth
                                        InputProps={{
                                            inputProps: { min: 0, step: "0.01" }
                                        }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                    <Button variant="outlined" onClick={() => {
                                        setSelectedMaterial(null);
                                        setQuantity('');
                                        setTotalValue('');
                                        setIsAccordionExpanded(false);
                                    }}>
                                        Voltar
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="secondary"
                                        onClick={handlePurchase}
                                        disabled={!quantity || !totalValue}
                                    >
                                        Comprar
                                    </Button>

                                </Box>
                            </Box>
                        </AccordionDetails>
                    </StyledAccordion>
                )}
            </DialogContent>
        </Dialog>
    );
}; 