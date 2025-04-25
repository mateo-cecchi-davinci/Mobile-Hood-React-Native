import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AcceptedOrderModal from "./AcceptedOrderModal";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function AcceptedOrders({
  order,
  time,
  orderNumber,
  productsAmount,
  businessName,
  setBusiness,
  setAcceptedOrders,
}) {
  const [acceptedOrderModal, setAcceptedOrderModal] = useState(false);

  const toggleAcceptedOrderModal = () => {
    setAcceptedOrderModal(!acceptedOrderModal);
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => toggleAcceptedOrderModal()}
        style={styles.card}
      >
        <View style={styles.card_body}>
          <View>
            <Text style={styles.order_number}>#{orderNumber}</Text>
            <Text>
              {productsAmount + ` producto${productsAmount > 1 ? "s" : ""}`}
            </Text>
          </View>
          <View style={styles.card_body_row}>
            <Text style={styles.card_body_row_text}>TRANSFERENCIA</Text>
            <AntDesign
              name="check"
              size={24}
              color="black"
              style={styles.card_body_row_icon}
            />
          </View>
        </View>
        <View style={styles.card_footer}>
          <View style={styles.card_footer_row}>
            <MaterialIcons
              name="directions-run"
              size={24}
              color="black"
              style={styles.card_footer_icon}
            />
            <Text>{order.user.name}</Text>
          </View>
          <View style={styles.card_footer_row}>
            <Text style={styles.card_footer_row_time}>
              {time.value}
              <Text style={{ fontWeight: "normal" }}> {time.time}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <AcceptedOrderModal
        visible={acceptedOrderModal}
        onClose={toggleAcceptedOrderModal}
        order={order}
        orderNumber={orderNumber}
        productsAmount={productsAmount}
        time={time}
        businessName={businessName}
        setBusiness={setBusiness}
        setAcceptedOrders={setAcceptedOrders}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#dee2e6",
    boxShadow: "0 8 16 rgba(0, 0, 0, 0.15)",
  },
  card_body: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderStartWidth: 3,
    borderColor: "#e31010",
    paddingStart: 16,
  },
  order_number: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  card_body_row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  card_body_row_text: {
    marginEnd: 8,
    padding: 4,
    backgroundColor: "#d1e7dd",
    color: "#198754",
    fontSize: 10,
    fontWeight: "600",
  },
  card_body_row_icon: {
    backgroundColor: "#e2e3e5",
    padding: 6,
    borderRadius: 3,
  },
  card_footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: "0 8 16 rgba(0, 0, 0, 0.15)",
  },
  card_footer_row: {
    flexDirection: "row",
    alignItems: "center",
  },
  card_footer_icon: {
    marginEnd: 8,
  },
  card_footer_row_time: {
    fontWeight: "bold",
  },
});
