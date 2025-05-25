import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

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
                bgcolor: 'error.main', 
                color: 'white',
                py: 2,
            }}>
                Remover Material
            </DialogTitle>
            
            <DialogContent sx={{ pt: 2, pb: 1 }}>
                <Typography>
                    Tem certeza que deseja remover o material <strong>{materialName}</strong>?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Esta ação não poderá ser desfeita.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancelar
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