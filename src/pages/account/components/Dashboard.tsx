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
    totalSalesValue: number;
    activeMaterials: number;
    lastPurchase: string;
    lastSale: string;
}

interface DashboardProps {
    data: DashboardData;
}

export const Dashboard = ({ data }: DashboardProps) => {
    const hasPurchase = data.lastPurchase !== '';
    const hasSale = data.lastSale !== '';

    const renderLastTransaction = () => {
        if (!hasPurchase && !hasSale) {
            return (
                <>
                    <Typography variant="subtitle1" color="text.secondary">
                        Nenhuma transação realizada
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                        -
                    </Typography>
                </>
            );
        }

        if (hasPurchase && !hasSale) {
            return (
                <>
                    <Typography variant="subtitle1" color="text.secondary">
                        Última Compra
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                        {data.lastPurchase}
                    </Typography>
                </>
            );
        }

        if (!hasPurchase && hasSale) {
            return (
                <>
                    <Typography variant="subtitle1" color="text.secondary">
                        Última Venda
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                        {data.lastSale}
                    </Typography>
                </>
            );
        }

        return (
            <>
                <Typography variant="subtitle1" color="text.secondary">
                    Última Compra / Última Venda
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    {data.lastPurchase} / {data.lastSale}
                </Typography>
            </>
        );
    };

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
                            <Typography sx={{ fontSize: '1rem', fontWeight: 500 }} color="secondary">
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
                            <Typography sx={{ fontSize: '1rem', fontWeight: 500 }} color="success.main">
                                {data.totalSales}
                                {' '}/{' '}
                                {data.totalSalesValue.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total de vendas realizadas / Total recebido
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
                            <Typography sx={{ fontSize: '1rem', fontWeight: 500 }} color="secondary">
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Description color="secondary" />
                                <Typography variant="h6">Últimas Transações</Typography>
                            </Box>
                            {renderLastTransaction()}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
}; 