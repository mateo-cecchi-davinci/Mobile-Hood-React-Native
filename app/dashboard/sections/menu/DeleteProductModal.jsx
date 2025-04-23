import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Constants from "expo-constants";

export default function DeleteProductModal({
  visible,
  onClose,
  setBusiness,
  selectedCategory,
  setSelectedCategory,
  product,
}) {
  const API_URL = Constants.expoConfig.extra.APP_URL;

  const deleteProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/deleteProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });

      await response.json();

      if (response.ok) {
        setBusiness((prev) => {
          return {
            ...prev,
            categories: prev.categories.map((category) =>
              category.id === selectedCategory.id
                ? {
                    ...category,
                    products: category.products.filter(
                      (p) => p.id !== product.id
                    ),
                  }
                : category
            ),
          };
        });

        setSelectedCategory((prev) => {
          return {
            ...prev,
            products: prev.products.filter((p) => p.id !== product.id),
          };
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
            <Text style={styles.title}>Eliminar producto</Text>
            <AntDesign
              name="close"
              size={24}
              color="black"
              style={styles.close_icon}
              onPress={onClose}
            />
            <View style={styles.line}></View>
            <Feather
              name="alert-circle"
              size={32}
              color="#e31010"
              style={styles.alert_icon}
            />
            <Text style={styles.alert}>
              ¿Está seguro que desea eliminar este producto?
            </Text>
            <Text style={styles.product_name}>*{product.model}*</Text>
            <View style={styles.line}></View>
            <View style={styles.row}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteProduct()}
                style={styles.btn}
              >
                <Text style={styles.btn_text}>Eliminar</Text>
              </TouchableOpacity>
            </View>
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
  close_icon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "#dee2e6",
  },
  alert_icon: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  alert: {
    fontSize: 18,
    color: "#6b6b6b",
    textAlign: "center",
    marginVertical: 5,
  },
  product_name: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  cancel: {
    color: "#e31010",
    fontWeight: "600",
    paddingHorizontal: 16,
  },
  btn: {
    backgroundColor: "#e31010",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btn_text: {
    color: "#f8f9fa",
    textAlign: "center",
    fontWeight: "600",
  },
});
