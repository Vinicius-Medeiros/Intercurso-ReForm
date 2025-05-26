import { EmpresaModal } from "./empresa";

export interface MaterialModal{
    id: number;
    empresa: EmpresaModal;
    quantidade: number;
    valor: number;
    tipo: TipoMaterialModal
}

export interface TipoMaterialModal {
    id: number,
    tipo: string;
}