import React, { useEffect } from "react";
import AppNavigator from "@/navigation/AppNavigator";
import { ThemeProvider } from "@/context/ThemeContext";
import { PrincipalProvider } from "@/context/PrincipalContext";
import { I18nProvider } from "@/i18n/I18nProvider";
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Padrão',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }, []);

  return (
    <PrincipalProvider>
      <ThemeProvider>
        <I18nProvider>
          <AppNavigator />
        </I18nProvider>
      </ThemeProvider>
    </PrincipalProvider>
  );
}
