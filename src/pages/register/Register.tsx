import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, CircularProgress, InputAdornment, TextField, Typography } from "@mui/material"
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react"
import { useSnackbar } from 'notistack';
import { verifyCnpj } from '../../services/receitaWS';


enum CnpjState {
    None,
    Success,
    Loading,
    ERROR,
}

export const RegisterPage = () => {
    const {
        enqueueSnackbar
    } = useSnackbar()

    const [cnpjState, setCnpjState] = useState<CnpjState>(CnpjState.None)
    const [cnpj, setCnpj] = useState<string>("")

    useEffect(() => {
        if (cnpj.length < 14) {
            setCnpjState(CnpjState.None)
            return;
        }

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
            setCnpjState(CnpjState.Success)
            enqueueSnackbar("CNPJ validado com sucesso!", { variant: "success", })


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
                Login
            </Typography>
            <Box
                component={"form"}
                noValidate
                onSubmit={handleSubmit}
                width={"100%"}
                display={"flex"}
                flexDirection={"column"}
                gap={2}
            >
                <TextField
                    // inputRef={PassInputRef}
                    id="cnpj"
                    label="CNPJ"
                    variant="outlined"
                    type="text"
                    value={cnpj}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    {cnpjStateIcon}
                                </InputAdornment>
                            ),
                        },
                    }}
                    required
                />
                <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    width={"100%"}
                >
                    <TextField 
                        
                    />
                    <TextField />
                </Box>
                <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    width={"100%"}
                >
                    <TextField />
                    <TextField />
                </Box>
                <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    width={"100%"}
                >
                    <TextField />
                    <TextField />
                </Box>
                <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    width={"100%"}
                >
                    <TextField />
                    <TextField />
                </Box>
            </Box></>

    )
}