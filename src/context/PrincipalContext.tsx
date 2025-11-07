import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PrincipalContextType {
  token: string | null;
  usuario: string | null;
  isAuthenticated: boolean;
  setProfile: (token: string, usuario: string | null) => void;
  clearProfile: () => void;
  loading: boolean;
}

const PrincipalContext = createContext<PrincipalContextType | undefined>(undefined);

export const usePrincipalContext = () => {
  const context = useContext(PrincipalContext);
  if (!context) {
    throw new Error('usePrincipalContext deve ser usado dentro de PrincipalProvider');
  }
  return context;
};

interface PrincipalProviderProps {
  children: React.ReactNode;
}

export const PrincipalProvider: React.FC<PrincipalProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setProfile = useCallback(async (newToken: string, newUsuario: string | null) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      setToken(newToken);
      setUsuario(newUsuario);
    } catch (error) {
      console.error("Erro ao salvar token:", error);
    }
  }, []);

  const clearProfile = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
      setUsuario(null);
    } catch (error) {
      console.error("Erro ao limpar token:", error);
    }
  }, []);

  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          // Aqui você poderia buscar os dados do usuário baseado no token
          // setUsuario(userData.email);
        }
      } catch (error) {
        console.error("Erro ao carregar token:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredToken();
  }, []);

  const value: PrincipalContextType = {
    token,
    usuario,
    isAuthenticated: !!token,
    setProfile,
    clearProfile,
    loading,
  };

  return (
    <PrincipalContext.Provider value={value}>
      {children}
    </PrincipalContext.Provider>
  );
};
