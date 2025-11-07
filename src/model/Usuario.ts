import * as yup from 'yup';

export interface Usuario {
  id: number;
  nome?: string;
  email?: string;
}

export const usuarioSchema: yup.ObjectSchema<Omit<Usuario, 'id'>> = yup
  .object({
    nome: yup.string().optional(),
    email: yup.string().email('Email inválido').optional(),
  })
  .required();
