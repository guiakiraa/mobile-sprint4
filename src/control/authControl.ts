import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../service/authService';
import { LoginRequest, CadastroRequest } from '../fetcher/authFetcher';
import { useI18n } from '@/i18n/I18nProvider';

export function useAuthControl() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  const limpar = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<{ success: boolean; token?: string; id?: number }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      await AsyncStorage.setItem("token", response.token);
      if (response.id) {
        await AsyncStorage.setItem("userId", response.id.toString());
      }
      return { success: true, token: response.token, id: response.id };
    } catch (err: any) {
      setError(err?.message ?? t('auth.errors.login'));
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [t]);

  const cadastrar = useCallback(async (usuario: CadastroRequest): Promise<{ success: boolean; id?: number }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.cadastrar(usuario);
      return { success: true, id: response.id };
    } catch (err: any) {
      setError(err?.message ?? t('auth.errors.register'));
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [t]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }, []);

  return {
    loading,
    error,
    limpar,
    login,
    cadastrar,
    logout,
  };
}

export type UseAuthControl = ReturnType<typeof useAuthControl>;
