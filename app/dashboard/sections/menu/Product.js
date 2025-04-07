import React, { useState } from "react";
import Constants from "expo-constants";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import EditProductModal from "./EditProductModal";

const API_URL = Constants.expoConfig.extra.APP_URL;

const getImage = (image) => {
  return { uri: `${API_URL}/uploads/${image}` };
};

export default function Product({
  product,
  setBusiness,
  selectedCategory,
  setSelectedCategory,
  visible,
  onClose,
}) {
  const [productState, setProductState] = useState(!!product.is_active);

  const editProductState = () => {
    fetch(`${API_URL}/editProductState`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: product.id,
        productState: !product.is_active,
      }),
    });

    setBusiness((prevBusiness) => {
      const updatedCategories = prevBusiness.categories.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              products: category.products.map((p) =>
                p.id === product.id
                  ? { ...p, is_active: !product.is_active }
                  : p
              ),
            }
          : category
      );

      return { ...prevBusiness, categories: updatedCategories };
    });

    setSelectedCategory((prev) => {
      const updatedProducts = prev.products.map((p) =>
        p.id === product.id ? { ...p, is_active: !product.is_active } : p
      );

      return { ...prev, products: updatedProducts };
    });

    setProductState((prev) => !prev);
  };

  return (
    <>
      <View key={product.id} style={styles.product_container}>
        <Image
          source={getImage(product.image)}
          style={styles.product_image}
          resizeMode="contain"
        />
        <Text style={styles.product_model}>{product.model}</Text>
        <Text style={{ color: "#6b6b6b" }}>{product.description}</Text>
        <View style={styles.product_row}>
          <Text>${product.price}</Text>
          <View style={styles.options_row}>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor="#f8f9fa"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => editProductState()}
              value={productState}
            />
            <TouchableOpacity onPress={() => onClose()}>
              <FontAwesome5
                name="edit"
                size={18}
                color="black"
                style={{ marginHorizontal: 20 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <MaterialIcons name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <EditProductModal
        visible={visible}
        onClose={onClose}
        setBusiness={setBusiness}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        product={product}
      />
    </>
  );
}

const styles = StyleSheet.create({
  product_container: {
    borderBottomWidth: 1,
    borderColor: "#dee2e6",
    paddingVertical: 16,
  },
  product_image: {
    width: "100%",
    height: 362,
    marginBottom: 16,
  },
  product_model: {
    fontSize: 18,
    fontWeight: "500",
  },
  product_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  options_row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
