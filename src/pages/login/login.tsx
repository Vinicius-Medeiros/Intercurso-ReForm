import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Box, Button, IconButton, InputAdornment, TextField, Typography, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Paper, SvgIcon } from "@mui/material"
import { useSnackbar } from "notistack"
import { ChangeEvent, FormEvent, MouseEvent, useRef, useState } from "react"
import { Link as RouterLink } from "react-router"

export const LoginPage = () => {
    const {
        enqueueSnackbar
    } = useSnackbar()

    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const [email, setEmail] = useState<string>("")

    const PassInputRef = useRef<HTMLInputElement>(null)
    const LoginInputRef = useRef<HTMLInputElement>(null)

    const [login, setLogin] = useState<String>("")
    const [password, setPassword] = useState<String>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const disableButton: boolean = !login || !password

    const handleLoginSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (login && e.key === "Enter" && !password) {
            e.preventDefault()
            PassInputRef.current?.focus()
        }
    }

    const handlePassSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (password && e.key === "Enter" && !login) {
            e.preventDefault()
            LoginInputRef.current?.focus()
        }
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        enqueueSnackbar("Logado com sucesso!", {
            variant: "success",
            anchorOrigin: {
                horizontal: "center",
                vertical: "top",
            },
            autoHideDuration: 3000
        })
        setLogin("")
        setPassword("")
    }

    const handleRecoverPassword = (event: FormEvent<HTMLDivElement>) => {
        event.preventDefault();

        enqueueSnackbar("Email de recuperação enviado com sucesso!", {
            variant: "success",
            anchorOrigin: {
                horizontal: "center",
                vertical: "top",
            },
            autoHideDuration: 3000
        })

        setModalOpen(false);
        setEmail("")
    }

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
                    id="login"
                    label="Login"
                    variant="outlined"
                    type="text"
                    value={login}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                    autoFocus
                    required
                    onKeyDown={handleLoginSubmit}
                />
                <TextField
                    inputRef={PassInputRef}
                    id="pass"
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
                    Entrar
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
                        Coloque seu endereço de email, enviaremos um link para a recuperação da sua senha
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
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
