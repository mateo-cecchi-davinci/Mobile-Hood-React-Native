import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Usamos iconos de Expo

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar..."
        value={searchText}
        onChangeText={setSearchText} // Captura el texto del input
      />
      <Ionicons name="search" size={20} color="#999" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 30,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 60,
  },
  icon: {
    marginRight: 10,
    color: "#ffffff",
    backgroundColor: "#e31010",
    padding: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  stores: {
    fontWeight: "bold",
  },
});
