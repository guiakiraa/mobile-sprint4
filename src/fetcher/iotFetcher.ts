import apiClient from "../config/apiClient";
import { Iot, IotCreateRequest } from "../model/Iot";

export const getIots = async (): Promise<Iot[]> => {
  const response = await apiClient.get("/iots");
  return response.data;
};

export const getIotById = async (id: number): Promise<Iot> => {
  const response = await apiClient.get(`/iots/${id}`);
  return response.data;
};

export const createIot = async (iot: IotCreateRequest): Promise<Iot> => {
  const response = await apiClient.post("/iots", iot);
  return response.data;
};

export const updateIot = async (id: number, iot: IotCreateRequest): Promise<Iot> => {
  const response = await apiClient.put(`/iots/${id}`, iot);
  return response.data;
};

export const deleteIot = async (id: number): Promise<void> => {
  await apiClient.delete(`/iots/${id}`);
};
