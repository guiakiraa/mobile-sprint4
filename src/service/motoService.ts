import { Moto, MotoCreateRequest } from "../model/Moto";
import { 
  getMotos, 
  getMotoById, 
  getMotoByPlaca, 
  getMotosBySetor, 
  getMotoByIot,
  createMoto, 
  updateMoto, 
  deleteMoto 
} from "../fetcher/motoFetcher";

export const motoService = {
  listar: () => getMotos(),
  buscarPorId: (id: number) => getMotoById(id),
  buscarPorPlaca: (placa: string) => getMotoByPlaca(placa),
  buscarPorSetor: (setor: string) => getMotosBySetor(setor),
  buscarPorIot: (iotId: number) => getMotoByIot(iotId),
  criar: (moto: MotoCreateRequest) => createMoto(moto),
  atualizar: (id: number, moto: MotoCreateRequest) => updateMoto(id, moto),
  deletar: (id: number) => deleteMoto(id),
};
