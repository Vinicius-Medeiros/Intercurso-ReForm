import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1E1E1E",
        },
        secondary: {
            main: '#1B5E20',
        },
        success: {
            main: "#1B5E20",
        },
        text: {
            primary: "#1E1E1E",
        },
        info: {
            main: "#0F3311",
        },
        background: {
            default: "#A49966",
            paper: "#DBBEA1 ",
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                }

            }
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    fontWeight: 'bold',
                    textTransform: 'none'
                }
            }
        }
    }
});
export default theme;