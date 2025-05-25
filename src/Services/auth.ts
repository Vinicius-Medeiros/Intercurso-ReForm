import { LoginModal } from "../models/auth";
import { EmpresaModal } from "../models/empresa";
import { api } from "./api";

export const Login = async (data: LoginModal) => await api.post<EmpresaModal>("/authentication/login",data)
