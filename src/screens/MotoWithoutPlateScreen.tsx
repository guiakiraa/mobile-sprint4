import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";
import { useMotoControl } from "@/control/motoControl";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "@/i18n/I18nProvider";

const MotoWithoutPlateScreen = () => {
  const [iotId, setIotId] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [resultado, setResultado] = useState<any | null>(null);
  const { theme } = useTheme();
  const [editingMoto, setEditingMoto] = useState<any | null>(null);
  const [formModelo, setFormModelo] = useState("");
  const [formAno, setFormAno] = useState("");
  const [formPlaca, setFormPlaca] = useState("");
  const [formSetor, setFormSetor] = useState("");
  const { buscarPorIot, atualizar, deletar, loading, error } = useMotoControl();
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
    setMensagem(null);
    setResultado(null);
    if (!iotId) {
      setMensagem(t("moto.noPlate.alerts.missingIotId"));
      return;
    }
    const idNum = Number(iotId);
    if (Number.isNaN(idNum)) {
      setMensagem(t("moto.noPlate.alerts.invalidIotId"));
      return;
    }
    
    const moto = await buscarPorIot(idNum);
    if (moto) {
      setResultado(moto);
    } else if (error) {
      setMensagem(error);
    } else {
      setMensagem(t("moto.noPlate.alerts.notFound"));
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
      setResultado(updated);
      setEditingMoto(null);
      Alert.alert(t("moto.noPlate.alerts.successTitle"), t("moto.noPlate.alerts.successMessage"));
    } else {
      Alert.alert(t("common.error"), t("moto.noPlate.alerts.errorUpdate"));
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
            setResultado(null);
            setMensagem(t("moto.noPlate.alerts.deleted"));
          } else {
            Alert.alert(t("common.error"), t("moto.noPlate.alerts.errorDelete"));
          }
        },
      },
    ]);
  };

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title={t("moto.noPlate.header")} />

      
        <View style={styles.headerBox}>
          <Text style={[styles.title, { color: theme.text }]}>{t("moto.noPlate.title")}</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>{t("moto.noPlate.subtitle")}</Text>
        </View>

        
        <View
          style={[
            styles.inputBox,
            { backgroundColor: theme.card, borderColor: theme.primary },
          ]}
        >
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder={t("moto.noPlate.placeholder")}
            placeholderTextColor="#888"
            value={iotId}
            onChangeText={setIotId}
            keyboardType="number-pad"
          />
        </View>

        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>
            {loading ? t("moto.noPlate.submitting") : t("moto.noPlate.submit")}
          </Text>
        </TouchableOpacity>


        {mensagem && (
          <View
            style={[
              styles.resultBox,
              { borderColor: theme.primary, backgroundColor: theme.card },
            ]}
          >
            <Text style={[styles.resultado, { color: theme.text }]}>
              {mensagem}
            </Text>
          </View>
        )}

      {resultado && (
        <View
          style={[
            styles.resultBox,
            { borderColor: theme.primary, backgroundColor: theme.card },
          ]}
        >
          <Text style={[styles.resultado, { color: theme.text }]}>
            {t("moto.common.plate")}: {resultado.placa}
          </Text>
          <Text style={[styles.resultado, { color: theme.text }]}>
            {t("moto.common.model")}: {getModeloLabel(resultado.modelo) ?? resultado.modelo}
          </Text>
          <Text style={[styles.resultado, { color: theme.text }]}>
            {t("moto.common.year")}: {resultado.ano}
          </Text>
          <Text style={[styles.resultado, { color: theme.text }]}>
            {t("moto.common.sector")}: {resultado.setor ? getSetorLabel(resultado.setor) : t("moto.common.noSector")}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
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
              onPress={() => startEdit(resultado)}
            >
              <Ionicons name="create-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { borderColor: theme.primary }]}
              onPress={() => handleDelete(resultado.id)}
            >
              <Ionicons name="trash-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      </View>
    </ScreenWrapper>
  );
};

export default MotoWithoutPlateScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  headerBox: { alignItems: "center", marginBottom: 25 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  subtitle: { fontSize: 15, marginTop: 6, textAlign: "center" },

  inputBox: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    elevation: 2,
  },
  input: { paddingVertical: 12, fontSize: 16 },

  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },

  resultBox: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  resultado: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  iconButton: {
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
});

// Modal de edição
// Mantém estilo consistente com a outra tela
// Reaproveita inputBox e input já existentes

