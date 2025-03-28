import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
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
import Constants from "expo-constants";
import Footer from "../components/Footer";

export default function Orders() {
  const API_URL = Constants.expoConfig.extra.APP_URL;
  const route = useRoute();
  const user = route.params?.user;
  const [orders_products, setOrdersProducts] = useState([]);

  const getImage = (image) => {
    return { uri: `${API_URL}/uploads/${image}` };
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/${user.id}`);
      const data = await response.json();

      setOrdersProducts(data);
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

  if (!orders_products) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis pedidos</Text>
          <Feather name="shopping-cart" size={24} color="black" />
        </View>
        <View style={styles.filters}>
          <TouchableOpacity onPress={() => {}} style={styles.filters_btn}>
            <AntDesign name="filter" size={16} color="black" />
            <Text style={styles.filters_text}>Filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.filter_options}>
            <Text style={styles.btn_text}>Entregados</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.filter_options}>
            <Text style={styles.btn_text}>Cancelados</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.orders_cards}>
          {orders_products.map((order_product) => (
            <View key={order_product.order.id} style={styles.card}>
              {handleBusinessState(
                order_product.order.business.business_hours
              ) && <Text style={styles.business_state}>Cerrado por hoy</Text>}
              <TouchableOpacity onPress={() => {}} style={styles.card_body}>
                <Image
                  source={getImage(order_product.order.business.logo)}
                  style={styles.business_logo}
                />
                <View>
                  <View style={styles.order_state_container}>
                    <Text style={styles.order_state}>
                      {order_product.order.state}
                    </Text>
                    {order_product.order.state != "Pendiente" && (
                      <Text style={styles.order_date}>
                        {formatDate(order_product.order.updated_at)}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.business_name}>
                    {order_product.order.business.name}
                  </Text>
                  <Text style={styles.business_price}>
                    $ {order_product.order.payment} ·{" "}
                    {`${order_product.amount} producto${
                      order_product.amount > 1 ? "s" : ""
                    }`}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.line}></View>
              <View style={styles.card_footer}>
                <TouchableOpacity onPress={() => {}} style={styles.footer_btns}>
                  <Feather
                    name="star"
                    size={16}
                    color="black"
                    style={styles.footer_icon}
                  />
                  <Text style={styles.footer_text}>Opinar</Text>
                </TouchableOpacity>
                <View style={styles.footer_line}></View>
                <TouchableOpacity onPress={() => {}} style={styles.footer_btns}>
                  <AntDesign
                    name="reload1"
                    size={16}
                    color="black"
                    style={styles.footer_icon}
                  />
                  <Text style={styles.footer_text}>Repetir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Footer />
      </View>
    </View>
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
    maxHeight: 550,
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
  footer_btns: {
    flexDirection: "row",
    alignItems: "center",
  },
  footer_icon: {
    marginEnd: 5,
  },
  footer_text: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  footer_line: {
    height: "100%",
    borderEndWidth: 1,
    borderEndColor: "#dee2e6",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
