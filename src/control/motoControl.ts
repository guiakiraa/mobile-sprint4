import { useCallback, useState } from 'react';
import { Moto, MotoCreateRequest } from '../model/Moto';
import { motoSchema } from '../model/Moto';
import { motoService } from '../service/motoService';
import { Alert } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';

export function useMotoControl() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const { t } = useI18n();

  const limpar = useCallback(() => {
    setError(null);
    setSearched(false);
  }, []);

  const buscarPorPlaca = useCallback(async (placa: string): Promise<Moto | null> => {
    if (!placa) {
      Alert.alert(t('common.attention'), t('moto.locate.alerts.missingPlate'));
      return null;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const moto = await motoService.buscarPorPlaca(placa.toUpperCase());
      return moto;
    } catch (err: any) {
      setError(err?.message ?? t('moto.errors.fetchByPlate'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [t]);

  const buscarPorIot = useCallback(async (iotId: number): Promise<Moto | null> => {
    if (!iotId) {
      Alert.alert(t('common.attention'), t('moto.noPlate.alerts.missingIotId'));
      return null;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const moto = await motoService.buscarPorIot(iotId);
      return moto;
    } catch (err: any) {
      setError(err?.message ?? t('moto.errors.fetchByIot'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [t]);

  const buscarPorSetor = useCallback(async (setor: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const motosSetor = await motoService.buscarPorSetor(setor);
      setMotos(motosSetor);
    } catch (err: any) {
      setError(err?.message ?? t('moto.errors.fetchBySector'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const listar = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const todasMotos = await motoService.listar();
      setMotos(todasMotos);
    } catch (err: any) {
      setError(err?.message ?? t('moto.errors.loadAll'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const criar = useCallback(async (motoData: MotoCreateRequest): Promise<Moto | null> => {
    setError(null);
    
    try {
      await motoSchema.validate(motoData, { abortEarly: false });
      const novaMoto = await motoService.criar(motoData);
      setMotos(prev => [...prev, novaMoto]);
      return novaMoto;
    } catch (err: any) {
      if (err?.inner?.length) {
        const mensagens = err.inner.map((e: any) => e.message).join('\n');
        setError(mensagens);
      } else {
        setError(err?.message ?? t('moto.errors.create'));
      }
      return null;
    }
  }, [t]);

  const atualizar = useCallback(async (id: number, motoData: MotoCreateRequest): Promise<Moto | null> => {
    setError(null);
    
    try {
      await motoSchema.validate(motoData, { abortEarly: false });
      const motoAtualizada = await motoService.atualizar(id, motoData);
      setMotos(prev => prev.map(m => m.id === id ? motoAtualizada : m));
      return motoAtualizada;
    } catch (err: any) {
      if (err?.inner?.length) {
        const mensagens = err.inner.map((e: any) => e.message).join('\n');
        setError(mensagens);
      } else {
        setError(err?.message ?? t('moto.errors.update'));
      }
      return null;
    }
  }, [t]);

  const deletar = useCallback(async (id: number): Promise<boolean> => {
    setError(null);
    
    try {
      await motoService.deletar(id);
      setMotos(prev => prev.filter(m => m.id !== id));
      return true;
    } catch (err: any) {
      setError(err?.message ?? t('moto.errors.delete'));
      return false;
    }
  }, [t]);

  return {
    motos,
    loading,
    error,
    searched,
    limpar,
    buscarPorPlaca,
    buscarPorIot,
    buscarPorSetor,
    listar,
    criar,
    atualizar,
    deletar,
  };
}

export type UseMotoControl = ReturnType<typeof useMotoControl>;
