import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Button, CircularProgress, InputAdornment, styled, TextField, Typography } from "@mui/material"
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react"
import { OptionsObject, useSnackbar } from 'notistack';
import { closeIconStyles } from './constant';
import { useNavigate } from 'react-router';
import { CreateEmpresaModel } from '../../models/empresa';
import { LoadingState } from '../../utils/enums';
import { CnpjRequest, verifyCnpj } from '../../Services/receitaWS';
import { EmpresaService } from '../../Services/empresa';


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

    const [cnpjState, setCnpjState] = useState<LoadingState>(LoadingState.None)
    const [formState, setFormeState] = useState<LoadingState>(LoadingState.None)

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [cnpj, setCnpj] = useState<string>("")
    const [telefone, setTelefone] = useState<string>("")
    const [cep, setCep] = useState<string>("")
    const [logradouro, setLogradouro] = useState<string>("")
    const [numero, setNumero] = useState<string>("")
    const [complemento, setComplemento] = useState<string>("")
    const [bairro, setBairro] = useState<string>("")
    const [municipio, setMunicipio] = useState<string>("")
    const [uf, setUf] = useState<string>("")
    const [pass, setPass] = useState<string>("")
    const [pass2, setpass2] = useState<string>("")


    useEffect(() => {
        if (cnpj.length < 14) {
            setCnpjState(LoadingState.None)
            return;
        }

        if (cnpj.length > 14)
            return;


        setCnpjState(LoadingState.Loading)
        verifyCnpj(cnpj).then(res => {
            console.log(res.data)
            if (res.data.status != "OK") {
                setCnpjState(LoadingState.ERROR)
                returnMsgToShow(res.data as CnpjRequest)
                return;
            }

            //sucesso
            setCnpjState(LoadingState.Success)
            enqueueSnackbar("CNPJ validado com sucesso!", { variant: "success", })

            setName(old =>
                res.data.fantasia ||
                res.data.nome ||
                old
            )
            setEmail(old => res.data.email || old);
            setTelefone(old => res.data.telefone || old);
            setCep(old => res.data.cep || old);
            setEmail(old => res.data.email || old);
            setLogradouro(old => res.data.logradouro || old);
            setNumero(old => res.data.numero || old);
            setComplemento(old => res.data.complemento || old);
            setBairro(old => res.data.bairro || old);
            setMunicipio(old => res.data.municipio || old);
            setUf(old => res.data.uf || old);


        }).catch(res => {
            console.log(res)
            setCnpjState(LoadingState.ERROR)
            enqueueSnackbar("Serviço ocupado, tente novamente mais tarde!", { variant: "warning", })
        })
    }, [cnpj])

    var cnpjStateIcon: ReactElement
    switch (cnpjState) {
        case LoadingState.Loading:
            cnpjStateIcon = <CircularProgress size={32} />
            break;
        case LoadingState.Success:
            cnpjStateIcon = <CheckRoundedIcon />
            break;
        case LoadingState.ERROR:
            cnpjStateIcon = <CloseRoundedIcon onClick={() => setCnpj("")} sx={closeIconStyles} />
            break;
        default:
            cnpjStateIcon = <RemoveRoundedIcon />
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        if (pass != pass2)
            return enqueueSnackbar('senhas não coincidem', { variant: "error" })

        const postData: CreateEmpresaModel = {
            nome: name,
            email,
            cnpj,
            telefone,
            logradouro,
            numero,
            complemento,
            cep,
            bairro,
            municipio,
            uf,
            senha: pass
        }
        console.log('postData', postData)

        setFormeState(LoadingState.Loading)

        EmpresaService.create(postData).then(() => {
            enqueueSnackbar('Empresa cadastrada com sucesso!', { variant: "success" })
            navigate("/login")
        }).catch( () => {
            enqueueSnackbar('Error ao cadastrar empresa!', { variant: "error" })
        }).finally(() => setFormeState(LoadingState.None))
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
                    disabled={cnpjState == LoadingState.Loading}
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
                    type="text"
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
                    id="telefone"
                    label="Telefone"
                    variant="outlined"
                    type="text"
                    value={telefone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)}
                    sx={{
                        width: "100%",
                    }}
                    required
                />
                <TextField
                    id="cep"
                    label="CEP"
                    variant="outlined"
                    type="text"
                    value={cep}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCep(e.target.value)}
                    sx={{
                        width: "100%",
                    }}
                    required
                />
                <TextField
                    id="logradouro"
                    label="Endereço"
                    variant="outlined"
                    type="text"
                    value={logradouro}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLogradouro(e.target.value)}
                    sx={{
                        width: "100%",
                    }}
                    required
                />
                <TextField
                    id="numero"
                    label="Numero"
                    variant="outlined"
                    type="text"
                    value={numero}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNumero(e.target.value)}
                    sx={{
                        width: "100%",
                    }}
                    required
                />
                <TextField
                    id="complemento"
                    label="Complemento"
                    variant="outlined"
                    type="text"
                    value={complemento}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setComplemento(e.target.value)}
                    sx={{
                        width: "100%",
                    }}
                />
                <TextField
                    id="bairro"
                    label="Bairro"
                    variant="outlined"
                    type="text"
                    value={bairro}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBairro(e.target.value)}
                    sx={{
                        width: "100%",
                    }}
                    required
                />
                <TextField
                    id="municipio"
                    label="Municipio"
                    variant="outlined"
                    type="text"
                    value={municipio}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMunicipio(e.target.value)}
                    sx={{
                        width: "100%",
                    }}
                    required
                />
                <TextField
                    id="uf"
                    label="UF"
                    variant="outlined"
                    type="text"
                    value={uf}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUf(e.target.value)}
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
                        disabled = {formState == LoadingState.Loading}
                    >
                        Criar Cadastro
                    </Button>
                </Row>
            </Box></>

    )
}