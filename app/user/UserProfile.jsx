import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.APP_URL;

export default function UserProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params?.user;

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    navigation.navigate("Home");
  };

  const handleDashboard = async () => {
    try {
      const id = user.id;
      const response = await fetch(`${API_URL}/dashboard/${id}`);
      const data = await response.json();

      navigation.navigate("Dashboard", {
        business: data,
        user: user,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.content}>
      <View style={styles.options}>
        <View style={styles.user_info}>
          <View style={styles.user_img_container}>
            <Text style={styles.user_img}>
              {user?.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.username}>
              {user?.name} {user?.lastname}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity
          style={styles.menu_btn_container}
          onPress={() =>
            navigation.navigate("PersonalInfo", {
              user: user,
            })
          }
        >
          <View style={styles.menu_btn_text_container}>
            <AntDesign
              name="user"
              size={16}
              color="black"
              style={styles.icon}
            />
            <Text>Información personal</Text>
          </View>
          <Entypo name="chevron-right" size={16} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu_btn_container}>
          <View style={styles.menu_btn_text_container}>
            <AntDesign
              name="hearto"
              size={16}
              color="black"
              style={styles.icon}
            />
            <Text>Favoritos</Text>
          </View>
          <Entypo name="chevron-right" size={16} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Partners", { user: user })}
          style={styles.menu_btn_container}
        >
          <View style={styles.menu_btn_text_container}>
            <MaterialIcons
              name="storefront"
              size={16}
              color="black"
              style={styles.icon}
            />
            <Text>Registrar mi negocio</Text>
          </View>
          <Entypo name="chevron-right" size={16} color="black" />
        </TouchableOpacity>
        {!!user.is_partner && (
          <TouchableOpacity
            style={styles.menu_btn_container}
            onPress={() => handleDashboard()}
          >
            <View style={styles.menu_btn_text_container}>
              <MaterialCommunityIcons
                name="monitor-dashboard"
                size={16}
                color="black"
                style={styles.icon}
              />
              <Text>Dashboard</Text>
            </View>
            <Entypo name="chevron-right" size={16} color="black" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.menu_btn_container}
          onPress={() => logout()}
        >
          <View style={styles.menu_btn_text_container}>
            <AntDesign
              name="logout"
              size={16}
              color="black"
              style={styles.icon}
            />
            <Text>Cerrar sesión</Text>
          </View>
          <Entypo name="chevron-right" size={16} color="black" />
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  user_info: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  user_img_container: {
    borderWidth: 3,
    borderColor: "white",
    borderRadius: "50%",
    backgroundColor: "#e31010",
    marginEnd: 20,
    width: 75,
    height: 75,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
  },
  user_img: {
    fontSize: 24,
    color: "white",
  },
  username: {
    fontWeight: "bold",
    fontSize: 24,
  },
  email: {
    opacity: 0.5,
  },
  options: {
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: "bold",
  },
  menu_btn_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "dark(rgb(225, 225, 225), rgb(225, 225, 225))",
    paddingVertical: 20,
  },
  menu_btn_text_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginEnd: 10,
  },
});
