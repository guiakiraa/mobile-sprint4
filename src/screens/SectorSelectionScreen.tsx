import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";
import { useMotoControl } from "@/control/motoControl";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "@/i18n/I18nProvider";

const SectorSelectionScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<string | null>(null);
  const { t } = useI18n();

  const { buscarPorSetor, motos, error } = useMotoControl();

  const setores = [
    {
      nome: "MANUTENCAO",
      displayName: t("sector.sectors.maintenance"),
      icone: "construct-outline",
      cor: "#FFB300",
    },
    {
      nome: "COM_PENDENCIA",
      displayName: t("sector.sectors.pending"),
      icone: "alert-circle-outline",
      cor: "#FF3B30",
    },
    {
      nome: "PRONTA_PARA_ALUGUEL",
      displayName: t("sector.sectors.readyToRent"),
      icone: "checkmark-done-outline",
      cor: "#34C759",
    },
  ];

  const handleSelectSector = async (setorEnum: string, displayName: string) => {
    setLoading(setorEnum);
    try {
      await buscarPorSetor(setorEnum);
      setLoading(null);
      
      if (motos && motos.length > 0) {
        navigation.navigate("ListagemMotos", { 
          setor: setorEnum, 
          displayName: displayName, 
          motos: motos 
        });
      } else {
        Alert.alert(t("common.attention"), t("sector.empty", { name: displayName }));
      }
    } catch (error: any) {
      setLoading(null);
      console.error("Erro ao buscar motos do setor:", error);
      Alert.alert(t("common.error"), error?.message || t("sector.errors.load"));
    }
  };

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title={t("sector.headerTitle")} />

        <View style={styles.headerBox}>
          <Text style={[styles.title, { color: theme.text }]}>{t("sector.title")}</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {t("sector.subtitle")}
          </Text>
        </View>

        {setores.map((sector) => (
          <TouchableOpacity
            key={sector.nome}
            style={[
              styles.button,
              { backgroundColor: theme.card, borderColor: theme.primary },
            ]}
            onPress={() => handleSelectSector(sector.nome, sector.displayName)}
            disabled={loading === sector.nome}
          >
            {loading === sector.nome ? (
              <ActivityIndicator size="small" color={sector.cor} />
            ) : (
              <Ionicons name={sector.icone as any} size={22} color={sector.cor} />
            )}
            <Text style={[styles.buttonText, { color: theme.text }]}>
              {sector.displayName}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.footerBox}>
          <Text style={[styles.footerText, { color: theme.text }]}>
            {t("sector.footer")}
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SectorSelectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  headerBox: { alignItems: "center", marginBottom: 25 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: "center" },

  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 12,
    elevation: 2,
  },
  buttonText: { fontSize: 16, fontWeight: "600" },

  footerBox: { marginTop: 30, alignItems: "center" },
  footerText: { fontSize: 13, fontStyle: "italic", textAlign: "center" },
});
