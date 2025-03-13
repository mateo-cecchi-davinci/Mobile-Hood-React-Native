import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const ProductModal = ({ visible, onClose, product, product_image }) => {
  // Estado para la cantidad de unidades
  const [quantity, setQuantity] = useState(1);

  // Función para incrementar la cantidad
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Función para decrementar la cantidad
  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Calcular el precio total
  const totalPrice = product.price * quantity;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal_content}>
              <TouchableOpacity style={styles.close_btn} onPress={onClose}>
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
              <Image source={product_image} style={styles.product_image} />
              <View style={styles.product_info}>
                <Text style={styles.model}>{product.model}</Text>
                <Text style={styles.description}>{product.description}</Text>
                <View style={styles.price_container}>
                  <Text style={styles.price}>${product.price}</Text>
                  <Text style={styles.old_price}>${product.price + 800}</Text>
                </View>
              </View>
              <View style={styles.amount_container}>
                <View>
                  <Text style={styles.amount_text}>Unidades</Text>
                </View>
                <View style={styles.amount_btn_container}>
                  <TouchableOpacity onPress={decrementQuantity}>
                    <AntDesign name="minus" size={16} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.amount_number}>{quantity}</Text>
                  <TouchableOpacity onPress={incrementQuantity}>
                    <AntDesign name="plus" size={16} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.add_btn_container}>
                <TouchableOpacity style={styles.add_btn}>
                  <View style={styles.add_btn_amount_number_container}>
                    <Text style={styles.add_btn_amount_number}>{quantity}</Text>
                  </View>
                  <Text style={styles.add_btn_text}>Agregar a mi pedido</Text>
                  <Text style={styles.add_btn_price}>${totalPrice}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  modal_content: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 20,
    alignItems: "center",
  },
  close_btn: {
    borderRadius: 20,
    backgroundColor: "#e2e3e5",
    padding: 10,
    position: "absolute",
    left: 0,
    marginTop: 10,
    marginStart: 10,
  },
  product_image: {
    width: "60%",
    height: 247,
  },
  product_info: {
    shadowColor: "#000",
    boxShadow: "0 8 16 rgba(0, 0, 0, 0.15)",
    width: "100%",
    paddingTop: 24,
    paddingStart: 24,
    paddingBottom: 8,
  },
  model: {
    fontWeight: "600",
    fontSize: 22,
    color: "#212529",
  },
  description: {
    opacity: 0.75,
    fontSize: 14,
    marginVertical: 8,
    color: "#212529",
  },
  price_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginEnd: 10,
  },
  old_price: {
    fontSize: 12,
    opacity: 0.75,
    textDecorationLine: "line-through",
  },
  amount_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24,
    marginHorizontal: 16,
    padding: 16,
    width: "90%",
    borderWidth: 1,
    borderColor: "dark(rgb(225, 225, 225), rgb(225, 225, 225))",
    borderRadius: 5,
  },
  amount_text: {
    color: "#212529",
    fontSize: 16,
    fontWeight: "bold",
  },
  amount_btn_container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 100,
    backgroundColor: "#e2e3e5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  amount_symbol: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amount_number: {
    fontSize: 14,
    fontWeight: "bold",
  },
  add_btn_container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: "dark(rgba(225, 225, 225, 0.5), rgba(225, 225, 225, 0.5))",
    position: "absolute",
    bottom: 0,
  },
  add_btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 48,
    paddingVertical: 8,
    backgroundColor: "#e31010",
    width: "100%",
    borderRadius: 20,
  },
  add_btn_amount_number_container: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: 6,
  },
  add_btn_amount_number: {
    color: "#f8f9fa",
    fontSize: 14,
    fontWeight: "bold",
  },
  add_btn_text: {
    color: "#f8f9fa",
    fontSize: 14,
    fontWeight: "bold",
  },
  add_btn_price: {
    color: "#f8f9fa",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ProductModal;
