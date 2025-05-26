import { EmpresaModal } from "./empresa";
import { MaterialModal } from "./material";


export interface Contract {
    id: number;
    comprador: EmpresaModal;
    vendedor: EmpresaModal;
    quantidade: number;
    valorTotal: number;
    material: MaterialModal;
}