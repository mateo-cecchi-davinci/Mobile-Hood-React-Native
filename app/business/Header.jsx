import React from "react";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import Constants from "expo-constants";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";

const API_URL = Constants.expoConfig.extra.APP_URL;

const getBusinessFront = (front) => {
  if (!front) return null;
  if (front.startsWith("http")) return { uri: front };

  return {
    uri: `${API_URL.replace(/\/$/, "")}/uploads/${front.replace(/^\/+/, "")}`,
  };
};

export default function Header({ business }) {
  const imageSource = getBusinessFront(business?.frontPage);

  return (
    <View style={styles.header}>
      {imageSource ? (
        <ImageBackground source={imageSource} style={styles.background}>
          {/* Contenido encima de la imagen */}
          <View style={styles.overlay} />

          <View style={styles.content}>
            <Text style={styles.businessName}>{business?.name}</Text>
            <View style={styles.flex_location}>
              <Text style={styles.location}>
                {business?.street} {business?.number}
              </Text>
              <FontAwesome6
                name="location-dot"
                size={12}
                color="white"
                style={styles.location_icon}
              />
            </View>
            <View style={styles.rating_container}>
              <View style={styles.rating}>
                <FontAwesome
                  name="star"
                  size={12}
                  color="#657d02"
                  style={styles.rating_icon}
                />
                <Text style={styles.rating_number}>4.2</Text>
              </View>
              <Text style={styles.rating_total}>(1061)</Text>
            </View>
            <View style={styles.search_box}>
              <TextInput
                style={styles.input}
                placeholder="Buscar..."
                value={""}
                onChangeText={() => {}} // Captura el texto del input
              />
              <Ionicons
                name="search"
                size={20}
                color="#999"
                style={styles.search_icon}
              />
            </View>
          </View>
        </ImageBackground>
      ) : (
        <Text>No se encuentra la imagen de portada</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 230,
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Oscurece la imagen de fondo
  },
  content: {
    paddingHorizontal: 20,
  },
  businessName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  location: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "semibold",
    marginBottom: 6,
  },
  location_icon: {
    marginStart: 6,
    marginBottom: 6,
  },
  flex_location: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebf0ca",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  rating_number: {
    color: "#657d02",
    fontSize: 12,
  },
  rating_icon: {
    marginEnd: 3,
  },
  rating_total: {
    marginStart: 10,
    color: "white",
    fontSize: 12,
  },
  search_box: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "dark(rgb(225, 225, 225), rgb(225, 225, 225))",
  },
  search_icon: {
    marginRight: 10,
    color: "#ffffff",
    backgroundColor: "#e31010",
    padding: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
});
