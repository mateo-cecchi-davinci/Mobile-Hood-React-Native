import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function BusinessInfo({
  businessName,
  setBusinessName,
  logo,
  setLogo,
  frontPage,
  setFrontPage,
}) {
  const pickLogo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLogo(result.assets[0]);
    }
  };

  const pickFront = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      setFrontPage(result.assets[0]);
    }
  };

  return (
    <>
      <Text style={styles.form_title}>Cuéntanos acerca de tu negocio</Text>
      <View>
        <Text style={styles.label}>Nombre del local</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          numberOfLines={1}
          ellipsizeMode="tail"
        />
      </View>
      <View>
        <Text style={styles.label}>Logo</Text>
        <TouchableOpacity onPress={pickLogo}>
          <TextInput
            style={styles.input}
            value={logo?.uri || ""}
            editable={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            placeholder="Seleccioná el logo de tu negocio"
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.label}>Portada</Text>
        <TouchableOpacity onPress={pickFront}>
          <TextInput
            style={styles.input}
            value={frontPage?.uri || ""}
            editable={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            placeholder="Seleccioná la foto de portada de tu negocio"
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  form_title: {
    marginVertical: 20,
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
  },
  label: {
    marginStart: 10,
    paddingHorizontal: 5,
    color: "#6b6b6b",
    backgroundColor: "#f8f9fa",
    position: "absolute",
    top: 3,
    zIndex: 1,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "dark(rgb(215, 215, 215), rgb(215, 215, 215))",
    borderRadius: 5,
    paddingHorizontal: 16,
    marginVertical: 15,
  },
});
