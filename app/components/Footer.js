import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

export const Footer = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <AntDesign name="home" size={16} color="black" />
        <Text>Inicio</Text>
      </View>
      <View style={styles.footerContent}>
        <AntDesign name="hearto" size={16} color="black" />
        <Text>Mis favoritos</Text>
      </View>
      <View style={styles.footerContent}>
        <Feather name="shopping-cart" size={16} color="black" />
        <Text>Pedidos</Text>
      </View>
      <View style={styles.footerContent}>
        <AntDesign name="user" size={16} color="black" />
        <Text>Mi perfil</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  footerContent: {
    opacity: 0.75,
    flexDirection: "column",
    alignItems: "center",
  },
});
