import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.APP_URL;

export default function EditPersonalInfo() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params?.user;
  const [name, setName] = useState(user?.name);
  const [lastname, setLastName] = useState(user?.lastname);

  const editPersonalInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/editPersonalInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: user?.id, name, lastname }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        navigation.navigate("PersonalInfo", {
          user: data.user,
        });
      } else {
        console.error("Error en login:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.content}>
      <View>
        <View style={styles.title_container}>
          <TouchableOpacity
            onPress={() => navigation.navigate("PersonalInfo", { user: user })}
          >
            <Entypo
              name="chevron-left"
              size={32}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Mis datos personales</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.subtitle}>¿Cómo te llamás?</Text>
          <View style={styles.name}>
            <Text style={styles.label}>Nombre(s)*</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <Text style={styles.label}>Apellido(s)*</Text>
          <TextInput
            style={styles.input}
            value={lastname}
            onChangeText={setLastName}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.btn} onPress={editPersonalInfo}>
        <Text style={styles.btn_text}>Guardar cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  title_container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  icon: {
    marginEnd: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 24,
  },
  form: {
    backgroundColor: "white",
    padding: 20,
    boxShadow: "0 5 10 rgba(0, 0, 0, 0.15)",
    marginTop: 40,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
  },
  name: {
    marginBottom: 20,
  },
  label: {
    opacity: 0.5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "dark(rgb(215, 215, 215), rgb(215, 215, 215))",
    borderRadius: 5,
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  btn: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    backgroundColor: "#e31010",
    width: "100%",
    borderRadius: 5,
    marginVertical: 10,
  },
  btn_text: {
    fontWeight: "bold",
    color: "#f8f9fa",
    textAlign: "center",
  },
});
