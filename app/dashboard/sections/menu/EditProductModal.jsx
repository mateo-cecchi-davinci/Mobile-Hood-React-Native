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

export default function EditProductModal({
  visible,
  onClose,
  setBusiness,
  selectedCategory,
  setSelectedCategory,
  product,
}) {
  const API_URL = Constants.expoConfig.extra.APP_URL;

  const [model, setModel] = useState(product.model);
  const [image, setImage] = useState(product.image);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [brand, setBrand] = useState(product.brand);
  const [stock, setStock] = useState(product.stock);

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

  const editProduct = async () => {
    if (!model) {
      alert("El nombre del producto no puede estar vacío");
      return;
    }
    if (!description) {
      alert("La descripción del producto no puede estar vacía");
      return;
    }
    if (!price) {
      alert("El precio del producto no puede estar vacío");
      return;
    }
    if (!stock) {
      alert("El stock del producto no puede estar vacío");
      return;
    }

    const formData = new FormData();

    formData.append("model", model);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("brand", brand);
    formData.append("stock", stock);
    if (image?.uri) {
      formData.append("image", {
        uri: image.uri,
        name: `image.${image.uri.split(".").pop()}`, // Extraer la extensión del archivo
        type: getMimeType(image.uri), // Determinar el tipo MIME dinámicamente
      });
    } else {
      formData.append("old_image", product.image);
    }
    formData.append("id", product.id);

    try {
      const response = await fetch(`${API_URL}/editProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setBusiness((prev) => {
          return {
            ...prev,
            categories: prev.categories.map((category) =>
              category.id === selectedCategory.id
                ? {
                    ...category,
                    products: category.products.map((p) =>
                      p.id === product.id
                        ? {
                            ...p,
                            model,
                            image: data.image,
                            description,
                            price,
                            brand,
                            stock,
                          }
                        : p
                    ),
                  }
                : category
            ),
          };
        });

        setSelectedCategory((prev) => {
          return {
            ...prev,
            products: prev.products.map((p) =>
              p.id === product.id
                ? {
                    ...p,
                    model,
                    image: data.image,
                    description,
                    price,
                    brand,
                    stock,
                  }
                : p
            ),
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
            <Text style={styles.title}>Editar producto</Text>
            <AntDesign
              name="close"
              size={24}
              color="black"
              style={styles.icon}
              onPress={onClose}
            />
            <View style={styles.line}></View>
            <View>
              <Text style={styles.label}>Modelo</Text>
              <TextInput
                style={styles.input}
                value={model}
                onChangeText={setModel}
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            </View>
            <View>
              <Text style={styles.label}>Imagen</Text>
              <TouchableOpacity onPress={pickImage}>
                <TextInput
                  style={styles.input}
                  value={typeof image === "string" ? image : image?.uri || ""}
                  editable={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            </View>
            <View>
              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
                value={String(price)}
                onChangeText={setPrice}
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            </View>
            <View>
              <Text style={styles.label}>Marca</Text>
              <TextInput
                style={styles.input}
                value={brand}
                onChangeText={setBrand}
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            </View>
            <View>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                value={String(stock)}
                onChangeText={setStock}
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            </View>
            <View style={styles.line}></View>
            <TouchableOpacity onPress={() => editProduct()} style={styles.btn}>
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
    marginTop: 20,
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
    marginVertical: 20,
  },
  label: {
    marginStart: 28,
    color: "#6b6b6b",
    backgroundColor: "#fff",
    position: "absolute",
    top: -1,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 4,
  },
  btn: {
    margin: 20,
    marginTop: 0,
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
