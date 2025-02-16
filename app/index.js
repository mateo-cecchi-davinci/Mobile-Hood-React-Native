import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";

export default function HomeScreen() {
  const [businesses, setBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const businessesPerPage = 6;

  // Función para obtener los negocios desde la API de Laravel
  const fetchBusinesses = async () => {
    try {
      const response = await fetch("http://192.168.100.35:8000/stores"); // Cambia a la URL de tu servidor
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

  const handleNextPage = () => {
    if (currentPage * businessesPerPage < businesses.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculamos los negocios a mostrar según la página actual
  const businessesToShow = businesses.slice(
    (currentPage - 1) * businessesPerPage,
    currentPage * businessesPerPage
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Navbar />
        <SearchBar />

        {/* Titulo */}
        <Text style={styles.title}>{businesses.length} locales</Text>

        {/* Lista de negocios */}
        <FlatList
          data={businessesToShow}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.logo }} style={styles.logo} />
              <Text style={styles.businessName}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal={false} // Para que se muestren en columna
          numColumns={2} // Muestra 2 negocios por fila
        />

        {/* Botones de paginación */}
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={handlePrevPage}
            style={styles.paginationButton}
          >
            <Text style={styles.paginationText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNextPage}
            style={styles.paginationButton}
          >
            <Text style={styles.paginationText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 15,
    margin: 10,
    width: 160,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  paginationButton: {
    backgroundColor: "#e31010",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  paginationText: {
    color: "#fff",
    fontSize: 16,
  },
});
