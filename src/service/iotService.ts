import { Iot, IotCreateRequest } from "../model/Iot";
import { 
  getIots, 
  getIotById, 
  createIot, 
  updateIot, 
  deleteIot 
} from "../fetcher/iotFetcher";

export const iotService = {
  listar: () => getIots(),
  buscarPorId: (id: number) => getIotById(id),
  criar: (iot: IotCreateRequest) => createIot(iot),
  atualizar: (id: number, iot: IotCreateRequest) => updateIot(id, iot),
  deletar: (id: number) => deleteIot(id),
};
