import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function RecentOrders({ business }) {
  const recentOrders = business.orders.filter(
    (order) => order.state === "Entregado" || order.state === "Rechazado"
  );

  const periods = ["Hoy", "Ayer", "Últimos 7 días", "Todos"];
  const states = ["Entregados", "Rechazados", "Todos"];

  const [period, setPeriod] = useState("Todos");
  const [state, setState] = useState("Todos");

  const checkDateInPeriod = (date, period) => {
    const orderDate = new Date(date);
    const currentDate = new Date();

    // Calculamos la diferencia en milisegundos
    const diffTime = currentDate - orderDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // Convertir a días

    switch (period) {
      case "Hoy":
        return diffDays < 1;
      case "Ayer":
        return diffDays >= 1 && diffDays < 2;
      case "Últimos 7 días":
        return diffDays <= 7;
      case "Todos":
        return true;
      default:
        return true;
    }
  };

  const checkState = (order_state) => {
    switch (order_state) {
      case "Entregado":
        return state === "Entregados";
      case "Rechazado":
        return state === "Rechazados";
      case "Todos":
        return true;
      default:
        return true;
    }
  };

  const filteredOrders = recentOrders.filter(
    (order) =>
      checkState(state === "Todos" ? state : order.state) &&
      checkDateInPeriod(order.updated_at, period)
  );

  const total = filteredOrders.reduce((sum, order) => sum + order.payment, 0);

  const [periodMenu, setPeriodMenu] = useState(false);
  const [stateMenu, setStateMenu] = useState(false);

  const handlePeriodMenu = () => {
    setStateMenu(false);
    setPeriodMenu(!periodMenu);
  };

  const handleStateMenu = () => {
    setPeriodMenu(false);
    setStateMenu(!stateMenu);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Órdenes recientes</Text>
        <View style={styles.filters_row}>
          <TouchableOpacity
            onPress={() => handlePeriodMenu()}
            style={styles.row}
          >
            <Text style={styles.filter}>{period}</Text>
            <FontAwesome6 name="chevron-down" size={16} color="black" />
          </TouchableOpacity>
          {periodMenu && (
            <View style={styles.periods_dropdown}>
              {periods.map((p) => (
                <TouchableOpacity key={p} onPress={() => setPeriod(p)}>
                  <Text style={styles.dropdown_items}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity
            onPress={() => handleStateMenu()}
            style={styles.row}
          >
            <Text style={styles.filter}>
              {state + " - " + filteredOrders.length + ` ($ ${total})`}
            </Text>
            <FontAwesome6 name="chevron-down" size={16} color="black" />
          </TouchableOpacity>
          {stateMenu && (
            <View style={styles.states_dropdown}>
              {states.map((s) => (
                <TouchableOpacity key={s} onPress={() => setState(s)}>
                  <Text style={styles.dropdown_items}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      {filteredOrders.map((order, index) => {
        const orderNumber = (index + 1).toString().padStart(2, "0");
        return (
          <View key={order.id} style={styles.order_row}>
            <View>
              <Text style={styles.order_number}>#{orderNumber}</Text>
              <View style={styles.row}>
                <FontAwesome6
                  name="user-large"
                  size={20}
                  color="black"
                  style={styles.icon}
                />
                <Text>{order.user.name}</Text>
              </View>
            </View>
            <View style={styles.order_date}>
              <Text>
                {new Date(order.updated_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text
                style={[
                  styles.order_state,
                  order.state === "Rechazado" && { color: "#e31010" },
                ]}
              >
                {order.state}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginVertical: 24,
  },
  filters_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  filter: {
    fontWeight: "600",
    marginEnd: 5,
  },
  periods_dropdown: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "0 8 16 rgba(0, 0, 0, 0.15)",
    position: "absolute",
    top: 30,
    backgroundColor: "#f8f9fa",
    zIndex: 1,
  },
  states_dropdown: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "0 8 16 rgba(0, 0, 0, 0.15)",
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#f8f9fa",
    zIndex: 1,
  },
  dropdown_items: {
    marginVertical: 5,
    fontWeight: "600",
  },
  order_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: "0 8 16 rgba(0, 0, 0, 0.15)",
  },
  order_number: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  order_state: {
    fontWeight: "bold",
    color: "#198754",
  },
  icon: {
    marginEnd: 20,
  },
  order_date: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
