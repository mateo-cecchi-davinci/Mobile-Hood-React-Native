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
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.APP_URL;

export default function AddProductModal({
  visible,
  onClose,
  setBusiness,
  selectedCategory,
  setSelectedCategory,
}) {
  const [model, setModel] = useState();
  const [image, setImage] = useState();
  const [description, setDescription] = useState();
  const [price, setPrice] = useState();
  const [brand, setBrand] = useState();
  const [stock, setStock] = useState();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const getMimeType = (uri) => {
    const extension = uri.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      default:
        return "application/octet-stream"; // Tipo MIME genérico
    }
  };

  const addProduct = async () => {
    if (!model || !model.trim()) {
      alert("El nombre del producto no puede estar vacío");
      return;
    }
    if (!image?.uri || !image?.uri.trim()) {
      alert("Selecciona una imagen");
      return;
    }
    if (!description || !description.trim()) {
      alert("La descripción del producto no puede estar vacía");
      return;
    }
    if (!price || !price.trim()) {
      alert("El precio del producto no puede estar vacío");
      return;
    }
    if (!stock || !stock.trim()) {
      alert("El stock del producto no puede estar vacío");
      return;
    }

    const formData = new FormData();

    formData.append("model", model);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("brand", brand);
    formData.append("stock", stock);
    formData.append("image", {
      uri: image.uri,
      name: `image.${image.uri.split(".").pop()}`, // Extraer la extensión del archivo
      type: getMimeType(image.uri), // Determinar el tipo MIME dinámicamente
    });
    formData.append("category", selectedCategory.id);

    try {
      const response = await fetch(`${API_URL}/addProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setBusiness((prev) => {
          const updatedCategories = prev.categories.map((category) =>
            category.id === selectedCategory.id
              ? { ...category, products: [...category.products, data.product] }
              : category
          );

          return { ...prev, categories: updatedCategories };
        });

        setSelectedCategory((prev) => {
          return { ...prev, products: [...prev.products, data.product] };
        });

        setModel("");
        setImage("");
        setDescription("");
        setPrice("");
        setBrand("");
        setStock("");
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
            <Text style={styles.title}>Agregar producto</Text>
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
              value={model}
              onChangeText={setModel}
              numberOfLines={1}
              ellipsizeMode="tail"
              placeholder="Modelo*"
            />
            <TouchableOpacity onPress={pickImage}>
              <TextInput
                style={styles.input}
                value={image?.uri || ""}
                editable={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                placeholder="Imagen*"
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              numberOfLines={1}
              ellipsizeMode="tail"
              placeholder="Descripción*"
            />
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              numberOfLines={1}
              ellipsizeMode="tail"
              placeholder="Precio*"
            />
            <TextInput
              style={styles.input}
              value={brand}
              onChangeText={setBrand}
              numberOfLines={1}
              ellipsizeMode="tail"
              placeholder="Marca*"
            />
            <TextInput
              style={styles.input}
              value={stock}
              onChangeText={setStock}
              numberOfLines={1}
              ellipsizeMode="tail"
              placeholder="Stock*"
            />
            <View style={styles.line}></View>
            <TouchableOpacity onPress={() => addProduct()} style={styles.btn}>
              <Text style={styles.btn_text}>Agregar</Text>
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
    marginVertical: 10,
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
