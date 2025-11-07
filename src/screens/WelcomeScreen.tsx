import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { useAuthControl } from "@/control/authControl";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { scheduleLoginNotification } from "@/Notificacao";
import { useI18n } from "@/i18n/I18nProvider";

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { login: loginAuth, loading, error } = useAuthControl();
  const { t } = useI18n();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");

  
  const handleLogin = async () => {
    if (!username || !senha) {
      Alert.alert(t("common.error"), t("welcome.alerts.missingCredentials"));
      return;
    }

    const result = await loginAuth({ username, senha });
    
    if (result.success) {
      try {
        await scheduleLoginNotification();
      } catch {}
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      Alert.alert(t("common.error"), error || t("welcome.alerts.invalidCredentials"));
    }
  };

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.primary }]}>{t("welcome.title")}</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          {t("welcome.subtitle")}
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
            placeholder={t("welcome.usernamePlaceholder")}
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
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
            placeholder={t("welcome.passwordPlaceholder")}
            placeholderTextColor="#888"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Ionicons name="log-in-outline" size={20} color={theme.buttonText} />
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>
            {loading ? t("welcome.loggingIn") : t("welcome.login")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={[styles.linkText, { color: theme.primary }]}>
            {t("welcome.signupLink")}
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.footerText, { color: theme.text }]}>
          {t("welcome.footer")}
        </Text>
      </View>
    </ScreenWrapper>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
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
