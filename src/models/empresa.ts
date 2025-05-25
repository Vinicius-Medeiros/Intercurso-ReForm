export interface EnderecoModal {
    logradouro: string;
    numero: string;
    complemento: string;
    cep: string;
    bairro: string;
    municipio: string;
    uf: string;
}


export interface CreateEmpresaModel extends EnderecoModal{
    nome: string;
    email: string
    cnpj: string;
    telefone: string;
    senha: string;
}

export interface EmpresaModal extends EnderecoModal{
    email: string
    cnpj: string;
    telefone: string;
    enderecoList: EnderecoModal[];
}

