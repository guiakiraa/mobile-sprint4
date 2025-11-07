import { LoginRequest, LoginResponse, CadastroRequest, CadastroResponse } from "../fetcher/authFetcher";
import { login, cadastrar } from "../fetcher/authFetcher";

export const authService = {
  login: (credentials: LoginRequest) => login(credentials),
  cadastrar: (usuario: CadastroRequest) => cadastrar(usuario),
};
