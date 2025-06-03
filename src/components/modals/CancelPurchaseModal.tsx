import { Box, Dialog, DialogTitle, IconButton, Typography, DialogActions, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Purchase } from '../../Services/purchaseService';

interface CancelPurchaseModalProps {
    open: boolean;
    onClose: () => void;
    purchase: Purchase;
    onConfirm: (id: string) => void;
}

export const CancelPurchaseModal = ({ open, onClose, purchase, onConfirm }: CancelPurchaseModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    maxHeight: '30vh',
                }
            }}
        >
            <DialogTitle sx={{ 
                m: 0, 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                bgcolor: 'error.main',
                color: 'white'
            }}>
                <Typography variant="h6">
                    Cancelar Compra
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'primary.main',
                        }
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">
                    Tem certeza que deseja cancelar a compra de{' '}
                    <Typography component="span" fontWeight="bold" display="inline">
                        {purchase.material.name}
                    </Typography>
                    {' '}da empresa{' '}
                    <Typography component="span" fontWeight="bold" display="inline">
                        {purchase.seller.name}?
                    </Typography>
                </Typography>
            </Box>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    color="error"
                >
                    Voltar
                </Button>
                <Button
                    onClick={() => onConfirm(purchase.id)}
                    variant="contained"
                    color="error"
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 