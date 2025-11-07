import { Usuario } from "../model/Usuario";
import { getUsuarioById } from "../fetcher/usuarioFetcher";

export const usuarioService = {
  buscarPorId: (id: number) => getUsuarioById(id),
};
