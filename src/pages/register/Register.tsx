import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Button, CircularProgress, InputAdornment, styled, TextField, Typography } from "@mui/material"
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react"
import { OptionsObject, useSnackbar } from 'notistack';
import { closeIconStyles } from './constant';
import { CnpjRequest, verifyCnpj } from '../../Services/receitaWS';
import { useNavigate } from 'react-router';


enum CnpjState {
    None,
    Success,
    Loading,
    ERROR,
}

interface ReturnMsgToShowType {
    message: String | undefined
    variant: OptionsObject<"warning" | "error" | "success" | "default" | "info">
}

const returnMsgToShow = (response: CnpjRequest): ReturnMsgToShowType => {
    if (response.situacao == "BAIXADA") {
        return {
            message: "CNPJ em situação de BAIXA, insira um CNPJ ainda em ATIVIDADE!",
            variant: { variant: "warning" }
        }
    }

    return {
        message: response.message,
        variant: { variant: "error" }
    }
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

    const navigate = useNavigate()

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
            if (res.data.status != "OK" || res.data.situacao === "BAIXADA") {
                setCnpjState(CnpjState.ERROR)
                const { message, variant } = returnMsgToShow(res.data)
                enqueueSnackbar(message, variant)
                return;
            }

            //sucesso
            setCnpjState(CnpjState.Success)
            enqueueSnackbar("CNPJ validado com sucesso!", { variant: "success", })
            if (res.data.fantasia)
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
            cnpjStateIcon = <CloseRoundedIcon onClick={() => setCnpj("")} sx={closeIconStyles} />
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
                <Row sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/login")}
                        color="success"
                        sx={{
                            width: "9.5rem",
                        }}
                    >
                        Voltar
                    </Button>

                    <Button
                        variant="contained"
                        type="submit"
                        color="success"
                        sx={{
                            width: "9.5rem",
                        }}
                    >
                        Criar
                    </Button>
                </Row>
            </Box></>

    )
}