import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import Footer from "../components/Footer";
import OrdersFiltersModal from "./OrdersFiltersModal";

export default function Orders() {
  const API_URL = Constants.expoConfig.extra.APP_URL;
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params?.user;
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState({
    status: "",
    period: "",
  });

  const getImage = (image) => {
    return { uri: `${API_URL}/uploads/${image}` };
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/${user.id}`);
      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Días de la semana (abreviados)
    const days = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

    // Meses (abreviados)
    const months = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];

    // Formatear hora
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `· ${dayOfWeek} ${dayOfMonth} de ${month} · ${hours}:${minutes} hs`;
  };

  const handleBusinessState = (hours) => {
    const now = Date.now();
    const currentDay = new Date(now).getUTCDay();
    const currentTime = Math.floor((now % 86400000) / 60000); // Minutos desde medianoche UTC

    for (let i = 0; i < hours?.length; i++) {
      if (hours[i].day_of_week === currentDay) {
        const [hO, mO] = hours[i].opening_time.split(":");
        const [hC, mC] = hours[i].closing_time.split(":");
        const opening = hO * 60 + (+mO || 0);
        const closing = hC * 60 + (+mC || 0);

        return currentTime < opening || currentTime > closing;
      }
    }
    return false;
  };

  const checkDateInPeriod = (order_date, selected_period) => {
    if (!selected_period) return true; // Si no hay filtro, devuelve true

    const orderDate = new Date(order_date);
    const currentDate = new Date();

    // Calculamos la diferencia en milisegundos
    const diffTime = currentDate - orderDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // Convertir a días

    switch (selected_period) {
      case "Última semana":
        return diffDays <= 7;
      case "Últimos 15 días":
        return diffDays <= 15;
      case "Últimos 30 días":
        return diffDays <= 30;
      case "Últimos 3 meses":
        return diffDays <= 90;
      case "Últimos 6 meses":
        return diffDays <= 180;
      default:
        return true; // Por defecto mostrar todos
    }
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      !filter.status || order.state === filter.status.slice(0, -1);

    const periodMatch = checkDateInPeriod(order.created_at, filter.period);

    return statusMatch && periodMatch;
  });

  const toggleModal = () => {
    setModal(!modal);
  };

  const totalProducts = (products) => {
    const totalProducts = products.reduce(
      (acc, product) => acc + product.amount,
      0
    );
    return `${totalProducts} producto${totalProducts !== 1 ? "s" : ""}`;
  };

  return (
    <>
      <OrdersFiltersModal
        visible={modal}
        onClose={toggleModal}
        setFilter={setFilter}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Mis pedidos</Text>
            <Feather name="shopping-cart" size={24} color="black" />
          </View>
          {filteredOrders.length > 0 ? (
            <>
              <View style={styles.filters}>
                <TouchableOpacity
                  onPress={toggleModal}
                  style={styles.filters_btn}
                >
                  <Ionicons name="options-outline" size={16} color="black" />
                  <Text style={styles.filters_text}>Filtros</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setFilter({
                      status: "Entregados",
                      period: "",
                    })
                  }
                  style={styles.filter_options}
                >
                  <Text style={styles.btn_text}>Entregados</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setFilter({
                      status: "Rechazados",
                      period: "",
                    })
                  }
                  style={styles.filter_options}
                >
                  <Text style={styles.btn_text}>Cancelados</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.orders_cards}>
                {filteredOrders.map((order) => (
                  <View key={order.id} style={styles.card}>
                    {handleBusinessState(order.business.business_hours) && (
                      <Text style={styles.business_state}>Cerrado por hoy</Text>
                    )}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("OrderInfo", {
                          order: order,
                        })
                      }
                      style={styles.card_body}
                    >
                      <Image
                        source={getImage(order.business.logo)}
                        style={styles.business_logo}
                      />
                      <View>
                        <View style={styles.order_state_container}>
                          <Text style={styles.order_state}>{order.state}</Text>
                          {order.state != "Pendiente" && (
                            <Text style={styles.order_date}>
                              {formatDate(order.updated_at)}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.business_name}>
                          {order.business.name}
                        </Text>
                        <Text style={styles.business_price}>
                          $ {order.payment} · {totalProducts(order.products)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.line}></View>
                    <View style={styles.card_footer}>
                      <TouchableOpacity
                        onPress={() => {}}
                        style={styles.card_footer_btns}
                      >
                        <Feather
                          name="star"
                          size={16}
                          color="black"
                          style={styles.card_footer_icon}
                        />
                        <Text style={styles.card_footer_text}>Opinar</Text>
                      </TouchableOpacity>
                      <View style={styles.card_footer_line}></View>
                      <TouchableOpacity
                        onPress={() => {}}
                        style={styles.card_footer_btns}
                      >
                        <AntDesign
                          name="reload1"
                          size={16}
                          color="black"
                          style={styles.card_footer_icon}
                        />
                        <Text style={styles.card_footer_text}>Repetir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <View style={styles.no_filters_found_container}>
              <Image
                source={require("../assets/no_filters_found.jpeg")}
                style={styles.no_filters_img}
              />
              <Text style={styles.no_filters_title}>
                No encontramos pedidos para estos filtros
              </Text>
              <Text style={styles.no_filters_subtitle}>
                Por favor, limpialos y probá con otros.
              </Text>
              <TouchableOpacity
                onPress={() => setFilter({ status: "", period: "" })}
                style={styles.no_filters_btn}
              >
                <Text style={styles.no_filters_btn_text}>Limpiar filtros</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.footer}>
          <Footer />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
  },
  filters: {
    flexDirection: "row",
    width: "72%",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  filters_btn: {
    flexDirection: "row",
    alignItems: "center",
  },
  filters_text: {
    fontSize: 12,
    fontWeight: "bold",
    textDecorationLine: "underline",
    alignItems: "center",
    marginStart: 10,
  },
  filter_options: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#dee2e6",
  },
  btn_text: {
    fontSize: 12,
  },
  orders_cards: {
    maxHeight: 630,
  },
  card: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#dee2e6",
    marginVertical: 8,
  },
  business_state: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#e31010",
    marginBottom: 8,
  },
  card_body: {
    flexDirection: "row",
  },
  business_logo: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#dee2e6",
    marginEnd: 20,
  },
  order_state_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  order_state: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 12,
    opacity: 0.75,
    marginEnd: 3,
  },
  order_date: {
    fontSize: 10,
    opacity: 0.8,
  },
  business_name: {
    fontWeight: "bold",
    marginVertical: 2,
  },
  business_price: {
    fontSize: 12,
  },
  line: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  card_footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 5,
  },
  card_footer_btns: {
    flexDirection: "row",
    alignItems: "center",
  },
  card_footer_icon: {
    marginEnd: 5,
  },
  card_footer_text: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  card_footer_line: {
    height: "100%",
    borderEndWidth: 1,
    borderEndColor: "#dee2e6",
  },
  no_filters_found_container: {
    justifyContent: "center",
    alignItems: "center",
    height: "85%",
  },
  no_filters_img: {
    width: 120,
    height: 120,
  },
  no_filters_title: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },
  no_filters_subtitle: {
    fontSize: 12,
    marginBottom: 25,
  },
  no_filters_btn: {
    backgroundColor: "#e31010",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 3,
  },
  no_filters_btn_text: {
    fontWeight: "600",
    fontSize: 12,
    color: "#f8f9fa",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
