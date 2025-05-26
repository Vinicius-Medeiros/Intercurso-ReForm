import { Box, Dialog, DialogTitle, DialogContent, IconButton, Typography, TextField, DialogActions, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState } from 'react';
import { Purchase } from '../../pages/purchases/Purchases';

interface EditPurchaseModalProps {
    open: boolean;
    onClose: () => void;
    purchase: Purchase
    onUpdate: (id: number, quantity: number, value: number) => void;
}

export const EditPurchaseModal = ({ open, onClose, purchase, onUpdate }: EditPurchaseModalProps) => {
    const [quantity, setQuantity] = useState(purchase.quantity);
    const [value, setValue] = useState(purchase.value);
    const [quantityError, setQuantityError] = useState('');
    const [valueError, setValueError] = useState('');

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
        setValue(newValue);
        if (newValue <= 0) {
            setValueError('O valor deve ser maior que zero');
        } else {
            setValueError('');
        }
    };

    const handleUpdate = () => {
        if (quantity <= 0 || value <= 0) {
            return;
        }
        onUpdate(purchase.id, quantity, value);
        onClose();
    };

    const isFormValid = quantity > 0 && value > 0;

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
                        {purchase.material}
                    </Typography>
                    {' '}da empresa{' '}
                    <Typography component="span" variant="h6" fontWeight="bolder" display="inline">
                        {purchase.companyName}
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
                            endAdornment: <Typography>kg</Typography>
                        }}
                        fullWidth
                    />
                    <TextField
                        label="Valor"
                        type="number"
                        value={value}
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
                        value={purchase.status}
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