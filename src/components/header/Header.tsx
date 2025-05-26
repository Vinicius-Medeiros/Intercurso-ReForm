import { AccountCircle } from "@mui/icons-material";
import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import Logo from "../../assets/logo";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

export const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <AppBar position="static" >
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => { navigate("/home")}}
                    sx={{ mr: 2, borderRadius:0, }}
                >
                    <Logo height={48} width={48} />

                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            marginLeft: ".5rem"
                        }}
                    >
                        ReForm
                    </Typography>
                </IconButton>
                <Box
                    flexGrow={1}
                >
                </Box>
                    
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={isAuthenticated ? handleMenu : () => navigate("/login")}
                            color="inherit"
                        >
                            {isAuthenticated ?
                                <AccountCircle
                                    sx={{
                                        height: 48,
                                        width: 48
                                    }}
                                />
                                :
                                <Typography
                                    variant="h6"
                                    component="h1"
                                >
                                    Login
                                </Typography>
                            }
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            sx={(theme) => ({
                                "& .MuiPaper-root": {
                                    top: "65px !important",
                                    left: "1795px !important",
                                    overflow: 'visible',
                                    "&::before, &::after": {
                                        content: '""',
                                        position: 'absolute',
                                        display: 'block',
                                        width: 0,
                                        height: 0,
                                        right: '40%',
                                    },
                                    "&::before": {
                                        top: '-12px',
                                        borderLeft: '12px solid transparent',
                                        borderRight: '12px solid transparent',
                                        borderBottom: '12px solid rgba(0,0,0,0.12)',
                                    },
                                    "&::after": {
                                        top: '-6px',
                                        borderLeft: '10px solid transparent',
                                        borderRight: '10px solid transparent',
                                        borderBottom: `10px solid ${theme.palette.background.paper}`,
                                    }
                                },
                                "& .MuiList-root": {
                                    position: 'relative',
                                }
                            })}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => {handleClose(); navigate("/dashboard/account")}}>Minha Conta</MenuItem>
                            <MenuItem onClick={() => {handleClose(); navigate("/dashboard/purchases")}}>Contratos</MenuItem>
                            <MenuItem onClick={handleLogout}>Sair</MenuItem>
                        </Menu>
                    </div>
            </Toolbar>
        </AppBar>
    );
}
