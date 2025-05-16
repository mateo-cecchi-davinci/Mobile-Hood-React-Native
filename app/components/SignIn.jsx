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

const API_URL = Constants.expoConfig.extra.APP_URL;

export default function Login() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigation = useNavigation();

  const signIn = async () => {
    try {
      const response = await fetch(`${API_URL}/signIn`, {
        method: "POST", // Especificamos que es una petición POST
        headers: {
          "Content-Type": "application/json", // Indicamos que enviamos JSON
        },
        body: JSON.stringify({
          name,
          lastname,
          email,
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate("Home");
      } else {
        console.error("Error en el registro:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.background}>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Registrarse</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={lastname}
          onChangeText={setLastname}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={phone}
          onChangeText={setPhone}
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
        <TouchableOpacity style={styles.login_btn} onPress={() => signIn()}>
          <Text style={styles.login_btn_text}>Continuar</Text>
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
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.75,
    marginBottom: 16,
    marginStart: 4,
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
