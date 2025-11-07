import { useCallback, useState } from 'react';
import { Usuario } from '../model/Usuario';
import { usuarioService } from '../service/usuarioService';

export function useUsuarioControl() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const limpar = useCallback(() => {
    setUsuario(null);
    setError(null);
  }, []);

  const buscarPorId = useCallback(async (id: number): Promise<Usuario | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const usuarioEncontrado = await usuarioService.buscarPorId(id);
      setUsuario(usuarioEncontrado);
      return usuarioEncontrado;
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao buscar usuário');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    usuario,
    loading,
    error,
    limpar,
    buscarPorId,
  };
}

export type UseUsuarioControl = ReturnType<typeof useUsuarioControl>;
