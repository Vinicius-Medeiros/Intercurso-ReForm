import { 
    Paper, 
    Typography, 
    Grid, 
    Card,
    CardContent,
    Box,
    Divider
} from '@mui/material';
import { 
    Business,
    ShoppingCart,
    AttachMoney,
    Description
} from '@mui/icons-material';

interface DashboardData {
    totalPurchases: number;
    totalSpent: number;
    totalSales: number;
    activeMaterials: number;
    lastPurchase: string;
}

interface DashboardProps {
    data: DashboardData;
}

export const Dashboard = ({ data }: DashboardProps) => {
    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business /> Dashboard
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <ShoppingCart color="secondary" />
                                <Typography variant="h6">Compras</Typography>
                            </Box>
                            <Typography variant="h6" color="secondary">
                                {data.totalPurchases}
                                {' '}/{' '}
                                {data.totalSpent.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total de compras realizadas / Total gasto
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <AttachMoney color="success" />
                                <Typography variant="h6">Vendas</Typography>
                            </Box>
                            <Typography variant="h6" color="success.main">
                                {data.totalSales.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total em vendas realizadas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Description color="secondary" />
                                <Typography variant="h6">Materiais</Typography>
                            </Box>
                            <Typography variant="h6" color="secondary">
                                {data.activeMaterials}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Materiais ativos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="text.secondary">
                                Última Compra
                            </Typography>
                            <Typography variant="h6">
                                {data.lastPurchase}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
}; 