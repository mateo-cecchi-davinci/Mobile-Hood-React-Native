import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function OrdersFiltersModal({ visible, onClose, setFilter }) {
  const periods = [
    "Última semana",
    "Últimos 15 días",
    "Últimos 30 días",
    "Últimos 3 meses",
    "Últimos 6 meses",
  ];
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleApplyFilters = () => {
    setFilter({
      status: selectedStatus,
      period: selectedPeriod,
    });
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modal_body}>
        <AntDesign
          name="close"
          size={24}
          color="black"
          onPress={() => onClose()}
        />
        <View style={styles.modal_header}>
          <Text style={styles.modal_title}>Filtrar por</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedPeriod("");
              setSelectedStatus("");
              setFilter({
                status: "",
                period: "",
              });
            }}
          >
            <Text style={styles.clean_filters_btn}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.modal_subtitle}>Período</Text>
        {periods.map((period) => (
          <View key={period} style={styles.filter_container}>
            <Text>{period}</Text>
            <TouchableOpacity
              onPress={() => setSelectedPeriod(period)}
              style={
                selectedPeriod === period
                  ? styles.selected_filter
                  : styles.filter
              }
            ></TouchableOpacity>
          </View>
        ))}
        <View style={styles.line}></View>
        <Text style={styles.modal_subtitle}>Estado</Text>
        <View style={styles.filter_container}>
          <Text>Entregados</Text>
          <TouchableOpacity
            onPress={() => setSelectedStatus("Entregados")}
            style={
              selectedStatus === "Entregados"
                ? styles.selected_filter
                : styles.filter
            }
          ></TouchableOpacity>
        </View>
        <View style={styles.filter_container}>
          <Text>Cancelados</Text>
          <TouchableOpacity
            onPress={() => setSelectedStatus("Rechazados")}
            style={
              selectedStatus === "Rechazados"
                ? styles.selected_filter
                : styles.filter
            }
          ></TouchableOpacity>
        </View>
        <View style={styles.modal_footer}>
          <TouchableOpacity
            onPress={handleApplyFilters}
            style={styles.apply_filters_btn}
          >
            <Text style={styles.apply_filters_btn_text}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal_body: {
    height: "100%",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  modal_header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  modal_title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clean_filters_btn: {
    fontSize: 12,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  modal_subtitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 10,
  },
  filter_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  filter: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "black",
  },
  selected_filter: {
    width: 20,
    height: 20,
    borderWidth: 5,
    borderRadius: 50,
    borderColor: "black",
  },
  line: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  modal_footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    boxShadow: "0 -8 16 rgba(0, 0, 0, 0.15)",
  },
  apply_filters_btn: {
    backgroundColor: "#e31010",
    borderRadius: 5,
    paddingVertical: 14,
    width: "100%",
  },
  apply_filters_btn_text: {
    alignSelf: "center",
    fontWeight: "bold",
    color: "#f8f9fa",
  },
});
