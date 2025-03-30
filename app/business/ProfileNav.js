import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";

export default function ProfileNav() {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <View style={styles.flex}>
        <Entypo
          name="chevron-left"
          size={28}
          color="grey"
          onPress={() => navigation.goBack()}
        />
        <Image
          source={require("../assets/logos/logo_circle.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.flex}>
        <TouchableOpacity onPress={() => alert("Compartir")}>
          <Feather name="share-2" size={25} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.info} onPress={() => alert("Info")}>
          <Feather name="info" size={25} color="grey" />
        </TouchableOpacity>
      </View>
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
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    marginStart: 20,
  },
});
