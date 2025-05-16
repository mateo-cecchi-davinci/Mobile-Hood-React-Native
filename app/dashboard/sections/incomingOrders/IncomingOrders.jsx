import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PendingOrder from "./pendingOrder/PendingOrder";
import AcceptedOrder from "./acceptedOrder/AcceptedOrder";
import Constants from "expo-constants";

export default function IncomingOrders({ business, setBusiness }) {
  const WEBSOCKET = Constants.expoConfig.extra.WEBSOCKET;

  const [pendingOrders, setPendingOrders] = useState(
    business.orders.filter((order) => order.state === "Pendiente")
  );

  const [acceptedOrders, setAcceptedOrders] = useState(
    business.orders.filter((order) => order.state === "Aceptado")
  );

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "NEW_ORDER") {
        setPendingOrders((prev) => [data.order, ...prev]);

        setBusiness((prev) => ({
          ...prev,
          orders: [data.order, ...prev.orders],
        }));
      }
    };

    // ws.onerror = (error) => {
    //   console.error("Error en WebSocket:", error);
    // };

    return () => {
      ws.close();
    };
  }, []);

  const getTime = (time) => {
    const now = new Date();
    const past = new Date(time);
    const diff = now - past;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return { value: days, time: days === 1 ? "día" : "días" };
    if (hours > 0)
      return { value: hours, time: hours === 1 ? "hora" : "horas" };
    if (minutes > 0)
      return { value: minutes, time: minutes === 1 ? "minuto" : "minutos" };
    return { value: seconds, time: seconds === 1 ? "segundo" : "segundos" };
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>
          Nuevo <Text style={styles.title_amount}>{pendingOrders.length}</Text>
        </Text>
        {pendingOrders.length > 0 ? (
          pendingOrders.map((order, index) => {
            const time = getTime(order.updated_at);
            const orderNumber = (index + 1).toString().padStart(2, "0");
            const productsAmount = order.products.length;

            return (
              <PendingOrder
                key={order.id}
                order={order}
                time={time}
                orderNumber={orderNumber}
                productsAmount={productsAmount}
                business={business}
                setBusiness={setBusiness}
                setPendingOrders={setPendingOrders}
                setAcceptedOrders={setAcceptedOrders}
              />
            );
          })
        ) : (
          <Text style={styles.no_results}>No hay nuevos pedidos</Text>
        )}
        <Text style={[styles.title, { marginTop: 24 }]}>
          Aceptado{" "}
          <Text style={styles.title_amount}>{acceptedOrders.length}</Text>
        </Text>
        {acceptedOrders.length > 0 ? (
          acceptedOrders.map((order, index) => {
            const time = getTime(order.updated_at);
            const orderNumber = (index + 1).toString().padStart(2, "0");
            const productsAmount = order.products.length;

            return (
              <AcceptedOrder
                key={order.id}
                order={order}
                time={time}
                orderNumber={orderNumber}
                productsAmount={productsAmount}
                businessName={business.name}
                setBusiness={setBusiness}
                setAcceptedOrders={setAcceptedOrders}
              />
            );
          })
        ) : (
          <Text style={styles.no_results}>No hay pedidos aceptados</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginTop: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  title_amount: {
    color: "#e31010",
    fontWeight: "bold",
    fontSize: 14,
  },
  no_results: {
    padding: 24,
    backgroundColor: "#e9ecef",
    borderRadius: 3,
  },
});
