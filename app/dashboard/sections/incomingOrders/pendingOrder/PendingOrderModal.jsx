import React from "react";
import { Text, View, Modal, StyleSheet, TouchableOpacity } from "react-native";
import Constants from "expo-constants";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function PendingOrderModal({
  visible,
  onClose,
  order,
  orderNumber,
  productsAmount,
  time,
  businessName,
  setBusiness,
  setPendingOrders,
  setAcceptedOrders,
}) {
  const API_URL = Constants.expoConfig.extra.APP_URL;

  const acceptOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/acceptOrder`, {
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
            o.id === order.id ? { ...order, state: "Aceptado" } : order
          ),
        }));

        setPendingOrders((prev) => {
          return prev.filter((o) => o.id !== order.id);
        });

        setAcceptedOrders((prev) => {
          return [...prev, { ...order, state: "Aceptado" }];
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
          <View style={styles.header_row}>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.reject}>Rechazar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.business_name}>{businessName}</Text>
          <View style={styles.title_row}>
            <Text style={styles.title}>Pedido nº{orderNumber}</Text>
            <Text style={styles.title_row_time}>
              {time.value}
              <Text style={{ fontWeight: "normal" }}> {time.time}</Text>
            </Text>
          </View>
          <View style={styles.client_row}>
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
            <Text style={styles.footer_title}>
              Retiro en aproximadamente {time.value + " " + time.time}
            </Text>
            <TouchableOpacity
              onPress={() => acceptOrder()}
              style={styles.footer_btn}
            >
              <Text style={styles.footer_btn_text}>Aceptar</Text>
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
  header_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  reject: {
    color: "#e31010",
    fontWeight: "bold",
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
    borderTopWidth: 1,
    borderColor: "0 8 16 rgba(0, 0, 0, 0.15)",
    padding: 16,
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    boxShadow: "-2px -4px 35px -6px rgba(0, 0, 0, 0.75)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  footer_title: {
    fontWeight: "bold",
    color: "#198754",
    paddingVertical: 8,
  },
  footer_btn: {
    backgroundColor: "#198754",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderRadius: 3,
  },
  footer_btn_text: {
    fontWeight: "bold",
    color: "#f8f9fa",
  },
});
