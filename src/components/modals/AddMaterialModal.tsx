import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { useState } from 'react';

interface AddMaterialModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (name: string, quantity: number) => void;
}

export const AddMaterialModal = ({ open, onClose, onAdd }: AddMaterialModalProps) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [nameError, setNameError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);

    const handleSubmit = () => {
        let hasError = false;
        
        if (!name.trim()) {
            setNameError(true);
            hasError = true;
        } else {
            setNameError(false);
        }

        if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
            setQuantityError(true);
            hasError = true;
        } else {
            setQuantityError(false);
        }

        if (!hasError) {
            onAdd(name, Number(quantity));
            handleClose();
        }
    };

    const handleClose = () => {
        setName('');
        setQuantity('');
        setNameError(false);
        setQuantityError(false);
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: '500px',
                }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: 'secondary.main', 
                color: 'white',
                py: 2,
            }}>
                Adicionar Material
            </DialogTitle>
            
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nome do Material"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={nameError}
                        helperText={nameError ? "Nome é obrigatório" : ""}
                        autoFocus
                    />
                    <TextField
                        label="Quantidade (kg)"
                        fullWidth
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        error={quantityError}
                        helperText={quantityError ? "Quantidade deve ser maior que 0" : ""}
                        InputProps={{
                            inputProps: { min: 0 }
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} color="inherit">
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    color="secondary"
                >
                    Adicionar
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 