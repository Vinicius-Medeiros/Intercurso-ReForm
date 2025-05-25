import { CreateEmpresaModel } from "../models/empresa";
import { CrudService } from "./api";

export const EmpresaService = {
    ...CrudService<CreateEmpresaModel,any>("empresas")
    
}


