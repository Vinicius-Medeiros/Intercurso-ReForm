import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, CircularProgress, InputAdornment, TextField, Typography } from "@mui/material"
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react"
import { verifyCnpj } from '../../services/receitaWS';


enum CnpjState {
    None,
    Success,
    Loading,
    NotFound,
}

export const RegisterPage = () => {

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
            setCnpjState(CnpjState.Success)
        }).catch(res => {
            console.log(res)
            setCnpjState(CnpjState.NotFound)
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
        case CnpjState.NotFound:
            cnpjStateIcon = <CloseRoundedIcon />
            break;
        default:
            cnpjStateIcon = <RemoveRoundedIcon />
    }


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    return (

        <><Typography variant="h4" component={"h1"}>Crie uma conta</Typography><Box
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
                id="pass"
                label="CNPJ"
                variant="outlined"
                type="text"
                value={cnpj}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                {/* <Icon
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(current => !current)}
                                onMouseDown={(e: MouseEvent) => e.preventDefault()}
                            >
                                {<VisibilityOff />}
                            </Icon> */}
                                {cnpjStateIcon}

                            </InputAdornment>
                        ),
                    },
                }}
                required />
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