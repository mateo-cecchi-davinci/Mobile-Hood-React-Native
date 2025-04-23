import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.APP_URL;

export default function ConfirmInfo({
  businessName,
  logo,
  frontPage,
  street,
  number,
  lat,
  lng,
  name,
  lastname,
  email,
  phone,
  setStep,
}) {
  const businessData = [
    ["Nombre del local", businessName],
    ["Logo", logo.uri],
    ["Foto de Portada", frontPage.uri],
  ];
  const locationData = [
    ["Calle", street],
    ["Número", number],
  ];
  const personalData = [
    ["Nombre", name],
    ["Apellido", lastname],
    ["Email", email],
    ["Teléfono", phone],
  ];

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("businessName", businessName);
      formData.append("street", street);
      formData.append("number", number);
      formData.append("lat", lat);
      formData.append("lng", lng);
      formData.append("email", email);

      const getMimeType = (uri) => {
        const extension = uri.split(".").pop().toLowerCase();
        switch (extension) {
          case "jpg":
          case "jpeg":
            return "image/jpeg";
          case "png":
            return "image/png";
          case "webp":
            return "image/webp";
          default:
            return "application/octet-stream"; // Tipo MIME genérico
        }
      };

      if (logo) {
        formData.append("logo", {
          uri: logo.uri,
          name: `logo.${logo.uri.split(".").pop()}`, // Extraer la extensión del archivo
          type: getMimeType(logo.uri), // Determinar el tipo MIME dinámicamente
        });
      }

      if (frontPage) {
        formData.append("frontPage", {
          uri: frontPage.uri,
          name: `frontPage.${frontPage.uri.split(".").pop()}`, // Extraer la extensión del archivo
          type: getMimeType(frontPage.uri), // Determinar el tipo MIME dinámicamente
        });
      }

      const response = await fetch(`${API_URL}/signBusiness`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <>
      <Text style={styles.title}>Revisá tus datos</Text>
      <View style={styles.line}></View>
      <View style={styles.row}>
        <Text style={styles.row_title}>Datos del negocio</Text>
        <TouchableOpacity onPress={() => setStep(0)}>
          <Text style={styles.row_btn_text}>Editar</Text>
        </TouchableOpacity>
      </View>
      {businessData.map((data) => (
        <View key={data[0]} style={styles.row}>
          <Text style={styles.row_subtitle}>{data[0]}</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.row_text}>
            {data[1]}
          </Text>
        </View>
      ))}
      <View style={styles.line}></View>
      <View style={styles.row}>
        <Text style={styles.row_title}>Dirección del negocio</Text>
        <TouchableOpacity onPress={() => setStep(1)}>
          <Text style={styles.row_btn_text}>Editar</Text>
        </TouchableOpacity>
      </View>
      {locationData.map((data) => (
        <View key={data[0]} style={styles.row}>
          <Text style={styles.row_subtitle}>{data[0]}</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.row_text}>
            {data[1]}
          </Text>
        </View>
      ))}
      <View style={styles.line}></View>
      <View style={styles.row}>
        <Text style={styles.row_title}>Información personal</Text>
      </View>
      {personalData.map((data) => (
        <View key={data[0]} style={styles.row}>
          <Text style={styles.row_subtitle}>{data[0]}</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.row_text}>
            {data[1]}
          </Text>
        </View>
      ))}
      <View style={styles.line}></View>
      <View style={styles.btn_row}>
        <TouchableOpacity onPress={() => setStep(1)}>
          <Text style={styles.go_back}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSubmit()} style={styles.btn}>
          <Text style={styles.btn_text}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
  },
  line: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  row_title: {
    fontWeight: "600",
    fontSize: 16,
  },
  row_btn_text: {
    color: "#e31010",
    fontWeight: "600",
  },
  row_subtitle: {
    color: "#6b6b6b",
  },
  row_text: {
    maxWidth: 200,
  },
  btn_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 10,
  },
  go_back: {
    color: "#e31010",
    fontWeight: "600",
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#e31010",
    borderRadius: 3,
  },
  btn_text: {
    color: "#f8f9fa",
    fontWeight: "600",
  },
});
