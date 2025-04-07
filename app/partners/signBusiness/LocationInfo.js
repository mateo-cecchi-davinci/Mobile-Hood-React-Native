import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import Constants from "expo-constants";

const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

export default function LocationInfo({
  street,
  setStreet,
  number,
  setNumber,
  setLat,
  setLng,
}) {
  const [showAddressInputs, setShowAddressInputs] = useState(
    !!(street || number)
  );

  const [origin, setOrigin] = useState({
    latitude: -34.6156548,
    longitude: -58.5156988,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  async function getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permiso de ubicación denegado");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setOrigin(current);
      setLat(current.latitude);
      setLng(current.longitude);
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
    }
  }

  async function getAddressFromCoordinates(lat, lng) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;

        // Extraer calle y número de los componentes de la dirección
        const streetComponent = addressComponents.find((component) =>
          component.types.includes("route")
        );
        const numberComponent = addressComponents.find((component) =>
          component.types.includes("street_number")
        );

        setStreet(streetComponent ? streetComponent.long_name : "");
        setNumber(numberComponent ? numberComponent.long_name : "");
        setShowAddressInputs(true);
      }
    } catch (error) {
      console.error("Error al obtener la dirección:", error);
    }
  }

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setOrigin({ latitude, longitude });
    getAddressFromCoordinates(latitude, longitude);
  };

  return (
    <>
      <Text style={styles.form_title}>¿Dónde se encuentra tu local?</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          longitudeDelta: 0.01,
          latitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        style={styles.map}
      >
        <Marker coordinate={origin} draggable />
      </MapView>
      {showAddressInputs && (
        <>
          <View>
            <Text style={styles.label}>Calle</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              numberOfLines={1}
              ellipsizeMode="tail"
            />
          </View>
          <View>
            <Text style={styles.label}>Número</Text>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={setNumber}
              numberOfLines={1}
              ellipsizeMode="tail"
            />
          </View>
        </>
      )}
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
  map: {
    width: "100%",
    height: 230,
    marginVertical: 20,
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
