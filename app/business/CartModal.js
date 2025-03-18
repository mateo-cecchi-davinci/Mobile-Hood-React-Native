import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Text,
} from "react-native";
import CheckBox from "react-native-check-box";
import Entypo from "@expo/vector-icons/Entypo";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";

const API_URL = Constants.expoConfig.extra.APP_URL;

const getImage = (image) => {
  return { uri: `${API_URL}/uploads/${image}` };
};

export default function CartModal({
  visible,
  onClose,
  user,
  business,
  categories,
  cart,
  setCart,
  subtotal,
  updateSubtotal,
}) {
  const [edit, setEdit] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigation = useNavigation();

  // Crear un mapa de productos por su id
  const productMap = new Map();
  categories.forEach((category) => {
    category.products.forEach((product) => {
      productMap.set(product.id, product);
    });
  });

  // Crear un mapa de selectedProducts por su product_id para verificación rápida
  const selectedProductMap = new Map();
  selectedProducts.forEach((selected) => {
    selectedProductMap.set(selected.product_id, true);
  });

  const toggleEdit = () => {
    setEdit(!edit);
  };

  const handleCheckboxChange = (product_id, quantity) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find(
        (item) => item.product_id === product_id
      );
      if (existingProduct) {
        return prev.filter((item) => item.product_id !== product_id);
      } else {
        return [...prev, { product_id, quantity }];
      }
    });
  };

  const deleteSelected = async () => {
    try {
      const response = await fetch(`${API_URL}/deleteSelected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedProducts,
          user: user.id,
          business: business.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);

        selectedProducts.forEach((selected_product) => {
          const product = productMap.get(selected_product.product_id);
          if (product) {
            updateSubtotal(-product.price);
          }
        });

        setSelectedProducts([]);
        data.cart.length === 0 && onClose();
      } else {
        console.error("Error:", data);
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
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Entypo
              name="chevron-left"
              size={24}
              color="black"
              onPress={onClose}
            />
            <Text style={styles.title}>Mi pedido a retirar</Text>
            {edit ? (
              <TouchableOpacity onPress={toggleEdit}>
                <Text style={styles.edit_btn}>Aceptar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={toggleEdit}>
                <Text style={styles.edit_btn}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.business_info_container}>
            <View style={styles.business_logo_container}>
              <Image
                source={getImage(business.logo)}
                style={styles.business_logo}
              />
            </View>
            <View>
              <Text style={styles.business_name}>{business.name}</Text>
              <Text style={styles.business_subtitle}>
                30 - 45 min | $1.669 envío | Mínimo $5.799
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Vas a retirar:</Text>
          {cart.map((item) => {
            const product = productMap.get(item.fk_carts_products); // Obtener el producto directamente
            if (!product) return null; // Si el producto no existe, no renderizar nada

            return (
              <View key={product.id} style={styles.product_cards_container}>
                <View style={styles.product_card}>
                  <View style={styles.product_amount}>
                    {edit ? (
                      <CheckBox
                        isChecked={selectedProductMap.has(product.id)} // Verificación en O(1)
                        onClick={() => handleCheckboxChange(product.id, 1)}
                      />
                    ) : (
                      <Text>{item.quantity}x</Text>
                    )}
                    <Text style={styles.product_model}>{product.model}</Text>
                  </View>
                  <Text>${product.price}</Text>
                </View>
              </View>
            );
          })}
          <View style={styles.line}></View>
          <View style={styles.subtotal}>
            <Text>Subtotal</Text>
            <Text>$ {subtotal}</Text>
          </View>
          {selectedProducts.length > 0 ? (
            <TouchableOpacity onPress={deleteSelected} style={styles.btn}>
              <Text style={styles.btn_text}>Eliminar seleccionados</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                onClose();
                navigation.navigate("Order", {
                  user: user,
                  cart: cart,
                  categories: categories,
                  subtotal: subtotal,
                });
              }}
              style={styles.btn}
            >
              <Text style={styles.btn_text}>Ir a pagar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 48,
    paddingHorizontal: 24,
  },
  title: {
    fontWeight: "bold",
  },
  edit_btn: {
    fontSize: 12,
    fontWeight: "bold",
  },
  business_info_container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
    boxShadow: "0 2 4 rgba(0, 0, 0, 0.075)",
  },
  business_logo_container: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#dee2e6",
    marginRight: 24,
  },
  business_logo: {
    maxWidth: "100%",
    height: "100%",
    borderRadius: 5,
  },
  business_name: {
    fontWeight: "bold",
  },
  business_subtitle: {
    opacity: 0.5,
  },
  subtitle: {
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  product_cards_container: {
    width: "100%",
    paddingHorizontal: 24,
  },
  product_card: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "rgba(0, 0, 0, 0.175)",
  },
  product_amount: {
    flexDirection: "row",
    alignItems: "center",
  },
  product_model: {
    marginStart: 10,
  },
  line: {
    marginVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  subtotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#e31010",
    borderRadius: 50,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  btn_text: {
    color: "#f8f9fa",
    fontWeight: "bold",
    textAlign: "center",
  },
});
