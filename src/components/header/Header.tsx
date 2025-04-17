import { AccountCircle } from "@mui/icons-material";
import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import Logo from "../../assets/logo";
import { useNavigate } from "react-router";


export const Header = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                            onClick={() => auth ? handleMenu : navigate("/login")}
                            color="inherit"
                        >
                            {auth ?
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
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                        </Menu>
                    </div>
            </Toolbar>
        </AppBar>
    );
}
