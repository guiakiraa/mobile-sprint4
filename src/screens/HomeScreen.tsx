import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { useHomeControl } from "@/control/homeControl";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "@/i18n/I18nProvider";

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { theme, toggleTheme } = useTheme();
  const { opcoes, fazerLogout } = useHomeControl();
  const { t, locale, setLocale } = useI18n();

  const handleChangeLanguage = () => {
    Alert.alert(t("home.language.title"), undefined, [
      {
        text: t("home.language.portuguese"),
        onPress: () => setLocale("pt-BR"),
      },
      {
        text: t("home.language.spanish"),
        onPress: () => setLocale("es-ES"),
      },
      {
        text: t("common.cancel"),
        style: "cancel",
      },
    ]);
  };

  const languageTag =
    locale === "pt-BR"
      ? t("home.language.portugueseShort")
      : t("home.language.spanishShort");

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.primary },
      ]}
      onPress={() => {
        if (item.rota === "Logout") {
          fazerLogout(navigation);
        } else if (item.rota === "ToggleTheme") {
          toggleTheme();
        } else {
          navigation.navigate(item.rota);
        }
      }}
    >
      <Ionicons name={item.icone as any} size={36} color={theme.primary} />
      <Text style={[styles.cardText, { color: theme.text }]}>{item.titulo}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.primary }]}>
            {t("home.welcomeTitle")}
          </Text>
          <TouchableOpacity
            style={[styles.languageButton, { borderColor: theme.primary }]}
            onPress={handleChangeLanguage}
            activeOpacity={0.8}
          >
            <Ionicons name="language" size={18} color={theme.primary} />
            <Text style={[styles.languageButtonLabel, { color: theme.text }]}>
              {t("home.language.button")}
            </Text>
            <View style={[styles.languageTag, { backgroundColor: theme.primary }]}>
              <Text style={[styles.languageTagText, { color: theme.buttonText }]}>
                {languageTag}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={opcoes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={styles.grid}
          ListEmptyComponent={
            <Text style={{ color: theme.text, textAlign: "center" }}>
              {t("home.noOptions")}
            </Text>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  languageButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  languageTag: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  languageTagText: {
    fontSize: 12,
    fontWeight: "700",
  },
  grid: { paddingBottom: 30 },
  card: {
    flex: 1,
    margin: 10,
    padding: 22,
    borderWidth: 2,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    minHeight: 130,
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
