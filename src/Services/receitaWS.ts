import axios, { AxiosResponse } from "axios";

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

export const verifyCnpj = async (cnpj: string): Promise<AxiosResponse<CnpjRequest>> => {
    return await api.get(cnpj);
};