import { ContractState } from "../enums/ContractState";
import { EmpresaModal } from "./empresa";
import { MaterialModal } from "./material";


export interface ContractModal {
    id: number;
    comprador: EmpresaModal;
    vendedor: EmpresaModal;
    quantidade: number;
    valor: number;
    material: MaterialModal;
    status: ContractState;
    data: Date;
}