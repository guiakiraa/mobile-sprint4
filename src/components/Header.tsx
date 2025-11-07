import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
      >
        <Ionicons name="arrow-back" size={24} color={theme.buttonText} />
      </TouchableOpacity>


      {title && (
        <Text style={[styles.title, { color: theme.buttonText }]}>{title}</Text>
      )}

      
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.iconButton}
      >
        <Ionicons name="home" size={24} color={theme.buttonText} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    marginBottom: 30, 
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 10,
    borderRadius: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
