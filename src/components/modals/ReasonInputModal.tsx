import { Box, Dialog, DialogTitle, DialogContent, IconButton, Typography, DialogActions, Button, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState } from 'react';

interface ReasonInputModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    onConfirm: (reason: string) => void;
    initialReason?: string;
}

export const ReasonInputModal = ({ open, onClose, title, description, onConfirm, initialReason = '' }: ReasonInputModalProps) => {
    const [reason, setReason] = useState(initialReason);

    const handleConfirm = () => {
        onConfirm(reason);
        setReason(''); // Clear reason after confirming
    };

    const handleClose = () => {
        setReason(''); // Clear reason on close
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                }
            }}
        >
            <DialogTitle sx={{
                m: 0,
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'secondary.main',
                color: 'white'
            }}>
                <Typography variant="h6">
                    {title}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                {description && (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {description}
                    </Typography>
                )}
                <TextField
                    label="Motivo"
                    multiline
                    rows={4}
                    fullWidth
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="secondary"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="secondary"
                    disabled={!reason.trim()}
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 