import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <Image
        source={require("../assets/logo_circle.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: "#FFFFFF",
    paddingLeft: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});
