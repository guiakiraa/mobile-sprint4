import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { useAuthControl } from "@/control/authControl";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "@/i18n/I18nProvider";

const CadastroScreen = () => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { cadastrar: cadastrarAuth, loading, error } = useAuthControl();
  const { t } = useI18n();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleCadastro = async () => {
    if (!nomeCompleto || !email || !username || !senha || !confirmarSenha) {
      Alert.alert(t("common.error"), t("auth.register.alerts.missingFields"));
      return;
    }

    if (nomeCompleto.length < 3) {
      Alert.alert(t("common.error"), t("auth.register.alerts.shortName"));
      return;
    }

    if (username.length < 3) {
      Alert.alert(t("common.error"), t("auth.register.alerts.shortUsername"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t("common.error"), t("auth.register.alerts.invalidEmail"));
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(t("common.error"), t("auth.register.alerts.passwordMismatch"));
      return;
    }

    if (senha.length < 6) {
      Alert.alert(t("common.error"), t("auth.register.alerts.weakPassword"));
      return;
    }

    const result = await cadastrarAuth({ nomeCompleto, email, username, senha });

    if (result.success) {
      Alert.alert(
        t("auth.register.alerts.successTitle"),
        t("auth.register.alerts.successMessage"),
        [
          {
            text: t("common.ok"),
            onPress: () => navigation.navigate("Welcome"),
          },
        ]
      );
    } else {
      Alert.alert(t("common.error"), error || t("auth.register.alerts.errorFallback"));
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: theme.primary }]}>
            {t("auth.register.title")}
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {t("auth.register.subtitle")}
          </Text>

          <View
            style={[
              styles.inputBox,
              { backgroundColor: theme.card, borderColor: theme.primary },
            ]}
          >
            <Ionicons name="person-outline" size={20} color={theme.primary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder={t("auth.register.namePlaceholder")}
              placeholderTextColor="#888"
              value={nomeCompleto}
              onChangeText={setNomeCompleto}
              autoCapitalize="words"
            />
          </View>

          <View
            style={[
              styles.inputBox,
              { backgroundColor: theme.card, borderColor: theme.primary },
            ]}
          >
            <Ionicons name="mail-outline" size={20} color={theme.primary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder={t("auth.register.emailPlaceholder")}
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View
            style={[
              styles.inputBox,
              { backgroundColor: theme.card, borderColor: theme.primary },
            ]}
          >
            <Ionicons name="person-outline" size={20} color={theme.primary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder={t("auth.register.usernamePlaceholder")}
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View
            style={[
              styles.inputBox,
              { backgroundColor: theme.card, borderColor: theme.primary },
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color={theme.primary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder={t("auth.register.passwordPlaceholder")}
              placeholderTextColor="#888"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <View
            style={[
              styles.inputBox,
              { backgroundColor: theme.card, borderColor: theme.primary },
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color={theme.primary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder={t("auth.register.confirmPasswordPlaceholder")}
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleCadastro}
            disabled={loading}
          >
            <Ionicons name="person-add-outline" size={20} color={theme.buttonText} />
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>
              {loading ? t("auth.register.submitting") : t("auth.register.submit")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("Welcome")}
          >
            <Text style={[styles.linkText, { color: theme.primary }]}>
            {t("auth.register.loginLink")}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.footerText, { color: theme.text }]}>
          {t("auth.register.footer")}
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default CadastroScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 24,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
    gap: 8,
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 30,
    fontSize: 13,
    textAlign: "center",
    fontStyle: "italic",
  },
});

