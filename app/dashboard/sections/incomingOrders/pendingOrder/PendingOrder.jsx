import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PendingOrderModal from "./PendingOrderModal";

export default function PendingOrders({
  order,
  time,
  orderNumber,
  productsAmount,
  business,
  setBusiness,
  setPendingOrders,
  setAcceptedOrders,
}) {
  const [pendingOrderModal, setPendingOrderModal] = useState(false);

  const togglePendingOrderModal = () => {
    setPendingOrderModal(!pendingOrderModal);
  };
  return (
    <>
      <TouchableOpacity
        key={order.id}
        onPress={() => togglePendingOrderModal()}
        style={styles.order_card}
      >
        <View>
          <Text style={styles.order_number}>#{orderNumber}</Text>
          <Text style={styles.text_light}>
            {productsAmount + ` producto${productsAmount > 1 ? "s" : ""}`}
          </Text>
        </View>
        <View style={styles.order_time_row}>
          <Text style={styles.order_time_value}>{time.value}</Text>
          <Text style={styles.text_light}>{time.time}</Text>
        </View>
      </TouchableOpacity>
      <PendingOrderModal
        visible={pendingOrderModal}
        onClose={togglePendingOrderModal}
        order={order}
        orderNumber={orderNumber}
        productsAmount={productsAmount}
        time={time}
        business={business}
        setBusiness={setBusiness}
        setPendingOrders={setPendingOrders}
        setAcceptedOrders={setAcceptedOrders}
      />
    </>
  );
}

const styles = StyleSheet.create({
  order_card: {
    backgroundColor: "#e31010",
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 3,
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
  },
  order_number: {
    color: "#f8f9fa",
    fontWeight: "bold",
  },
  text_light: {
    color: "#f8f9fa",
  },
  order_time_row: {
    flexDirection: "row",
    alignItems: "center",
  },
  order_time_value: {
    fontWeight: "bold",
    color: "#f8f9fa",
    marginEnd: 5,
  },
});
