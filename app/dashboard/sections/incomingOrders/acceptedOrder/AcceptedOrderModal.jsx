import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from "expo-constants";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";

export default function AcceptedOrderModal({
  visible,
  onClose,
  order,
  orderNumber,
  productsAmount,
  time,
  businessName,
  setBusiness,
  setAcceptedOrders,
}) {
  const API_URL = Constants.expoConfig.extra.APP_URL;

  const deliverOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/deliverOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order }),
      });

      await response.json();

      if (response.ok) {
        setBusiness((prev) => ({
          ...prev,
          orders: prev.orders.map((o) =>
            o.id === order.id ? { ...order, state: "Entregado" } : order
          ),
        }));

        setAcceptedOrders((prev) => {
          return prev.filter((o) => o.id !== order.id);
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
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={onClose} style={styles.close_icon}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.business_name}>{businessName}</Text>
          <View style={styles.title_row}>
            <Text style={styles.title}>Pedido nº{orderNumber}</Text>
            <Text style={styles.title_row_time}>
              {time.value}
              <Text style={{ fontWeight: "normal" }}> {time.time}</Text>
            </Text>
          </View>
          <View style={styles.client_row}>
            <View style={styles.client_row_info}>
              <MaterialIcons
                name="directions-run"
                size={24}
                color="black"
                style={styles.client_row_icon}
              />
              <View>
                <Text style={styles.client}>Cliente</Text>
                <Text style={styles.client_name}>
                  {order.user.name} está en camino...
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => {}} style={styles.map_btn}>
              <Feather name="map-pin" size={24} color="#f8f9fa" />
            </TouchableOpacity>
          </View>
          {order.products.map((product) => (
            <View key={product.id} style={styles.product_row}>
              <Text style={styles.product_amount}>
                {product.amount} x
                <Text style={styles.product_model}>{"  " + product.model}</Text>
              </Text>
              <Text>$ {product.price}</Text>
            </View>
          ))}
          <View style={styles.total_row}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.payment}>${order.payment}</Text>
          </View>
          <Text style={styles.cash}>TARJETA</Text>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => deliverOrder()}
              style={styles.footer_btn}
            >
              <Text style={styles.footer_btn_text}>Listo para la entrega</Text>
              <Text style={styles.footer_btn_text}>
                Productos: {productsAmount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    flex: 0.9,
  },
  close_icon: {
    padding: 16,
  },
  business_name: {
    marginStart: 19,
    opacity: 0.6,
  },
  title_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
    borderStartWidth: 3,
    borderColor: "#e31010",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  title_row_time: {
    fontWeight: "bold",
    opacity: 0.6,
  },
  client_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "0 8 16 rgba(0, 0, 0, 0.15)",
    padding: 16,
  },
  client_row_info: {
    flexDirection: "row",
    alignItems: "center",
  },
  client_row_icon: {
    marginEnd: 10,
  },
  client: {
    color: "#e31010",
    fontSize: 12,
    fontWeight: "bold",
  },
  client_name: {
    opacity: 0.6,
  },
  map_btn: {
    borderRadius: 6,
    backgroundColor: "#e31010",
    padding: 8,
  },
  product_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "0 8 16 rgba(0, 0, 0, 0.15)",
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  product_amount: {
    color: "#e31010",
    fontWeight: "bold",
  },
  product_model: {
    fontSize: 18,
    color: "black",
  },
  total_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 24,
  },
  total: {
    fontWeight: "bold",
    fontSize: 18,
  },
  payment: {
    fontWeight: "bold",
  },
  cash: {
    fontWeight: "600",
    fontSize: 10,
    flexDirection: "row",
    textAlign: "center",
    backgroundColor: "#d1e7dd",
    color: "#198754",
    borderRadius: 3,
    paddingVertical: 4,
    margin: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    boxShadow: "-2px -4px 35px -6px rgba(0, 0, 0, 0.75)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  footer_btn: {
    backgroundColor: "#0d6efd",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 16,
    borderRadius: 3,
  },
  footer_btn_text: {
    fontWeight: "bold",
    color: "#f8f9fa",
  },
});
