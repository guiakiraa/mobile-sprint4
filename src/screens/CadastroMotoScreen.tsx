import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, Modal } from "react-native";
import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";
import { useMotoControl } from "@/control/motoControl";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useI18n } from "@/i18n/I18nProvider";

const CadastroMotoScreen = () => {
  const { theme } = useTheme();
  const { t } = useI18n();
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [placa, setPlaca] = useState("");
  const [setor, setSetor] = useState("");
  const [showModeloPicker, setShowModeloPicker] = useState(false);
  const [showSetorPicker, setShowSetorPicker] = useState(false);

  const { criar, loading, error } = useMotoControl();

  const modeloOptions = ["MOTTU_E", "MOTTU_SPORT", "MOTTU_POP"];
  const setorOptions = ["MANUTENCAO", "COM_PENDENCIA", "PRONTA_PARA_ALUGUEL"];

  const modeloLabels: Record<string, string> = {
    MOTTU_E: t("moto.register.options.model.mottuE"),
    MOTTU_SPORT: t("moto.register.options.model.mottuSport"),
    MOTTU_POP: t("moto.register.options.model.mottuPop"),
  };

  const setorLabels: Record<string, string> = {
    MANUTENCAO: t("moto.register.options.sector.maintenance"),
    COM_PENDENCIA: t("moto.register.options.sector.pending"),
    PRONTA_PARA_ALUGUEL: t("moto.register.options.sector.readyToRent"),
  };

  const getModeloLabel = (value?: string) =>
    value ? modeloLabels[value] ?? value : "";
  const getSetorLabel = (value?: string) =>
    value ? setorLabels[value] ?? value : "";

  const handleSubmit = async () => {
    if (!modelo || !ano || !placa || !setor) {
      Alert.alert(t("common.attention"), t("moto.register.alerts.missingFields"));
      return;
    }
    const anoNum = Number(ano);
    if (Number.isNaN(anoNum)) {
      Alert.alert(t("common.attention"), t("moto.register.alerts.invalidYear"));
      return;
    }
    
    const body = {
      modelo: modelo,
      ano: anoNum,
      placa: placa.toUpperCase(),
      setor: setor,
    };
    
    const novaMoto = await criar(body);
    if (novaMoto) {
      Alert.alert(t("moto.register.alerts.successTitle"), t("moto.register.alerts.successMessage"));
      setModelo("");
      setAno("");
      setPlaca("");
      setSetor("");
    } else {
      Alert.alert(t("moto.register.alerts.errorTitle"), error || t("moto.register.alerts.errorMessage"));
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Header title={t("moto.register.header")} />

            <View style={styles.headerBox}>
              <Text style={[styles.title, { color: theme.text }]}>{t("moto.register.title")}</Text>
              <Text style={[styles.subtitle, { color: theme.text }]}>{t("moto.register.subtitle")}</Text>
            </View>

            <TouchableOpacity
              style={[styles.input, { backgroundColor: theme.card, borderColor: theme.primary, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
              onPress={() => setShowModeloPicker(true)}
              activeOpacity={0.8}
            >
              <Text style={{ color: modelo ? theme.text : "#888", fontSize: 16 }}>
                {modelo ? getModeloLabel(modelo) : t("moto.register.modelPlaceholder")}
              </Text>
              <Text style={{ color: theme.text, opacity: 0.6 }}>▼</Text>
            </TouchableOpacity>

            <View style={[styles.input, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <TextInput
                style={{ color: theme.text, fontSize: 16 }}
                placeholder={t("moto.register.yearPlaceholder")}
                placeholderTextColor="#888"
                keyboardType="number-pad"
                value={ano}
                onChangeText={setAno}
              />
            </View>

            <View style={[styles.input, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <TextInput
                style={{ color: theme.text, fontSize: 16 }}
                placeholder={t("moto.register.platePlaceholder")}
                placeholderTextColor="#888"
                autoCapitalize="characters"
                value={placa}
                onChangeText={setPlaca}
              />
            </View>

            <TouchableOpacity
              style={[styles.input, { backgroundColor: theme.card, borderColor: theme.primary, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
              onPress={() => setShowSetorPicker(true)}
              activeOpacity={0.8}
            >
              <Text style={{ color: setor ? theme.text : "#888", fontSize: 16 }}>
                {setor ? getSetorLabel(setor) : t("moto.register.sectorPlaceholder")}
              </Text>
              <Text style={{ color: theme.text, opacity: 0.6 }}>▼</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={{ color: theme.buttonText, fontWeight: "700", fontSize: 16 }}>
                {loading ? t("moto.register.submitting") : t("moto.register.submit")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showModeloPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>{t("moto.register.pickers.modelTitle")}</Text>
            {modeloOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.optionItem, { borderColor: theme.primary }]}
                onPress={() => {
                  setModelo(opt);
                  setShowModeloPicker(false);
                }}
              >
                <Text style={{ color: theme.text, fontSize: 16 }}>{getModeloLabel(opt)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.modalButton, { borderColor: theme.primary }]} onPress={() => setShowModeloPicker(false)}>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>{t("moto.register.pickers.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSetorPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>{t("moto.register.pickers.sectorTitle")}</Text>
            {setorOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.optionItem, { borderColor: theme.primary }]}
                onPress={() => {
                  setSetor(opt);
                  setShowSetorPicker(false);
                }}
              >
                <Text style={{ color: theme.text, fontSize: 16 }}>{getSetorLabel(opt)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.modalButton, { borderColor: theme.primary }]} onPress={() => setShowSetorPicker(false)}>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>{t("moto.register.pickers.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default CadastroMotoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  headerBox: { alignItems: "center", marginBottom: 25 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  subtitle: { fontSize: 15, marginTop: 6, textAlign: "center" },

  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 6,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  optionItem: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  modalButton: {
    alignSelf: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    marginTop: 4,
  },
});
