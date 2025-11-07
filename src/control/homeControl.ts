import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useAuthControl } from './authControl';
import { useI18n } from '@/i18n/I18nProvider';

export function useHomeControl() {
  const { logout } = useAuthControl();
  const { t } = useI18n();

  const fazerLogout = useCallback(async (navigation: any): Promise<void> => {
    try {
      await logout();
      Alert.alert(t("home.logoutAlert.title"), t("home.logoutAlert.message"));
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (error) {
      console.error("Erro ao fazer logout", error);
      Alert.alert(t("home.logoutAlert.errorTitle"), t("home.logoutAlert.errorMessage"));
    }
  }, [logout, t]);

  const opcoes = useMemo(
    () => [
      { id: "1", titulo: t("home.options.registerMoto"), icone: "business", rota: "CadastroMoto" },
      { id: "2", titulo: t("home.options.locateMoto"), icone: "search", rota: "LocateMoto" },
      { id: "3", titulo: t("home.options.selectSector"), icone: "layers", rota: "SectorSelection" },
      { id: "4", titulo: t("home.options.motoWithoutPlate"), icone: "barcode", rota: "MotoWithoutPlate" },
      { id: "5", titulo: t("home.options.toggleTheme"), icone: "color-palette", rota: "ToggleTheme" },
      { id: "6", titulo: t("home.options.logout"), icone: "log-out", rota: "Logout" },
    ],
    [t]
  );

  return {
    opcoes,
    fazerLogout,
  };
}

export type UseHomeControl = ReturnType<typeof useHomeControl>;
