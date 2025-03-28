import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Footer() {
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user").then(JSON.parse);
      setIsAuthenticated(!!token);
      setUser(user);
    };
    checkAuth();
  }, []);

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerContent}
        onPress={() => navigation.navigate("Home")}
      >
        <AntDesign name="home" size={16} color="black" style={styles.opacity} />
        <Text style={styles.text}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={styles.footerContent}>
        <AntDesign
          name="hearto"
          size={16}
          color="black"
          style={styles.opacity}
        />
        <Text style={styles.text}>Mis favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(isAuthenticated ? "Orders" : "Login", {
            user: user,
          })
        }
        style={styles.footerContent}
      >
        <Feather
          name="shopping-cart"
          size={16}
          color="black"
          style={styles.opacity}
        />
        <Text style={styles.text}>Pedidos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerContent}
        onPress={() =>
          navigation.navigate(isAuthenticated ? "UserProfile" : "Login", {
            user: user,
          })
        }
      >
        <AntDesign name="user" size={16} color="black" style={styles.opacity} />
        <Text style={styles.text}>Mi perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#dee2e6",
  },
  footerContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  opacity: {
    opacity: 0.7,
  },
  text: {
    fontWeight: "bold",
    opacity: 0.7,
    color: "#212529",
  },
});
