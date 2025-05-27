import { 
    Paper, 
    Typography, 
    Button, 
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Box
} from '@mui/material';
import { 
    Add, 
    Edit, 
    Delete, 
    LocationOn 
} from '@mui/icons-material';
import { useState } from 'react';
import { ConfirmModal } from '../../../components/modals/ConfirmModal';

interface Address {
    id: number;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isMain: boolean;
}

interface AddressesProps {
    addresses: Address[];
    onAddAddress: () => void;
    onEditAddress: (address: Address) => void;
    onDeleteAddress: (addressId: number) => void;
    onSetMainAddress: (addressId: number) => void;
}

export const Addresses = ({ 
    addresses, 
    onAddAddress, 
    onEditAddress, 
    onDeleteAddress,
    onSetMainAddress 
}: AddressesProps) => {
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setAddressToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (addressToDelete !== null) {
            onDeleteAddress(addressToDelete);
            setAddressToDelete(null);
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn /> Endereços
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Add />}
                    onClick={onAddAddress}
                >
                    Adicionar Endereço
                </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={(theme) => ({
                maxHeight: '160px',
                overflowY: 'auto',
                scrollbarColor: `${theme.palette.secondary.light} transparent`,
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
                <List>
                    {addresses.map((address) => (
                        <ListItem
                            key={address.id}
                            sx={{
                                bgcolor: 'background.paper',
                                mb: 1,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {address.street}, {address.number}
                                        {address.complement && ` - ${address.complement}`}
                                        {address.isMain && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    bgcolor: 'secondary.main',
                                                    color: 'white',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    ml: 1
                                                }}
                                            >
                                                Principal
                                            </Typography>
                                        )}
                                    </Box>
                                }
                                secondary={`${address.neighborhood}, ${address.city} - ${address.state}, ${address.zipCode}`}
                            />
                            <ListItemSecondaryAction>
                                {!address.isMain && (
                                    <Button
                                        size="small"
                                        onClick={() => onSetMainAddress(address.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        Definir como Principal
                                    </Button>
                                )}
                                <IconButton
                                    edge="end"
                                    onClick={() => onEditAddress(address)}
                                    sx={{ mr: 1 }}
                                >
                                    <Edit />
                                </IconButton>
                                {!address.isMain && (
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleDeleteClick(address.id)}
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                )}
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <ConfirmModal
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Remover endereço"
                message="Tem certeza que deseja remover este endereço?"
                confirmText="Remover"
            />
        </Paper>
    );
}; 