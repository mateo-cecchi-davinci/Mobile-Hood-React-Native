import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import Constants from "expo-constants";
import ProductModal from "./ProductModal";

const API_URL = Constants.expoConfig.extra.APP_URL;

export default function Products({ products, updateSubtotal, updateCart }) {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = (product_id, is_visible) => {
    setModalVisible((prev) => ({ ...prev, [product_id]: is_visible }));
  };

  const getProductImage = (image) => {
    return { uri: `${API_URL}/uploads/${image}` };
  };

  if (products.length > 0) {
    return (
      <View style={styles.body}>
        {products.map((product) => (
          <View key={product.id}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => toggleModal(product.id, true)}
            >
              <View>
                <Text style={styles.product_model}>{product.model}</Text>
                {product.description ? (
                  <Text style={styles.product_description}>
                    {product.description}
                  </Text>
                ) : null}
                <Text style={styles.product_price}>${product.price}</Text>
              </View>
              <Image
                source={getProductImage(product.image)}
                style={styles.product_image}
              />
            </TouchableOpacity>

            <ProductModal
              visible={modalVisible[product.id] || false}
              onClose={() => toggleModal(product.id, false)}
              product={product}
              product_image={getProductImage(product.image)}
              updateSubtotal={updateSubtotal}
              updateCart={updateCart}
            />
          </View>
        ))}
      </View>
    );
  } else return null;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 20,
    marginHorizontal: 40,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "dark(rgb(225, 225, 225), rgb(225, 225, 225))",
    boxShadow: "0 5 10 rgba(0, 0, 0, 0.15)",
  },
  product_model: {
    fontSize: 16,
    color: "#212529",
    maxWidth: "200",
  },
  product_description: {
    fontSize: 12,
    color: "#212529",
    opacity: 0.75,
    marginBottom: 10,
    maxWidth: "200",
  },
  product_price: {
    fontSize: 18,
    color: "#212529",
    fontWeight: "500",
  },
  product_image: {
    width: 82,
    height: 82,
    resizeMode: "contain",
  },
});
