import {
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Divider,
    InputAdornment,
    Box
} from '@mui/material';
import {
    Edit,
    Business,
    Email,
    Phone,
    Description
} from '@mui/icons-material';
import { useState } from 'react';
import { CompanyInfoType } from '../Account';

interface CompanyInfoProps {
    companyInfo: CompanyInfoType;
    onEdit: (updatedInfo: CompanyInfoType) => void;
}

export const CompanyInfo = ({ companyInfo, onEdit }: CompanyInfoProps) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedInfo, setEditedInfo] = useState(companyInfo);

    const handleEditCompanyInfo = () => {
        if (isEditMode) {
            onEdit(editedInfo);
        }
        setIsEditMode(!isEditMode);
    };

    const handleChange = (field: keyof typeof companyInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedInfo(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    function formatPhoneNumber(phoneNumberString: string) {
        // 1. Clean the input: Remove all non-digit characters
        const cleanNumber = phoneNumberString.replace(/\D/g, '');

        // 2. Apply the mask if the number has enough digits
        //    Brazilian mobile numbers typically have 11 digits (2 for DDD + 9 for local number)
        if (cleanNumber.length === 11) {
            return `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2, 7)}-${cleanNumber.substring(7, 11)}`;
        } else if (cleanNumber.length === 10) {
            // Handle older 10-digit formats (DDD + 8-digit local number)
            return `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2, 6)}-${cleanNumber.substring(6, 10)}`;
        } else {
            // Return the clean number if it doesn't match expected lengths,
            // or handle as you prefer (e.g., return an error, an empty string)
            return cleanNumber;
        }
    }

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business /> Informações da Empresa
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Edit />}
                    onClick={handleEditCompanyInfo}
                >
                    {isEditMode ? 'Salvar' : 'Editar Informações'}
                </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Nome da Empresa"
                        value={isEditMode ? editedInfo.name : companyInfo.name}
                        onChange={handleChange('name')}
                        disabled={!isEditMode}
                        InputProps={{
                            readOnly: !isEditMode
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="CNPJ"
                        value={isEditMode ? editedInfo.cnpj : companyInfo.cnpj.replace(
                            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                            '$1.$2.$3/$4-$5'
                        )}
                        onChange={handleChange('cnpj')}
                        disabled={!isEditMode}
                        InputProps={{
                            readOnly: !isEditMode
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={isEditMode ? editedInfo.email : companyInfo.email}
                        onChange={handleChange('email')}
                        disabled={!isEditMode}
                        InputProps={{
                            readOnly: !isEditMode,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Telefone"
                        value={isEditMode ? editedInfo.phone : formatPhoneNumber(companyInfo.phone)}
                        onChange={handleChange('phone')}
                        disabled={!isEditMode}
                        InputProps={{
                            readOnly: !isEditMode,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Phone />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Descrição"
                        value={isEditMode ? editedInfo.description : companyInfo.description}
                        onChange={handleChange('description')}
                        disabled={!isEditMode}
                        multiline
                        rows={3}
                        InputProps={{
                            readOnly: !isEditMode,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Description />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}; 