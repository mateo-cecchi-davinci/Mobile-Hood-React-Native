import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <Image
        source={require("../assets/logo_circle.png")}
        style={styles.logo}
      />
      <TouchableOpacity
        style={styles.partnerBtn}
        onPress={() => alert("Botón presionado")}
      >
        <Text style={styles.partnerBtnText}>Hacete partner</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  partnerBtn: {
    backgroundColor: "#e31010",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  partnerBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
