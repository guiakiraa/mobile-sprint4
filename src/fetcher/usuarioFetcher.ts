import apiClient from "../config/apiClient";
import { Usuario } from "../model/Usuario";

export const getUsuarioById = async (id: number): Promise<Usuario> => {
  const response = await apiClient.get(`/usuarios/${id}`);
  return response.data;
};
