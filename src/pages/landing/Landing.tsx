import { Box, Button, Container, Stack, Typography, Card, CardContent, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RecyclingIcon from '@mui/icons-material/Recycling';
import SearchIcon from '@mui/icons-material/Search';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SpaIcon from '@mui/icons-material/Spa';
import logo from '../../../public/images/reciclar.png';
import uniforlogo from '../../../public/images/logounifor.png';

const Landing = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const features = [
        {
            icon: <RecyclingIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
            title: 'Gestão de Materiais',
            description: 'Cadastre e gerencie seus materiais excedentes de forma eficiente e sustentável.'
        },
        {
            icon: <SearchIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
            title: 'Busca Inteligente',
            description: 'Encontre materiais específicos que sua empresa precisa de forma rápida e precisa.'
        },
        {
            icon: <HandshakeIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
            title: 'Conexão Empresarial',
            description: 'Conecte-se com outras empresas para criar parcerias sustentáveis.'
        },
        {
            icon: <SpaIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
            title: 'Impacto Ambiental',
            description: 'Reduza o desperdício e contribua para um futuro mais sustentável.'
        }
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(45deg,rgba(147, 148, 70, 0.75) 30%,rgba(165, 194, 62, 0.75) 90%)',
                    color: 'white',
                    py: 8,
                    mb: 6
                }}
            >
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                        <Box sx={{ flex: 1}}>
                            <Typography variant="h2" component="h1" gutterBottom>
                                ReForm
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                Transformando resíduos em oportunidades
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Conectamos empresas para promover a reutilização de materiais, 
                                reduzindo o desperdício e criando um impacto positivo no meio ambiente.
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={() => navigate('/register')}
                                sx={{ mt: 2 }}
                            >
                                Comece Agora
                            </Button>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Box
                                component="img"
                                src={logo}
                                alt="Reciclagem"
                                sx={{
                                    width: '100%',
                                    height: '350px',
                                    display: 'block',
                                    margin: '0 auto'
                                }}
                            />
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Typography variant="h3" component="h2" align="center" gutterBottom>
                    Como Funciona
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mt: 2 }}>
                    {features.map((feature, index) => (
                        <Box key={index} sx={{ flex: 1 }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)'
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2 }}>
                                    {feature.icon}
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Stack>
            </Container>

            {/* About Section */}
            <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h3" component="h2" gutterBottom>
                                Sobre o Projeto
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                O ReForm é um projeto desenvolvido por estudantes da Universidade de Fortaleza (UNIFOR) 
                                com o objetivo de criar uma plataforma que conecta empresas para promover a reutilização 
                                de materiais e reduzir o desperdício industrial.
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Nossa missão é transformar o modo como as empresas lidam com seus materiais excedentes, 
                                criando uma rede de colaboração que beneficia tanto o meio ambiente quanto o setor industrial.
                            </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Box
                                component="img"
                                src={uniforlogo}
                                alt="Campus UNIFOR"
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    boxShadow: 3
                                }}
                            />
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* CTA Section */}
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h3" component="h2" gutterBottom>
                    Faça Parte Desta Mudança
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Junte-se a nós e contribua para um futuro mais sustentável. 
                    Cadastre sua empresa e comece a transformar resíduos em oportunidades.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/register')}
                >
                    Cadastre sua Empresa
                </Button>
            </Container>
        </Box>
    );
};

export default Landing;