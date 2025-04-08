import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Button, CircularProgress, InputAdornment, styled, TextField, Typography } from "@mui/material"
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react"
import { useSnackbar } from 'notistack';
import { verifyCnpj } from '../../services/receitaWS';


enum CnpjState {
    None,
    Success,
    Loading,
    ERROR,
}

const Row = styled(Box)(({ }) => ({
    display: "flex",
    width: "100%",
    // background: "red",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
    
}))

export const RegisterPage = () => {
    const {
        enqueueSnackbar
    } = useSnackbar()

    const [cnpjState, setCnpjState] = useState<CnpjState>(CnpjState.None)
    const [cnpj, setCnpj] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [pass, setPass] = useState<string>("")
    const [pass2, setpass2] = useState<string>("")


    useEffect(() => {
        if (cnpj.length < 14) {
            setCnpjState(CnpjState.None)
            return;
        }

        if (cnpj.length > 14)
            return;


            setCnpjState(CnpjState.Loading)
        verifyCnpj(cnpj).then(res => {
            console.log(res.data)
            if (res.data.status != "OK") {
                setCnpjState(CnpjState.ERROR)
                enqueueSnackbar(res.data.message, { variant: "error", })
                return;
            }
            if (res.data.situacao === "BAIXADA") {
                enqueueSnackbar("CNPJ em situação de BAIXA, insira um CNPJ ainda em ATIVIDADE!", { variant: "warning", })
                return;
            }
            //sucesso
            setCnpjState(CnpjState.Success)
            enqueueSnackbar("CNPJ validado com sucesso!", { variant: "success", })
            if(res.data.fantasia)
                setName(res.data.fantasia);
            
            else if (res.data.nome)
                setName(res.data.nome);
            
            if (res.data.email)
                setEmail(res.data.email);


        }).catch(res => {
            console.log(res)
            setCnpjState(CnpjState.ERROR)
            enqueueSnackbar("Serviço ocupado, tente novamente mais tarde!", { variant: "warning", })
        })
    }, [cnpj])

    var cnpjStateIcon: ReactElement
    switch (cnpjState) {
        case CnpjState.Loading:
            cnpjStateIcon = <CircularProgress size={32} />
            break;
        case CnpjState.Success:
            cnpjStateIcon = <CheckRoundedIcon />
            break;
        case CnpjState.ERROR:
            cnpjStateIcon = <CloseRoundedIcon />
            break;
        default:
            cnpjStateIcon = <RemoveRoundedIcon />
    }


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    return (
        <>
            <Typography variant="h4" component={"h1"} color="primary">
                Cadastre-se
            </Typography>
            <Box
                component={"form"}
                noValidate
                onSubmit={handleSubmit}
                width={"20rem"}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                gap={2}
            >
                <TextField
                    // inputRef={PassInputRef}
                    disabled={cnpjState == CnpjState.Loading}
                    id="cnpj"
                    label="CNPJ"
                    variant="outlined"
                    type="text"
                    value={cnpj}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)}
                    slotProps={{
                        htmlInput: {
                            maxLength: 14,
                        },
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    {cnpjStateIcon}
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        width: "100%",
                    }}
                    required
                />
                <TextField
                    id="nome"
                    label="Nome"
                    variant="outlined"
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    sx={{
                        width: "100%"
                    }}
                    required
                />
                <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    sx={{
                        width: "100%",
                    }}
                    required
                />
                <TextField
                    id="pass"
                    label="Senha"
                    variant="outlined"
                    type='password'
                    value={pass}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}
                    sx={{
                        width: "100%",
                    }}
                    required
                />
                <TextField
                    id="confirmPass"
                    label="Confimar Senha"
                    variant="outlined"
                    type='password'
                    value={pass2}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setpass2(e.target.value)}
                    sx={{
                        width: "100%",
                    }}
                    required
                />
                <Row>
                    <Button 
                    variant="contained" 
                    type="submit" 
                    color="success"
                    sx={{
                        width: "10rem",
                    }}
                    >
                        Criar
                    </Button>
                </Row>
            </Box></>

    )
}