import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { useState, useEffect } from 'react';

interface EditMaterialModalProps {
    open: boolean;
    onClose: () => void;
    onEdit: (id: number, name: string, quantity: number, pricePerKg: number) => void;
    material: {
        id: number;
        name: string;
        quantity: number;
        pricePerKg: number;
    } | null;
}

export const EditMaterialModal = ({ open, onClose, onEdit, material }: EditMaterialModalProps) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');
    const [nameError, setNameError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [priceError, setPriceError] = useState(false);

    useEffect(() => {
        if (material) {
            setName(material.name);
            setQuantity(material.quantity.toString());
            setPricePerKg(material.pricePerKg.toString());
        }
    }, [material]);

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

        if (!pricePerKg.trim() || isNaN(Number(pricePerKg)) || Number(pricePerKg) < 0) {
            setPriceError(true);
            hasError = true;
        } else {
            setPriceError(false);
        }

        if (!hasError && material) {
            onEdit(material.id, name, Number(quantity), Number(pricePerKg));
            handleClose();
        }
    };

    const handleClose = () => {
        setName('');
        setQuantity('');
        setPricePerKg('');
        setNameError(false);
        setQuantityError(false);
        setPriceError(false);
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
                Editar Material
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
                    <TextField
                        label="Preço por kg (R$)"
                        fullWidth
                        type="number"
                        value={pricePerKg}
                        onChange={(e) => setPricePerKg(e.target.value)}
                        error={priceError}
                        helperText={priceError ? "Preço deve ser maior ou igual a 0" : ""}
                        InputProps={{
                            inputProps: { min: 0, step: "0.01" }
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
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 