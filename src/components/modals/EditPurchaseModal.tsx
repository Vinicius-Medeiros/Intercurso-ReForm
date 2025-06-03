import { Box, Dialog, DialogTitle, DialogContent, IconButton, Typography, TextField, DialogActions, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Purchase, PurchaseStatus } from '../../Services/purchaseService';

interface EditPurchaseModalProps {
    open: boolean;
    onClose: () => void;
    purchase: Purchase;
    onUpdate: (id: string, quantity: number, totalValue: number) => void;
}

export const EditPurchaseModal = ({ open, onClose, purchase, onUpdate }: EditPurchaseModalProps) => {
    const [quantity, setQuantity] = useState(purchase.quantity);
    const [totalValue, setTotalValue] = useState(purchase.totalValue);
    const [quantityError, setQuantityError] = useState('');
    const [valueError, setValueError] = useState('');

    useEffect(() => {
        setQuantity(purchase.quantity);
        setTotalValue(purchase.totalValue);
        setQuantityError('');
        setValueError('');
    }, [purchase]);

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setQuantity(newValue);
        if (newValue <= 0) {
            setQuantityError('A quantidade deve ser maior que zero');
        } else {
            setQuantityError('');
        }
    };

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setTotalValue(newValue);
        if (newValue <= 0) {
            setValueError('O valor deve ser maior que zero');
        } else {
            setValueError('');
        }
    };

    const handleUpdate = () => {
        if (quantity <= 0 || totalValue <= 0) {
            return;
        }
        onUpdate(purchase.id, quantity, totalValue);
        onClose();
    };

    const isFormValid = quantity > 0 && totalValue > 0;

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

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    minHeight: '40vh',
                    maxHeight: '60vh',
                }
            }}
        >
            <DialogTitle sx={{ 
                m: 0, 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                bgcolor: 'secondary.light',
                color: 'white'
            }}>
                <Typography variant="h6" fontWeight="400">
                    Alterar compra de:{' '}
                    <Typography component="span" variant="h6" fontWeight="bolder" display="inline">
                        {purchase.material.name}
                    </Typography>
                    {' '}da empresa{' '}
                    <Typography component="span" variant="h6" fontWeight="bolder" display="inline">
                        {purchase.seller.name}
                    </Typography>
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'secondary.dark',
                        }
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Quantidade"
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        error={!!quantityError}
                        helperText={quantityError}
                        InputProps={{
                            endAdornment: <Typography>{purchase.material.unit || 'kg'}</Typography>
                        }}
                        fullWidth
                    />
                    <TextField
                        label="Valor Total"
                        type="number"
                        value={totalValue}
                        onChange={handleValueChange}
                        error={!!valueError}
                        helperText={valueError}
                        InputProps={{
                            startAdornment: <Typography>R$</Typography>
                        }}
                        fullWidth
                    />
                    <TextField
                        label="Status da Compra"
                        type="string"
                        value={getStatusLabel(purchase.status)}
                        variant="outlined"
                        fullWidth
                        focused
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                pointerEvents: 'none',
                                '& fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(0, 0, 0, 0.6)',
                            },
                            '& .MuiInputBase-input': {
                                color: 'rgba(0, 0, 0, 0.87)',
                                cursor: 'default',
                            },
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleUpdate}
                    variant="contained"
                    color="secondary"
                    disabled={!isFormValid}
                >
                    Atualizar
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 