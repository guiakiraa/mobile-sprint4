import * as yup from 'yup';

export interface Iot {
  id: number;
  moto?: {
    id: number;
  };
}

export interface IotCreateRequest {
  moto?: {
    id: number;
  };
}

export const iotSchema: yup.ObjectSchema<IotCreateRequest> = yup
  .object({
    moto: yup.object({
      id: yup.number().required('ID da moto é obrigatório'),
    }).optional(),
  })
  .required();
