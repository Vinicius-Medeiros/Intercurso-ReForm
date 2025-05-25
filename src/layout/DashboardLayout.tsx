import { Paper, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { BookmarkNav } from '../components/BookmarkNav';

export const DashboardLayout = () => {
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                bgcolor: 'background.default',
                py: 3,
            }}
            maxWidth="xl"
        >
            <BookmarkNav />
            <Paper
                elevation={3}
                sx={{
                    margin: 3,
                    p: 4,
                    flex: 1,
                    Height: 'auto',
                    Width: '80vw',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 10,
                }}
            >
                <Outlet />
            </Paper>
        </Container>
    );
}; 