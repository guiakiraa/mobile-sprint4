import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '@/i18n/I18nProvider';

export default function SobreAppScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { t } = useI18n();

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const commitHash = Constants.expoConfig?.extra?.commitHash ?? 'desconhecido';

  return (
    <ScreenWrapper>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <Header title={t('about.title')} />

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.section}>
            <Ionicons name="git-commit-outline" size={24} color={theme.primary} style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.text, { color: theme.text }]}>
                {t('about.version') ?? 'Versão'}: <Text style={{ fontWeight: 'bold' }}>{version}</Text>
              </Text>
              <Text style={[styles.text, { color: theme.text, marginTop: 8 }]}>
                {t('about.commit') ?? 'Commit'}: <Text style={{ fontWeight: 'bold' }}>{commitHash}</Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.backButton, { borderColor: theme.primary, backgroundColor: theme.background }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="arrow-back-outline" size={20} color={theme.text} />
            <Text style={[styles.buttonText, { color: theme.text }]}>
              {t('about.actions.backHome')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 20, paddingBottom: 100 },
  section: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  icon: { marginRight: 12, marginTop: 4 },
  text: { flex: 1, fontSize: 16, lineHeight: 22 },
  backButton: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    borderRadius: 12, paddingVertical: 14, borderWidth: 1, marginTop: 16,
  },
  buttonText: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
});

