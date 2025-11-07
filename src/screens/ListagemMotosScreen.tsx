import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";
import { useMotoControl } from "@/control/motoControl";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "@/i18n/I18nProvider";
 

const ListagemMotosScreen = () => {
  const route = useRoute<any>();
  const { theme } = useTheme();
  const { t } = useI18n();

  const setorEnum = route.params?.setor as string | undefined;
  const setorNome = route.params?.displayName as string | undefined;
  const motosParam = (route.params?.motos as any[]) || [];

  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<string | null>(null);
  const [motosOriginais, setMotosOriginais] = useState<any[]>(motosParam);
  const [motosFiltradas, setMotosFiltradas] = useState<any[]>(motosParam);
  const [editingMoto, setEditingMoto] = useState<any | null>(null);
  const [formModelo, setFormModelo] = useState("");
  const [formAno, setFormAno] = useState("");
  const [formPlaca, setFormPlaca] = useState("");
  const [formSetor, setFormSetor] = useState(setorEnum || "");

  const { atualizar, deletar, error } = useMotoControl();

  const filtros = [
    { id: "MOTTU_E", label: t("moto.register.options.model.mottuE"), value: "MOTTU_E" },
    { id: "MOTTU_SPORT", label: t("moto.register.options.model.mottuSport"), value: "MOTTU_SPORT" },
    { id: "MOTTU_POP", label: t("moto.register.options.model.mottuPop"), value: "MOTTU_POP" },
  ];

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

  
  useEffect(() => {
    let filtradas = motosOriginais || [];

    if (search) {
      filtradas = filtradas.filter(
        (m: any) =>
          m.modelo.toLowerCase().includes(search.toLowerCase()) ||
          m.placa.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filtro) {
      filtradas = filtradas.filter((m: any) => m.modelo === filtro);
    }

    setMotosFiltradas(filtradas);
  }, [search, filtro, motosOriginais]);

  const openEdit = (moto: any) => {
    setEditingMoto(moto);
    setFormModelo(moto.modelo?.toString() ?? "");
    setFormAno(moto.ano?.toString() ?? "");
    setFormPlaca(moto.placa?.toString() ?? "");
    setFormSetor((moto.setor?.toString() ?? setorEnum) || "");
  };

  const cancelForm = () => {
    setEditingMoto(null);
  };

  const submitForm = async () => {
    if (!formModelo || !formAno || !formPlaca) {
      Alert.alert(t("common.attention"), t("moto.list.alerts.missingFields"));
      return;
    }
    const anoNum = Number(formAno);
    if (Number.isNaN(anoNum)) {
      Alert.alert(t("common.attention"), t("moto.list.alerts.invalidYear"));
      return;
    }
    
    if (!editingMoto?.id) {
      Alert.alert(t("common.attention"), t("moto.list.alerts.disabledCreate"));
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
      setMotosOriginais((prev) => prev.map((m) => (m.id === editingMoto.id ? updated : m)));
      Alert.alert(t("moto.list.alerts.successTitle"), t("moto.list.alerts.successMessage"));
      setEditingMoto(null);
    } else {
      Alert.alert(t("moto.list.alerts.errorTitle"), error || t("moto.list.alerts.errorUpdate"));
    }
  };

  const removeMoto = async (id: number) => {
    Alert.alert(t("moto.list.alerts.deleteTitle"), t("moto.list.alerts.deleteMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("moto.list.actions.delete"),
        style: "destructive",
        onPress: async () => {
          const sucesso = await deletar(id);
          if (sucesso) {
            setMotosOriginais((prev) => prev.filter((m) => m.id !== id));
            Alert.alert(t("moto.list.alerts.deletedTitle"), t("moto.list.alerts.deletedMessage"));
          } else {
            Alert.alert(t("moto.list.alerts.errorTitle"), error || t("moto.list.alerts.errorDelete"));
          }
        },
      },
    ]);
  };

  if (!setorEnum) {
    return (
      <ScreenWrapper>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.background,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={{ color: theme.text }}>{t("sector.noSelection")}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header
          title={`${t("sector.headerTitle")} - ${(setorNome ?? getSetorLabel(setorEnum)) || ""}`}
        />

        <View style={styles.headerBox}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t("moto.list.title")}
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {t("moto.list.subtitle")}
          </Text>
        </View>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.primary,
            },
          ]}
          placeholder={t("moto.list.searchPlaceholder")}
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filtrosBox}>
          {filtros.map(({ id, label, value }) => (
            <TouchableOpacity
              key={id}
              style={[
                styles.filtroButton,
                {
                  backgroundColor:
                    filtro === value ? theme.primary : theme.card,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() =>
                setFiltro(filtro === value ? null : (value as string))
              }
            >
              <Text
                style={{
                  color: filtro === value ? theme.buttonText : theme.text,
                  fontWeight: "600",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        
        <FlatList
          data={motosFiltradas}
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
                  onPress={() => openEdit(item)}
                >
                  <Ionicons name="create-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { borderColor: theme.primary }]}
                  onPress={() => removeMoto(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={[styles.emptyText, { color: theme.text }]}>
                {t("moto.list.empty")}
              </Text>
            </View>
          }
          style={{ marginTop: 10 }}
        />

        {/* Removido FAB de criação para manter apenas Update/Delete nesta tela */}
      </View>
      <Modal visible={!!editingMoto} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>
              {editingMoto?.id ? t("moto.list.editTitle") : t("moto.list.newTitle")}
            </Text>

            <View style={[styles.input, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <TextInput
                style={{ color: theme.text, fontSize: 16 }}
                placeholder={t("moto.list.form.model")}
                placeholderTextColor="#888"
                value={formModelo}
                onChangeText={setFormModelo}
              />
            </View>

            <View style={[styles.input, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <TextInput
                style={{ color: theme.text, fontSize: 16 }}
                placeholder={t("moto.list.form.year")}
                placeholderTextColor="#888"
                keyboardType="number-pad"
                value={formAno}
                onChangeText={setFormAno}
              />
            </View>

            <View style={[styles.input, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <TextInput
                style={{ color: theme.text, fontSize: 16 }}
                placeholder={t("moto.list.form.plate")}
                placeholderTextColor="#888"
                autoCapitalize="characters"
                value={formPlaca}
                onChangeText={setFormPlaca}
              />
            </View>

            <View style={[styles.input, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <TextInput
                style={{ color: theme.text, fontSize: 16 }}
                placeholder={t("moto.list.form.sector")}
                placeholderTextColor="#888"
                value={formSetor}
                onChangeText={setFormSetor}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, { borderColor: theme.primary }]} onPress={cancelForm}>
                <Text style={{ color: theme.primary, fontWeight: "600" }}>{t("moto.list.actions.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButtonPrimary, { backgroundColor: theme.primary }]} onPress={submitForm}>
                <Text style={{ color: theme.buttonText, fontWeight: "700" }}>{t("moto.list.actions.save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default ListagemMotosScreen;

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

  filtrosBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  filtroButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
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
  emptyText: { fontSize: 16, fontWeight: "600" },

  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
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
