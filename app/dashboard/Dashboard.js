import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Menu from "./sections/menu/Menu";

export default function Dashboard() {
  const route = useRoute();
  const { business, user } = route.params;
  const [businessData, setBusiness] = useState(business);
  const navigation = useNavigation();
  const [sidebar, setSideBar] = useState(false);
  const [section, setSection] = useState(0);

  const handleSideBar = () => {
    setSideBar(!sidebar);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    navigation.navigate("Home");
  };

  return (
    <ScrollView>
      <View style={{ minHeight: "100%" }}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => handleSideBar()}>
            <Entypo name="menu" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.nav_user_info_row}>
            <View>
              <Text style={styles.nav_username}>{user.name}</Text>
              <Text style={styles.nav_rol}>Partner</Text>
            </View>
            <View style={styles.nav_img_container}>
              <Text style={styles.nav_img}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        {sidebar && (
          <View style={styles.sidebar}>
            <View style={styles.sidebar_header}>
              <View style={styles.sidebar_header_row}>
                <Image
                  source={require("../assets/logos/logo_red_background.png")}
                  style={styles.sidebar_header_img}
                />
                <Text style={styles.sidebar_title}>Dashboard</Text>
                <TouchableOpacity onPress={() => handleSideBar()}>
                  <AntDesign name="arrowleft" size={18} color="#f8f9fa" />
                </TouchableOpacity>
              </View>
              <Text style={styles.sidebar_header_username}>{user.name}</Text>
              <Text style={styles.sidebar_header_email}>{user.email}</Text>
            </View>
            <View style={styles.sidebar_body}>
              <View style={styles.sidebar_body_img_container}>
                <Text style={styles.sidebar_body_img}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.sidebar_row}
              >
                <Entypo name="home" size={18} color="black" />
                <Text style={styles.sidebar_row_item}>Inicio</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.sidebar_row}>
                <FontAwesome5
                  name="book"
                  size={14}
                  color="black"
                  style={{ marginStart: 3 }}
                />
                <Text style={styles.sidebar_row_item}>Menú</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.sidebar_row}>
                <MaterialIcons name="cached" size={18} color="black" />
                <Text style={styles.sidebar_row_item}>Pedidos en curso</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.sidebar_row}>
                <AntDesign
                  name="reload1"
                  size={15}
                  color="black"
                  style={{ marginStart: 1 }}
                />
                <Text style={styles.sidebar_row_item}>Pedidos recientes</Text>
              </TouchableOpacity>
              <View style={styles.line}></View>
              <TouchableOpacity onPress={() => {}} style={styles.sidebar_row}>
                <Ionicons name="alarm" size={18} color="black" />
                <Text style={styles.sidebar_row_item}>Horarios</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("UserProfile", { user })}
                style={styles.sidebar_row}
              >
                <FontAwesome6
                  name="user-large"
                  size={14}
                  color="black"
                  style={{ marginStart: 2 }}
                />
                <Text style={styles.sidebar_row_item}>Mi cuenta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => logout()}
                style={styles.sidebar_row}
              >
                <MaterialIcons name="exit-to-app" size={18} color="black" />
                <Text style={styles.sidebar_row_item}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Menu business={businessData} setBusiness={setBusiness} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 70,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nav_user_info_row: {
    flexDirection: "row",
    alignItems: "center",
  },
  nav_username: {
    fontWeight: "600",
    textAlign: "right",
  },
  nav_rol: {
    fontWeight: "600",
    fontSize: 12,
    color: "#6b6b6b",
    textAlign: "right",
  },
  nav_img_container: {
    borderRadius: "50%",
    borderWidth: 3,
    borderColor: "#282828",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    width: 60,
    height: 60,
    marginStart: 15,
  },
  nav_img: {
    fontSize: 24,
    fontWeight: "600",
    color: "#282828",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    height: "100%",
    width: 260,
    borderEndWidth: 1,
    borderColor: "#dee2e6",
    zIndex: 1,
  },
  sidebar_header: {
    backgroundColor: "#e31010",
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  sidebar_header_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sidebar_title: {
    color: "#f8f9fa",
    fontSize: 20,
    fontWeight: "600",
  },
  sidebar_header_img: {
    width: 40,
    height: 40,
  },
  sidebar_header_username: {
    textAlign: "center",
    color: "#f8f9fa",
    marginTop: 20,
  },
  sidebar_header_email: {
    textAlign: "center",
    color: "#f8f9fa",
    marginBottom: 20,
  },
  sidebar_body: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 32,
    paddingTop: 68,
    height: "100%",
  },
  sidebar_body_img_container: {
    borderRadius: "50%",
    borderWidth: 3,
    borderColor: "#282828",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    width: 60,
    height: 60,
    position: "absolute",
    top: -30,
    left: "50%",
  },
  sidebar_body_img: {
    fontSize: 24,
    fontWeight: "600",
    color: "#282828",
  },
  sidebar_row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  sidebar_row_item: {
    fontSize: 15,
    marginStart: 15,
  },
  line: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
});
