import { useCallback, useState } from 'react';
import { Iot, IotCreateRequest } from '../model/Iot';
import { iotSchema } from '../model/Iot';
import { iotService } from '../service/iotService';

export function useIotControl() {
  const [iots, setIots] = useState<Iot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const limpar = useCallback(() => {
    setError(null);
  }, []);

  const listar = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const todosIots = await iotService.listar();
      setIots(todosIots);
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao carregar IoTs');
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarPorId = useCallback(async (id: number): Promise<Iot | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const iot = await iotService.buscarPorId(id);
      return iot;
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao buscar IoT');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (iotData: IotCreateRequest): Promise<Iot | null> => {
    setError(null);
    
    try {
      await iotSchema.validate(iotData, { abortEarly: false });
      const novoIot = await iotService.criar(iotData);
      setIots(prev => [...prev, novoIot]);
      return novoIot;
    } catch (err: any) {
      if (err?.inner?.length) {
        const mensagens = err.inner.map((e: any) => e.message).join('\n');
        setError(mensagens);
      } else {
        setError(err?.message ?? 'Erro ao criar IoT');
      }
      return null;
    }
  }, []);

  const atualizar = useCallback(async (id: number, iotData: IotCreateRequest): Promise<Iot | null> => {
    setError(null);
    
    try {
      await iotSchema.validate(iotData, { abortEarly: false });
      const iotAtualizado = await iotService.atualizar(id, iotData);
      setIots(prev => prev.map(i => i.id === id ? iotAtualizado : i));
      return iotAtualizado;
    } catch (err: any) {
      if (err?.inner?.length) {
        const mensagens = err.inner.map((e: any) => e.message).join('\n');
        setError(mensagens);
      } else {
        setError(err?.message ?? 'Erro ao atualizar IoT');
      }
      return null;
    }
  }, []);

  const deletar = useCallback(async (id: number): Promise<boolean> => {
    setError(null);
    
    try {
      await iotService.deletar(id);
      setIots(prev => prev.filter(i => i.id !== id));
      return true;
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao deletar IoT');
      return false;
    }
  }, []);

  return {
    iots,
    loading,
    error,
    limpar,
    listar,
    buscarPorId,
    criar,
    atualizar,
    deletar,
  };
}

export type UseIotControl = ReturnType<typeof useIotControl>;
