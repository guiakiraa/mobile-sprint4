import apiClient from "../config/apiClient";
import { Moto, MotoCreateRequest } from "../model/Moto";

export const getMotos = async (): Promise<Moto[]> => {
  const response = await apiClient.get("/motos");
  return response.data;
};

export const getMotoById = async (id: number): Promise<Moto> => {
  const response = await apiClient.get(`/motos/${id}`);
  return response.data;
};

export const getMotoByPlaca = async (placa: string): Promise<Moto> => {
  const response = await apiClient.get(`/motos/placa/${placa}`);
  return response.data;
};

export const getMotosBySetor = async (setor: string): Promise<Moto[]> => {
  const response = await apiClient.get(`/motos/setor/${setor}`);
  return response.data;
};

export const getMotoByIot = async (iotId: number): Promise<Moto> => {
  const response = await apiClient.get(`/motos/por-iot/${iotId}`);
  return response.data;
};

export const createMoto = async (moto: MotoCreateRequest): Promise<Moto> => {
  const response = await apiClient.post("/motos", moto);
  return response.data;
};

export const updateMoto = async (id: number, moto: MotoCreateRequest): Promise<Moto> => {
  const response = await apiClient.put(`/motos/${id}`, moto);
  return response.data;
};

export const deleteMoto = async (id: number): Promise<void> => {
  await apiClient.delete(`/motos/${id}`);
};
