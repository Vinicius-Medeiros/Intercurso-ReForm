import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Box, Button, IconButton, InputAdornment, TextField, Typography, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"
import { useSnackbar } from "notistack"
import { ChangeEvent, FormEvent, MouseEvent, useRef, useState } from "react"
import {Link as RouterLink} from "react-router"


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
            <Box
                display={"flex"}
                flexDirection={"column"}
                maxWidth={400}
                minHeight={400}
                borderRadius={2}
                alignItems={"center"}
                margin={"auto"}
                marginTop={16}
                justifySelf={"center"}
                gap={4}
                padding={3}
                sx={{
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "4px 4px 4px rgba(100, 100, 100, 0.1)"

                }}
            >
                <Typography variant="h4" component={"h1"} >Login</Typography>
                <Box
                    component={"form"}
                    noValidate
                    onSubmit={handleSubmit}

                    display={"flex"}
                    flexDirection={"column"}
                    gap={2}
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
                        slotProps={{
                            input: { // Use slotProps.input instead of InputProps
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
                            },
                        }}
                        required
                        onKeyDown={handlePassSubmit}
                    />
                    <Link
                        onClick={() => setModalOpen(true)}
                        sx={{
                            alignSelf: "flex-end",
                            marginTop: -1.5,
                        }}

                    >
                        Esqueceu senha?
                    </Link>
                    <Button
                        disabled={disableButton}
                        type="submit"
                        variant="contained"
                    >
                        Entrar
                    </Button>
                    <Typography
                        sx={{
                            fontWeight: 'light'
                        }}
                    >
                        Não tem cadastro? <Link component={RouterLink} to={"/register"}>Cadastre-se</Link>
                    </Typography>
                </Box>
            </Box>
            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                component={'form'}
                onSubmit={handleRecoverPassword}
            >
                <DialogTitle>Reset password</DialogTitle>
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
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" type="submit">
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
