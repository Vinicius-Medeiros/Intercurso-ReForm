import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    CircularProgress
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

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

interface AddressModalProps {
    open: boolean;
    onClose: () => void;
    address: Address | null;
    onSave: (address: Omit<Address, 'id' | 'isMain'>) => void;
}

interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

const initialFormState = {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
};

export const AddressModal = ({ open, onClose, address, onSave }: AddressModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const { enqueueSnackbar } = useSnackbar();

    // Atualiza o estado do formulário quando o modal é aberto com um endereço existente
    useEffect(() => {
        if (open && address) {
            setFormData({
                street: address.street,
                number: address.number,
                complement: address.complement || '',
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode
            });
        } else if (open) {
            // Se abrir sem endereço, reseta o formulário
            setFormData(initialFormState);
        }
    }, [open, address]);

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Se o campo for CEP e tiver 8 dígitos, busca o endereço
        if (field === 'zipCode') {
            if (value.replace(/\D/g, '').length === 8) {
                fetchAddress(value);
            } else if (value === '') {
                // Se o CEP for apagado, reseta os campos de endereço
                setFormData(prev => ({
                    ...prev,
                    street: '',
                    neighborhood: '',
                    city: '',
                    state: ''
                }));
            }
        }
    };

    const fetchAddress = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        setLoading(true);
        try {
            // Delay de 5 segundos antes de fazer a consulta
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data: ViaCepResponse = await response.json();

            if (!data.erro) {
                setFormData(prev => ({
                    ...prev,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf,
                    complement: data.complemento || prev.complement
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            enqueueSnackbar(`Erro ao buscar pelo CEP: ${cep}!`, { variant: "error", })
        } finally {
            setLoading(false);
            enqueueSnackbar(`Informações do CEP buscadas com sucesso!`, { variant: "success", })
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave(formData);
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {address ? 'Editar Endereço' : 'Adicionar Endereço'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="CEP"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange('zipCode')}
                                    required
                                    disabled={loading}
                                    inputProps={{
                                        maxLength: 9
                                    }}
                                    InputProps={{
                                        endAdornment: loading && (
                                            <CircularProgress size={20} />
                                        )
                                    }}
                                    helperText="Digite o CEP para preencher o endereço automaticamente"
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    label="Rua"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange('street')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Número"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange('number')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Complemento"
                                    name="complement"
                                    value={formData.complement}
                                    onChange={handleChange('complement')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Bairro"
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleChange('neighborhood')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Cidade"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange('city')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Estado"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange('state')}
                                    required
                                    inputProps={{
                                        maxLength: 2
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="secondary">
                        Salvar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}; 