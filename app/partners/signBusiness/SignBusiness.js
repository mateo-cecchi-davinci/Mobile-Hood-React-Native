import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import BusinessInfo from "./BusinessInfo";
import LocationInfo from "./LocationInfo";
import ConfirmInfo from "./ConfirmInfo";

export default function SignBusiness() {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, lastname, email, phone } = route.params;

  const [step, setStep] = useState(0);

  const [{ businessName }, setBusinessName] = useState(route.params);
  const [logo, setLogo] = useState("");
  const [frontPage, setFrontPage] = useState("");

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  return (
    <View style={styles.background}>
      <View style={styles.nav}>
        <AntDesign
          name="arrowleft"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.form}>
        {step === 0 && (
          <>
            <BusinessInfo
              businessName={businessName}
              setBusinessName={setBusinessName}
              logo={logo}
              setLogo={setLogo}
              frontPage={frontPage}
              setFrontPage={setFrontPage}
            />
            <TouchableOpacity
              onPress={() => setStep(1)}
              style={styles.form_btn}
            >
              <Text style={styles.form_btn_text}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}
        {step === 1 && (
          <>
            <LocationInfo
              street={street}
              setStreet={setStreet}
              number={number}
              setNumber={setNumber}
              setLat={setLat}
              setLng={setLng}
            />
            <TouchableOpacity
              onPress={() => setStep(2)}
              style={styles.form_btn}
            >
              <Text style={styles.form_btn_text}>Continuar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStep(0)}
              style={styles.form_back_btn}
            >
              <Text style={styles.form_back_btn_text}>Volver</Text>
            </TouchableOpacity>
          </>
        )}
        {step === 2 && (
          <ConfirmInfo
            businessName={businessName}
            logo={logo}
            frontPage={frontPage}
            street={street}
            number={number}
            lat={lat}
            lng={lng}
            name={name}
            lastname={lastname}
            email={email}
            phone={phone}
            setStep={setStep}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#e31010",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
  },
  nav: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    padding: 20,
    position: "absolute",
    top: 0,
  },
  form: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
  },
  form_btn: {
    backgroundColor: "#e31010",
    borderRadius: 5,
    paddingVertical: 14,
    marginTop: 16,
  },
  form_btn_text: {
    color: "#f8f9fa",
    fontWeight: "bold",
    textAlign: "center",
  },
  form_back_btn: {
    backgroundColor: "#e31010",
    borderRadius: 5,
    paddingVertical: 14,
    marginTop: 16,
  },
  form_back_btn_text: {
    color: "#f8f9fa",
    fontWeight: "bold",
    textAlign: "center",
  },
});
