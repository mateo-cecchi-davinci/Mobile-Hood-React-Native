import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Constants from "expo-constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

export default function OrderInfo() {
  const route = useRoute();
  const order = route.params?.order;
  const navigation = useNavigation();

  const API_URL = Constants.expoConfig.extra.APP_URL;

  const [orderInfo, setOrderInfo] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState(false);

  const getImage = (image) => {
    return { uri: `${API_URL}/uploads/${image}` };
  };

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

    return `${dayOfWeek} ${dayOfMonth} de ${month}, ${hours}:${minutes} hs`;
  };

  return (
    <ScrollView style={styles.background}>
      <ImageBackground
        source={getImage(order.business.frontPage)}
        style={styles.header}
      >
        <View style={styles.overlay} />
        <View style={styles.header_body}>
          <View style={styles.header_options}>
            <AntDesign
              name="arrowleft"
              size={24}
              color="#f8f9fa"
              onPress={() => navigation.goBack()}
            />
            <TouchableOpacity onPress={() => {}} style={styles.support_btn}>
              <MaterialIcons name="support-agent" size={18} color="black" />
              <Text style={styles.support_btn_text}>Ayuda</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.business_name}>{order.business.name}</Text>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.open_business_btn}
            >
              <Text style={styles.open_business_btn_text}>Ver local</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.state_container}>
        <Text style={styles.order_state}>{order.state}</Text>
        <Text style={styles.order_date}>{formatDate(order.updated_at)}</Text>
        <TouchableOpacity style={styles.order_again_btn}>
          <AntDesign name="reload1" size={16} color="#f8f9fa" />
          <Text style={styles.order_again_btn_text}>Repetir pedido</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.option_container}>
        <TouchableOpacity
          style={styles.option_row}
          onPress={() => setOrderInfo(!orderInfo)}
        >
          <Text style={styles.option_title}>Tu pedido</Text>
          <Entypo
            name={orderInfo ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {orderInfo &&
          order.products.map((product) => (
            <View key={product.id} style={styles.product_info_container}>
              <View style={styles.product_image_description_container}>
                <Image
                  source={getImage(product.image)}
                  style={styles.product_img}
                />
                <Text style={styles.product_description}>
                  {product.description === ""
                    ? product.name
                    : product.description}
                </Text>
              </View>
              <View style={styles.product_amount_price_container}>
                <Text style={styles.product_amount}>{product.amount}x</Text>
                <Text style={styles.product_price}>$ {product.price}</Text>
              </View>
            </View>
          ))}
      </View>
      <View style={styles.option_container}>
        <TouchableOpacity
          onPress={() => setPaymentInfo(!paymentInfo)}
          style={styles.option_row}
        >
          <Text style={styles.option_title}>Tu pago</Text>
          <Entypo
            name={paymentInfo ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {paymentInfo && (
          <View style={styles.payment_info_container}>
            <View style={styles.payment_info_row}>
              <Text>Productos</Text>
              <Text>$ {order.payment}</Text>
            </View>
            <View style={styles.payment_info_row}>
              <Text>Tarifa de servicio</Text>
              <Text>$ 300</Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.payment_info_row}>
              <Text style={styles.total}>Total</Text>
              <Text style={styles.total}>$ {order.payment + 300}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.option_container}>
        <TouchableOpacity
          onPress={() => setPaymentMethod(!paymentMethod)}
          style={styles.option_row}
        >
          <Text style={styles.option_title}>Medios de pago</Text>
          <Entypo
            name={paymentMethod ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {paymentMethod && (
          <View style={styles.payment_method_container}>
            <View style={styles.payment_method_row}>
              <Image
                source={require("../assets/MP_RGB_HANDSHAKE_color-azul_hori-izq.png")}
                style={styles.mp_logo}
              />
            </View>
            <Text>$ {order.payment + 300}</Text>
          </View>
        )}
      </View>

      <View style={styles.option_container}>
        <TouchableOpacity
          onPress={() => setDeliveryDetails(!deliveryDetails)}
          style={styles.option_row}
        >
          <Text style={styles.option_title}>Detalles sobre la entrega</Text>
          <Entypo
            name={deliveryDetails ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {deliveryDetails && (
          <View style={styles.delivery_container}>
            <View style={styles.delivery_details_row}>
              <MaterialIcons
                name="directions-bike"
                size={18}
                color="black"
                style={styles.delivery_details_icon}
              />
              <View>
                <Text style={styles.delivery_details_title}>
                  Tipo de entrega
                </Text>
                <Text>Retiro por el local</Text>
              </View>
            </View>
            <View style={styles.line}></View>
            <View style={styles.delivery_details_row}>
              <MaterialIcons
                name="storefront"
                size={18}
                color="black"
                style={styles.delivery_details_icon}
              />
              <View>
                <Text style={styles.delivery_details_title}>Dirección</Text>
                <Text>
                  {order.business.street} {order.business.number}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgb(242, 242, 242)",
  },
  header: {
    width: "100%",
    height: 190,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  header_body: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  header_options: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  support_btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 3,
  },
  support_btn_text: {
    fontSize: 12,
    fontWeight: "bold",
    marginStart: 5,
  },
  business_name: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#f8f9fa",
    marginBottom: 10,
  },
  open_business_btn: {
    alignSelf: "center",
  },
  open_business_btn_text: {
    fontWeight: "bold",
    fontSize: 12,
    textDecorationLine: "underline",
    color: "#f8f9fa",
  },
  state_container: {
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  order_state: {
    fontSize: 16,
    fontWeight: "bold",
  },
  order_date: {
    fontSize: 12,
    opacity: 0.7,
    marginVertical: 10,
  },
  order_again_btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e31010",
    borderRadius: 3,
    paddingVertical: 10,
    width: "100%",
  },
  order_again_btn_text: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f8f9fa",
    marginStart: 6,
  },
  option_container: {
    marginBottom: 10,
  },
  option_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  option_title: {
    fontSize: 16,
    fontWeight: "500",
  },
  product_info_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  product_image_description_container: {
    flexDirection: "row",
  },
  product_img: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#dee2e6",
    marginEnd: 20,
  },
  product_amount_price_container: {
    alignItems: "flex-end",
  },
  product_description: {
    fontWeight: "600",
  },
  product_amount: {
    fontWeight: "600",
  },
  product_price: {
    fontWeight: "600",
  },
  payment_info_container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  payment_info_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  line: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  total: {
    fontSize: 16,
    fontWeight: "500",
  },
  payment_method_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  payment_method_row: {
    flexDirection: "row",
    alignItems: "center",
  },
  mp_logo: {
    width: 100,
    height: 40.6,
    marginEnd: 10,
  },
  delivery_container: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  delivery_details_row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  delivery_details_icon: {
    marginEnd: 20,
  },
  delivery_details_title: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 5,
  },
});
