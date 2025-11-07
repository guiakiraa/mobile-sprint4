import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";
import { useMotoControl } from "@/control/motoControl";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons"; 
import { useI18n } from "@/i18n/I18nProvider";

const LocateMotoScreen = () => {
  const [plate, setPlate] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [editingMoto, setEditingMoto] = useState<any | null>(null);
  const [formModelo, setFormModelo] = useState("");
  const [formAno, setFormAno] = useState("");
  const [formPlaca, setFormPlaca] = useState("");
  const [formSetor, setFormSetor] = useState("");
  const { theme } = useTheme();
  const { buscarPorPlaca, atualizar, deletar, loading, error, searched } = useMotoControl();
  const { t } = useI18n();

  const modeloLabels: Record<string, string> = {
    MOTTU_E: t("moto.register.options.model.mottuE"),
    MOTTU_SPORT: t("moto.register.options.model.mottuSport"),
    MOTTU_POP: t("moto.register.options.model.mottuPop"),
  };

  const setorLabels: Record<string, string> = {
    MANUTENCAO: t("sector.sectors.maintenance"),
    COM_PENDENCIA: t("sector.sectors.pending"),
    PRONTA_PARA_ALUGUEL: t("sector.sectors.readyToRent"),
  };

  const getModeloLabel = (value?: string) => (value ? modeloLabels[value] ?? value : value);
  const getSetorLabel = (value?: string) => (value ? setorLabels[value] ?? value : value);

  const handleSearch = async () => {
    const moto = await buscarPorPlaca(plate);
    setResultados(moto ? [moto] : []);
    if (!moto && !error) {
      Alert.alert(t("moto.locate.alerts.notFoundTitle"), t("moto.locate.alerts.notFoundMessage"));
    }
    if (error) {
      Alert.alert(t("common.error"), error);
    }
  };

  const startEdit = (moto: any) => {
    setEditingMoto(moto);
    setFormModelo(moto.modelo?.toString() ?? "");
    setFormAno(moto.ano?.toString() ?? "");
    setFormPlaca(moto.placa?.toString() ?? "");
    setFormSetor(moto.setor?.toString() ?? "");
  };

  const cancelEdit = () => {
    setEditingMoto(null);
  };

  const saveEdit = async () => {
    if (!editingMoto) return;
    if (!formModelo || !formAno || !formPlaca) {
      Alert.alert(t("common.attention"), t("moto.locate.alerts.missingFields"));
      return;
    }
    const anoNum = Number(formAno);
    if (Number.isNaN(anoNum)) {
      Alert.alert(t("common.attention"), t("moto.locate.alerts.invalidYear"));
      return;
    }
    
    const body = {
      modelo: formModelo,
      ano: anoNum,
      placa: formPlaca.toUpperCase(),
      setor: formSetor || undefined,
    };
    
    const updated = await atualizar(editingMoto.id, body);
    if (updated) {
      setResultados((prev) => prev.map((m) => (m.id === editingMoto.id ? updated : m)));
      setEditingMoto(null);
      Alert.alert(t("moto.locate.alerts.successTitle"), t("moto.locate.alerts.successMessage"));
    } else {
      Alert.alert(t("common.error"), t("moto.locate.alerts.errorUpdate"));
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(t("moto.confirm.title"), t("moto.confirm.deleteMessage"), [
      { text: t("moto.confirm.cancel"), style: "cancel" },
      {
        text: t("moto.confirm.delete"),
        style: "destructive",
        onPress: async () => {
          const sucesso = await deletar(id);
          if (sucesso) {
            setResultados((prev) => prev.filter((m) => m.id !== id));
            Alert.alert(t("common.success"), t("moto.locate.alerts.deleted"));
          } else {
            Alert.alert(t("common.error"), t("moto.locate.alerts.errorDelete"));
          }
        },
      },
    ]);
  };

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title={t("moto.locate.header")} />


        <View style={styles.headerBox}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t("moto.locate.title")}
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {t("moto.locate.subtitle")}
          </Text>
        </View>


        <View
          style={[
            styles.inputBox,
            { backgroundColor: theme.card, borderColor: theme.primary },
          ]}
        >
          <Ionicons
            name="search"
            size={22}
            color={theme.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder={t("moto.locate.placeholder")}
            placeholderTextColor="#888"
            value={plate}
            onChangeText={setPlate}
            autoCapitalize="characters"
          />
        </View>


        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSearch}
        >
          <Ionicons name="search-outline" size={20} color={theme.buttonText} />
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>
            {t("moto.locate.submit")}
          </Text>
        </TouchableOpacity>


        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.primary },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: theme.primary }]}>
                  {item.placa}
                </Text>
                <Text style={{ color: theme.text, fontSize: 15 }}>
                  {t("moto.common.model")}: {getModeloLabel(item.modelo) ?? item.modelo}
                </Text>
                <Text style={{ color: theme.text, fontSize: 15 }}>
                  {t("moto.common.year")}: {item.ano}
                </Text>
                <Text style={{ color: theme.text, fontSize: 15 }}>
                  {t("moto.common.sector")}: {item.setor ? getSetorLabel(item.setor) : t("moto.common.noSector")}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.iconButton, { borderColor: theme.primary }]}
                  onPress={() => {
                    // Simular som - não precisa fazer nada
                    Alert.alert(t("moto.common.soundTitle"), t("moto.common.soundMessage"));
                  }}
                >
                  <Ionicons name="volume-high-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { borderColor: theme.primary }]}
                  onPress={() => {
                    // Simular LED - não precisa fazer nada
                    Alert.alert(t("moto.common.ledTitle"), t("moto.common.ledMessage"));
                  }}
                >
                  <Ionicons name="flashlight-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { borderColor: theme.primary }]}
                  onPress={() => startEdit(item)}
                >
                  <Ionicons name="create-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { borderColor: theme.primary }]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            searched && resultados.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="alert-circle" size={32} color={theme.primary} />
                <Text style={[styles.emptyText, { color: theme.text }]}>
                  {t("moto.locate.empty")}
                </Text>
              </View>
            ) : null
          }
          style={{ marginTop: 20 }}
        />
      </View>

      <Modal visible={!!editingMoto} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>{t("moto.locate.editTitle")}</Text>

            <View style={[styles.inputBox, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t("moto.locate.form.model")}
                placeholderTextColor="#888"
                value={formModelo}
                onChangeText={setFormModelo}
              />
            </View>

            <View style={[styles.inputBox, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t("moto.locate.form.year")}
                placeholderTextColor="#888"
                keyboardType="number-pad"
                value={formAno}
                onChangeText={setFormAno}
              />
            </View>

            <View style={[styles.inputBox, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t("moto.locate.form.plate")}
                placeholderTextColor="#888"
                autoCapitalize="characters"
                value={formPlaca}
                onChangeText={setFormPlaca}
              />
            </View>

            <View style={[styles.inputBox, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t("moto.locate.form.sector")}
                placeholderTextColor="#888"
                value={formSetor}
                onChangeText={setFormSetor}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, { borderColor: theme.primary }]} onPress={cancelEdit}>
                <Text style={{ color: theme.primary, fontWeight: "600" }}>{t("moto.list.actions.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButtonPrimary, { backgroundColor: theme.primary }]} onPress={saveEdit}>
                <Text style={{ color: theme.buttonText, fontWeight: "700" }}>{t("moto.list.actions.save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default LocateMotoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerBox: { alignItems: "center", marginBottom: 25 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  subtitle: { fontSize: 15, marginTop: 6, textAlign: "center" },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
    elevation: 2,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 10, fontSize: 16 },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    gap: 8,
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },

  actions: { justifyContent: "center", gap: 8, marginLeft: 12, flexDirection: "row", flexWrap: "wrap" },
  iconButton: {
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },

  emptyBox: { alignItems: "center", marginTop: 30 },
  emptyText: { fontSize: 16, fontWeight: "600", marginTop: 10 },

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
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  modalButtonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});
