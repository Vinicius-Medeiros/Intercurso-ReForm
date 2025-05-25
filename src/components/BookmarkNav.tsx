import { Box, Paper, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

interface BookmarkProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const Bookmark = ({ label, isActive, onClick }: BookmarkProps) => (
    <Paper
        onClick={onClick}
        sx={{
            position: 'relative',
            width: '150px',
            height: '50px',
            backgroundColor: isActive ? 'background.paper' : 'secondary.light',
            color: isActive ? 'text.primary' :'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            mb: 1,
            pl: 2,
            '&:hover': {
                backgroundColor: isActive ? 'background.paper' : 'secondary.dark',
                color: isActive ? 'text.primary' :'white',
            },
            
            transform: isActive ? 'translateX(10px)' : 'none',
        }}
    >
        <Typography variant="body1" sx={{ fontWeight: isActive ? 'bold' : 'normal' }}>
            {label}
        </Typography>
    </Paper>
);

export const BookmarkNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const bookmarks = [
        { label: 'Conta', id: 0, path: '/dashboard/account' },
        { label: 'Materiais', id: 1, path: '/dashboard/materials' },
        { label: 'Compras', id: 2, path: '/dashboard/contracts' },
        { label: 'Vendas', id: 3, path: '/dashboard/companies' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                py: 2,
                px: 1,
                mt: 2,
                marginRight: "-64px",
            }}
        >
            {bookmarks.map((bookmark) => (
                <Bookmark
                    key={bookmark.id}
                    label={bookmark.label}
                    isActive={isActive(bookmark.path)}
                    onClick={() => navigate(bookmark.path)}
                />
            ))}
        </Box>
    );
}; 