import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { openBrowserAsync } from "expo-web-browser";
import { useRoute, useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Constants from "expo-constants";

export default function Order() {
  const route = useRoute();
  const { user, business, cart, products, subtotal } = route?.params;
  const API_URL = Constants.expoConfig.extra.APP_URL;
  const navigation = useNavigation();

  const [preference, setPreference] = useState(null);

  const getImage = (image) => {
    return { uri: `${API_URL}/uploads/${image}` };
  };

  // Crear preferencia de pago
  useEffect(() => {
    const createPreference = async () => {
      const productData = cart.map((item) => {
        const product = products.get(item.fk_carts_products);
        return {
          product,
          quantity: item.quantity,
        };
      });

      const items = productData.map((productData) => ({
        id: productData.product.id,
        title: productData.product.model,
        quantity: productData.quantity,
        unit_price: productData.product.price,
      }));

      const preference_mp = {
        items: items,
        external_reference: `${Date.now()}`,
        back_urls: {
          success: "acme://payment/success",
          failure: "acme://payment/failure",
          pending: "acme://payment/pending",
        },
        payer: {
          name: user.email,
        },
        metadata: {
          business: business,
        },
        auto_return: "approved",
        notification_url:
          "https://880a-45-186-25-188.ngrok-free.app/mpPaymentNotification",
      };

      try {
        const response = await fetch(
          "https://api.mercadopago.com/checkout/preferences",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.EXPO_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(preference_mp),
          }
        );

        const data = await response.json();
        setPreference(data.init_point);
      } catch (error) {
        console.error("Error al llamar al servicio de Mercado Pago:", error);
      }
    };

    createPreference();
  }, [cart, products, user, business, API_URL]);

  return (
    <ScrollView style={styles.content}>
      <View style={styles.header}>
        <Entypo
          name="chevron-left"
          size={32}
          color="grey"
          onPress={navigation.goBack}
        />
        <Image
          source={require("../assets/logos/logo_circle.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>Información</Text>
      <View style={styles.card}>
        <View style={styles.step_container}>
          <Text style={styles.step_number}>1 -</Text>
          <Text style={styles.step_title}>Email</Text>
        </View>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.step_container}>
          <Text style={styles.step_number}>2 -</Text>
          <Text style={styles.step_title}>Identificacón</Text>
        </View>
        <View style={styles.props_container}>
          <Text style={styles.prop_name}>Nombre:</Text>
          <Text style={styles.prop}>
            {user.name} {user.lastname}
          </Text>
        </View>
        <View style={styles.props_container}>
          <Text style={styles.prop_name}>Teléfono:</Text>
          <Text style={styles.prop}>{user.phone}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.step_container}>
          <Text style={styles.step_number}>3 -</Text>
          <Text style={styles.step_title}>Retiro en el local</Text>
        </View>
        <Text style={styles.third_step_description}>
          Te notificamos cuando tu pedido esté preparado!
        </Text>
      </View>
      <View style={styles.payment_card}>
        <Text style={styles.payment_card_title}>Resumen</Text>
        {cart.map((item) => {
          const product = products.get(item.fk_carts_products);
          if (!product) return null;

          return (
            <View key={product.id}>
              <View style={styles.product_container}>
                <Image
                  source={getImage(product.image)}
                  style={styles.product_image}
                />
                <View style={styles.product_details_container}>
                  <Text style={styles.model}>{product.model}</Text>
                  <View style={styles.details}>
                    <Text style={styles.quantity}>
                      Cantidad: {item.quantity}
                    </Text>
                    <Text style={styles.text_success}>$ {product.price}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.line}></View>
            </View>
          );
        })}
        <View style={styles.cupon_container}>
          <View style={styles.cupon_text_container}>
            <MaterialIcons name="discount" size={16} color="black" />
            <Text style={styles.cupon_text}>Cupón de descuento</Text>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <AntDesign name="plus" size={16} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.line}></View>
        <View style={styles.details}>
          <Text style={styles.prop}>Subtotal</Text>
          <Text style={styles.prop}>$ {subtotal}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.prop}>Tarifa de servicio</Text>
          <Text style={styles.prop}>$ 300</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.prop}>Retiro por el local</Text>
          <Text style={styles.text_success}>Gratis</Text>
        </View>
        <View style={styles.line}></View>
        <View style={styles.details}>
          <Text style={styles.text_success}>Total</Text>
          <Text style={styles.text_success}>$ {subtotal + 300}</Text>
        </View>
        {preference != null && (
          <TouchableOpacity
            style={styles.mp_btn}
            onPress={() => {
              openBrowserAsync(preference);
              navigation.navigate("Home");
            }}
          >
            <Text style={styles.mp_btn_text}>Comprar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
  },
  header: {
    height: 77,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#dee2e6",
    marginBottom: 48,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  title: {
    marginStart: 12,
    marginBottom: 32,
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    width: "auto",
    padding: 8,
    paddingBottom: 48,
    marginHorizontal: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.175)",
    borderRadius: 6,
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
  },
  step_container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderStartWidth: 2,
    borderColor: "#e31010",
  },
  step_number: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#e31010",
    marginEnd: 8,
  },
  step_title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  email: {
    fontSize: 18,
    opacity: 0.5,
    marginStart: 24,
  },
  props_container: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: 24,
  },
  prop_name: {
    marginEnd: 8,
  },
  prop: {
    opacity: 0.5,
  },
  third_step_description: {
    opacity: 0.5,
    marginHorizontal: 24,
    lineHeight: 15,
  },
  payment_card: {
    width: "auto",
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.175)",
    borderRadius: 6,
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
  },
  payment_card_title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  product_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  product_image: {
    width: 62,
    height: 62,
  },
  product_details_container: {
    flex: 1,
  },
  model: {
    fontSize: 12,
    fontWeight: "bold",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quantity: {
    fontSize: 12,
    opacity: 0.75,
  },
  text_success: {
    color: "#198754",
    opacity: 0.75,
  },
  line: {
    marginVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  cupon_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    opacity: 0.75,
  },
  cupon_text_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  cupon_text: {
    marginStart: 10,
  },
  mp_btn: {
    width: "100%",
    backgroundColor: "#e31010",
    marginTop: 24,
    marginBottom: 8,
    borderRadius: 50,
    paddingVertical: 14,
  },
  mp_btn_text: {
    color: "#f8f9fa",
    fontWeight: "bold",
    textAlign: "center",
  },
});
