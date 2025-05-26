import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    materialName: string;
}

export const DeleteConfirmationModal = ({ open, onClose, onConfirm, materialName }: DeleteConfirmationModalProps) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
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
                bgcolor: 'error.main',
                color: 'white'
            }}>
                <Typography variant="h6">
                    Remover Material
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
            
            <DialogContent sx={{ pt: 2, pb: 1 }}>
                <Typography sx={{ mt: 2 }}>
                    Tem certeza que deseja remover o material{' '}
                    <Typography component="span" fontWeight="bold" display="inline">
                        {materialName}?
                    </Typography>
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined" color="error">
                    Voltar
                </Button>
                <Button 
                    onClick={onConfirm}
                    variant="contained" 
                    color="error"
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 