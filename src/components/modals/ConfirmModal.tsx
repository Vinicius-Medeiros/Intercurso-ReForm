import { Close } from '@mui/icons-material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton
} from '@mui/material';

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    color?: string;
}

export const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    color = '#EF5350' // Default to error color
}: ConfirmModalProps) => {
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
                bgcolor: color,
                color: 'white'
            }}>
                <Typography variant="h6">{title}</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                        }
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 2, pb: 1 }}>
                <Typography sx={{ mt: 2 }}>{message}</Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button 
                    onClick={onClose} 
                    variant="outlined" 
                    sx={{ 
                        borderColor: color,
                        color: color,
                        '&:hover': {
                            borderColor: color,
                            bgcolor: `${color}15`
                        }
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    variant="contained"
                    sx={{ 
                        bgcolor: color,
                        '&:hover': {
                            bgcolor: color,
                            opacity: 0.9
                        }
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 