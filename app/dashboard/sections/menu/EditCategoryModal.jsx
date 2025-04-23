import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.APP_URL;

export default function EditCategoryModal({
  visible,
  onClose,
  setBusiness,
  selectedCategory,
  setSelectedCategory,
}) {
  const [name, setName] = useState(selectedCategory.name);

  const editCategory = async () => {
    if (!name || !name.trim()) {
      alert("El nombre de la categoría no puede estar vacío");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/editCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedCategory.id,
          name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBusiness((prev) => {
          const updatedCategories = prev.categories.map((category) =>
            category.id === data.category.id
              ? { ...category, name: data.category.name }
              : category
          );

          return { ...prev, categories: updatedCategories };
        });

        setSelectedCategory((prev) => {
          return { ...prev, name: data.category.name };
        });

        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.title}>Editar categoría</Text>
            <AntDesign
              name="close"
              size={24}
              color="black"
              style={styles.icon}
              onPress={onClose}
            />
            <View style={styles.line}></View>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              numberOfLines={1}
              ellipsizeMode="tail"
              placeholder="Nombre*"
            />
            <View style={styles.line}></View>
            <TouchableOpacity onPress={() => editCategory()} style={styles.btn}>
              <Text style={styles.btn_text}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  title: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  icon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "#dee2e6",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 16,
    marginVertical: 32,
    borderRadius: 4,
  },
  btn: {
    margin: 20,
    backgroundColor: "#e31010",
    borderRadius: 4,
    paddingVertical: 8,
  },
  btn_text: {
    color: "#f8f9fa",
    textAlign: "center",
    fontWeight: "600",
  },
});
