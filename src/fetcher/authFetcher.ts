import apiClient from "../config/apiClient";

export interface LoginRequest {
  username: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  id: number;
}

export interface CadastroRequest {
  username: string;
  senha: string;
  nomeCompleto?: string;
  email?: string;
}

export interface CadastroResponse {
  id: number;
  username: string;
  nomeCompleto?: string;
  email?: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post("/autenticacao/login", credentials);
  return response.data;
};

export const cadastrar = async (usuario: CadastroRequest): Promise<CadastroResponse> => {
  const response = await apiClient.post("/autenticacao/cadastrar", usuario);
  return response.data;
};
