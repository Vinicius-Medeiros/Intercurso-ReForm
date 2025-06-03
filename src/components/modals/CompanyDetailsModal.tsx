import { Business, Close, Description, Email, LocationOn, Phone } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    List,
    Typography,
    Chip,
    ListItemText,
    Divider
} from '@mui/material';
import { Company } from '../../Services/auth';


interface CompanyDetailsModalProps {
    open: boolean;
    onClose: () => void;
    company: Company | null;
}

export const CompanyDetailsModal = ({
    open,
    onClose,
    company
}: CompanyDetailsModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    minHeight: '60vh',
                    maxHeight: '80vh'
                }
            }}
        >
            <DialogTitle sx={{
                m: 0,
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'primary.main',
                color: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business />
                    <Typography variant="h6">Detalhes da Empresa</Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={(theme) => ({
                p: 3,
                maxHeight: 'calc(100vh - 350px)',
                scrollbarColor: `${theme.palette.primary.dark} transparent`,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                    width: '8px',
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0,0,0,.9)',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,.9)',
                    },
                },
            })}>
                {company ? (
                    <>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
                                {company.name}
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Business sx={{ color: 'text.secondary' }} />
                                    <Typography variant="body1">
                                        CNPJ: {company.cnpj.replace(
                                            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                                            '$1.$2.$3/$4-$5'
                                        )}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Email sx={{ color: 'text.secondary' }} />
                                    <Typography variant="body1">
                                        {company.email}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Phone sx={{ color: 'text.secondary' }} />
                                    <Typography variant="body1">
                                        {company.phone}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Description sx={{ color: 'text.secondary', mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            Descrição:
                                        </Typography>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {company.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn color="primary" />
                                Endereços
                            </Typography>

                        </Box>
                        <List sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 2,
                            p: 0
                        }}>
                            {company.addresses?.sort((a, b) => {
                                if (a.isMain && !b.isMain) {
                                    return -1;
                                }
                                if (!a.isMain && b.isMain) {
                                    return 1;
                                }
                                return 0;
                            }).map((address) => (
                                <Paper
                                    key={address.id}
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        position: 'relative',
                                        border: address.isMain ? '2px solid' : '1px solid',
                                        borderColor: address.isMain ? 'primary.main' : 'divider'
                                    }}
                                >
                                    {address.isMain && (
                                        <Chip
                                            label="Endereço Principal"
                                            color="primary"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: -10,
                                                right: 10,
                                                height: 20
                                            }}
                                        />
                                    )}
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                                                {address.street}, {address.number}
                                                {address.complement && ` - ${address.complement}`}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="text.secondary">
                                                    {address.neighborhood}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {address.city} - {address.state}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    CEP: {address.zipCode}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </Paper>
                            ))}
                        </List>
                    </>) : (
                    <></>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="contained" color="primary">
                    Fechar
                </Button>
            </DialogActions>
        </Dialog >
    );
}; 