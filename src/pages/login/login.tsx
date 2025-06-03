import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Box, Button, IconButton, InputAdornment, TextField, Typography, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"
import { useSnackbar } from "notistack"
import { ChangeEvent, FormEvent, MouseEvent, useRef, useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { login } from "../../store/slices/authSlice"
import { authService } from "../../Services/auth"

export const LoginPage = () => {
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const PassInputRef = useRef<HTMLInputElement>(null)
    const LoginInputRef = useRef<HTMLInputElement>(null)
    const [cnpj, setCnpj] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const disableButton: boolean = !cnpj || !password || isLoading

    const handleLoginSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (cnpj && e.key === "Enter" && !password) {
            e.preventDefault()
            PassInputRef.current?.focus()
        }
    }

    const handlePassSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (password && e.key === "Enter" && !cnpj) {
            e.preventDefault()
            LoginInputRef.current?.focus()
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const { company, token } = await authService.login({ 
                cnpj: cnpj.replace(/\D/g, ''), // Remove non-digits
                password 
            });
            
            dispatch(login({ user: company }));
            enqueueSnackbar("Logado com sucesso!", { variant: "success" })
            navigate("/dashboard")
        } catch (error: any) {
            const message = error.response?.data?.message || "Erro ao fazer login!";
            enqueueSnackbar(message, { variant: "error" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleRecoverPassword = async (event: FormEvent<HTMLDivElement>) => {
        event.preventDefault();
        // TODO: Implement password recovery
        enqueueSnackbar("Funcionalidade em desenvolvimento!", { variant: "info" })
        setModalOpen(false);
        setEmail("")
    }

    const formatCNPJ = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 14) {
            return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return value;
    };

    return (
        <>
            <Typography variant="h4" component={"h1"} color="primary">
                Login
            </Typography>
            <Box
                component={"form"}
                noValidate
                onSubmit={handleSubmit}
                display={"flex"}
                flexDirection={"column"}
                gap={2}
                width="100%"
            >
                <TextField
                    inputRef={LoginInputRef}
                    id="cnpj"
                    label="CNPJ"
                    variant="outlined"
                    type="text"
                    value={cnpj}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCnpj(formatCNPJ(e.target.value))}
                    autoFocus
                    required
                    onKeyDown={handleLoginSubmit}
                    inputProps={{
                        maxLength: 18, // XX.XXX.XXX/XXXX-XX
                        pattern: "[0-9.]*"
                    }}
                    helperText="Digite apenas números"
                />
                <TextField
                    inputRef={PassInputRef}
                    id="password"
                    label="Senha"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(current => !current)}
                                    onMouseDown={(e: MouseEvent) => e.preventDefault()}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    required
                    onKeyDown={handlePassSubmit}
                />
                <Link
                    onClick={() => setModalOpen(true)}
                    color="info"
                    sx={{
                        alignSelf: "flex-end",
                        marginTop: -1.5,
                        cursor: "pointer",
                    }}
                >
                    Esqueceu senha?
                </Link>
                <Button
                    color="secondary"
                    disabled={disableButton}
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                >
                    {isLoading ? "Entrando..." : "Entrar"}
                </Button>
                <Typography
                    sx={{
                        fontWeight: 'light',
                        textAlign: 'center'
                    }}
                >
                    Não tem cadastro?{' '}
                    <Link
                        component={RouterLink}
                        to={"/register"}
                        color="info"
                    >
                        Cadastre-se
                    </Link>
                </Typography>
            </Box>
            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                component={'form'}
                onSubmit={handleRecoverPassword}
            >
                <DialogTitle>Recuperação de Senha</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
                >
                    <DialogContentText>
                        Coloque seu CNPJ, enviaremos um link para a recuperação da sua senha
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        id="cnpj"
                        label="CNPJ"
                        type="text"
                        fullWidth
                        inputProps={{
                            maxLength: 18,
                            pattern: "[0-9.]*"
                        }}
                        helperText="Digite apenas números"
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button variant="contained" onClick={() => setModalOpen(false)} color="error">Cancelar</Button>
                    <Button variant="contained" type="submit" color="secondary">
                        Enviar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
