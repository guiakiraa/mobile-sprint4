import * as yup from 'yup';

export interface Moto {
  id: number;
  modelo: string;
  ano: number;
  placa: string;
  setor?: string;
}

export interface MotoCreateRequest {
  modelo: string;
  ano: number;
  placa: string;
  setor?: string;
}

export const motoSchema: yup.ObjectSchema<MotoCreateRequest> = yup
  .object({
    modelo: yup.string().required('Modelo é obrigatório'),
    ano: yup
      .number()
      .typeError('Ano deve ser numérico')
      .integer('Ano deve ser inteiro')
      .min(1900, 'Ano mínimo é 1900')
      .max(new Date().getFullYear() + 1, 'Ano inválido')
      .required('Ano é obrigatório'),
    placa: yup
      .string()
      .matches(/^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/i, 'Placa inválida')
      .required('Placa é obrigatória'),
    setor: yup.string().optional(),
  })
  .required();
