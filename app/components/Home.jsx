import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import Footer from "./Footer";

import Constants from "expo-constants";

import AntDesign from "@expo/vector-icons/AntDesign";

const API_URL = Constants.expoConfig.extra.APP_URL;

export default Home = () => {
  const [businesses, setBusinesses] = useState([]);
  const navigation = useNavigation();

  // Función para obtener los negocios
  const fetchBusinesses = async () => {
    try {
      const response = await fetch(`${API_URL}/businesses`);
      const data = await response.json();
      setBusinesses(data); // Guarda los negocios obtenidos en el estado
    } catch (error) {
      console.error("Error al obtener los negocios:", error);
    }
  };

  // Llamada a la API al cargar el componente
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const getBusinessLogo = (logo) => {
    if (logo && logo.startsWith("http")) {
      // Si el logo tiene una URL completa, usarla directamente
      return { uri: logo };
    }

    // Aquí utilizamos la URL base de tu API + la ruta del logo
    const logoUrl = `${API_URL}/uploads/${logo}`;

    return { uri: logoUrl };
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <SearchBar />

      {/* Titulo */}
      <Text style={styles.title}>{businesses.length} locales</Text>

      {/* Lista de negocios */}
      <FlatList
        data={businesses}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("BusinessProfile", { businessId: item.id })
            }
          >
            <View style={styles.card}>
              <View style={styles.content}>
                <Image
                  source={getBusinessLogo(item.logo)}
                  style={styles.logo}
                />
                <View>
                  <View style={styles.content}>
                    <Text style={styles.businessName}>{item.name}</Text>
                    <AntDesign name="hearto" size={16} color="black" />
                  </View>
                  <View style={styles.content}>
                    <AntDesign
                      name="creditcard"
                      size={16}
                      color="black"
                      style={styles.opacity}
                    />
                    <Text style={styles.cardDescriptionText}>
                      Acepta pago online
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.raiting}>
                <AntDesign
                  name="star"
                  size={16}
                  color="orange"
                  style={styles.starIcon}
                />
                <Text>3.9</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal={false}
        numColumns={1}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
    marginTop: 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 20,
    margin: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "dark(rgb(225, 225, 225), rgb(225, 225, 225))",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
  },
  logo: {
    marginEnd: 20,
    width: 66,
    height: 66,
    resizeMode: "contain",
    borderWidth: 1,
    borderRadius: 5,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    marginEnd: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardDescriptionText: {
    marginStart: 5,
    opacity: 0.75,
  },
  raiting: {
    flexDirection: "row",
  },
  starIcon: {
    marginTop: 2,
    marginEnd: 4,
  },
  opacity: {
    opacity: 0.75,
  },
});
