import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = Constants.expoConfig.extra.APP_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const login = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        navigation.navigate("Home"); // Redirige al home
      } else {
        console.error("Error en login:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.background}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Por favor inicie sesión</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.btn_container}>
        <TouchableOpacity style={styles.login_btn} onPress={login}>
          <Text style={styles.login_btn_text}>Continuar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sign_in_btn}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.sign_in_btn_text}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    padding: 24,
    backgroundColor: "#f9f6f4",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 16,
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 5,
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
  },
  input: {
    width: "100%",
    height: 48,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "dark(rgb(215, 215, 215), rgb(215, 215, 215))",
    borderRadius: 5,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  login_btn: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    backgroundColor: "#e31010",
    width: "100%",
    borderRadius: 5,
    marginVertical: 10,
  },
  login_btn_text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f8f9fa",
    textAlign: "center",
  },
  sign_in_btn: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    backgroundColor: "#e31010",
    width: "100%",
    borderRadius: 5,
    marginVertical: 10,
  },
  sign_in_btn_text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f8f9fa",
    textAlign: "center",
  },
  btn_container: {
    position: "absolute",
    bottom: 20,
    start: 20,
    end: 20,
  },
});
