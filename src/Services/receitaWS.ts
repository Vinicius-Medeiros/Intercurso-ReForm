import axios, { AxiosResponse } from "axios";

//cnpj testes 
//fortaleza - 07954605000160
//meu cnpj  - 55319695000160

export type CnpjRequest = {
    status: "OK" | "ERROR",
    situacao: string,
    tipo: string,
    nome: string,
    fantasia: string,
    porte: string,
    logradouro: string,
    numero: string,
    complemento: string,
    municipio: string,
    bairro: string,
    uf: string,
    cep: string,
    email: string,
    telefone: string,
    cnpj: string,

    /**  Only if was an ERROR */
    message?: string,
}

const api = axios.create({
    baseURL: "/api", // Use the proxy
});

export const verifyCnpj = async (cnpj: string): Promise<AxiosResponse<any>> => {
    return await api.get(cnpj);
};