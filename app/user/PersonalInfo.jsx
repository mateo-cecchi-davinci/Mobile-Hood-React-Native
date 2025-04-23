import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PersonalInfo() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params?.user;

  return (
    <View style={styles.content}>
      <View style={styles.title_container}>
        <TouchableOpacity
          onPress={() => navigation.navigate("UserProfile", { user: user })}
        >
          <Entypo name="chevron-left" size={32} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Información personal</Text>
      </View>
      <TouchableOpacity
        style={styles.options}
        onPress={() =>
          navigation.navigate("EditPersonalInfo", {
            user: user,
          })
        }
      >
        <View>
          <Text style={styles.subtitle}>Mis datos personales</Text>
          <Text style={styles.description}>
            Nombre, fecha de nacimiento y género
          </Text>
        </View>
        <Entypo name="chevron-right" size={16} color="black" />
      </TouchableOpacity>
      <View style={styles.options}>
        <View>
          <Text style={styles.subtitle}>Número de celular</Text>
          <View style={styles.description_container}>
            <AntDesign
              name="checkcircleo"
              size={12}
              color="grey"
              style={styles.icon}
            />
            <Text style={styles.description}>+{user.phone}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.edit_btn}>Editar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.options}>
        <View>
          <Text style={styles.subtitle}>E-mail</Text>
          <View style={styles.description_container}>
            <AntDesign
              name="checkcircleo"
              size={12}
              color="grey"
              style={styles.icon}
            />
            <Text style={styles.description}>{user.email}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.edit_btn}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  title_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginStart: 10,
    marginVertical: 20,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  subtitle: {
    fontWeight: "500",
    fontSize: 14,
  },
  description_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    opacity: 0.5,
    fontSize: 12,
  },
  icon: {
    marginTop: 2,
    marginEnd: 5,
  },
  edit_btn: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
