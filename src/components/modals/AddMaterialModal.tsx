import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { CreateMaterialRequest } from '../../Services/materialService';

interface AddMaterialModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (data: CreateMaterialRequest) => void;
}

export const AddMaterialModal = ({ open, onClose, onAdd }: AddMaterialModalProps) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [nameError, setNameError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [priceError, setPriceError] = useState(false);

    const handleSubmit = () => {
        let hasError = false;
        
        if (!name.trim()) {
            setNameError(true);
            hasError = true;
        } else {
            setNameError(false);
        }

        if (!category.trim()) {
            setCategoryError(true);
            hasError = true;
        } else {
            setCategoryError(false);
        }

        if (!description.trim()) {
            setDescriptionError(true);
            hasError = true;
        } else {
            setDescriptionError(false);
        }

        if (quantity.trim() === '' || isNaN(Number(quantity)) || Number(quantity) < 0) {
            setQuantityError(true);
            hasError = true;
        } else {
            setQuantityError(false);
        }

        if (price.trim() === '' || isNaN(Number(price)) || Number(price) < 0) {
            setPriceError(true);
            hasError = true;
        } else {
            setPriceError(false);
        }

        if (!hasError) {
            onAdd({
                name,
                category,
                description,
                quantity: Number(quantity),
                price: Number(price),
                unit: "kg"
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setName('');
        setCategory('');
        setDescription('');
        setQuantity('');
        setPrice('');
        setNameError(false);
        setCategoryError(false);
        setDescriptionError(false);
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
                 m: 0, 
                 p: 2, 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 bgcolor: 'secondary.dark',
                 color: 'white'
            }}>
                <Typography variant="h6" fontWeight="400">
                    Adicionar Material
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'secondary.light',
                        }
                    }}
                >
                    <Close />
                </IconButton>
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
                        label="Categoria"
                        fullWidth
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        error={categoryError}
                        helperText={categoryError ? "Categoria é obrigatória" : ""}
                    />
                    <TextField
                        label="Descrição"
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={descriptionError}
                        helperText={descriptionError ? "Descrição é obrigatória" : ""}
                    />
                    <TextField
                        label="Quantidade"
                        fullWidth
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        error={quantityError}
                        helperText={quantityError ? "Quantidade deve ser maior ou igual a 0" : ""}
                        InputProps={{
                            inputProps: { min: 0 }
                        }}
                    />
                    <TextField
                        label="Preço por unidade (R$)"
                        fullWidth
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        error={priceError}
                        helperText={priceError ? "Preço deve ser maior ou igual a 0" : ""}
                        InputProps={{
                            inputProps: { min: 0, step: "0.01" }
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} variant="outlined" color="secondary">
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
