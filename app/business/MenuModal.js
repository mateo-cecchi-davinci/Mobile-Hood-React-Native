import React from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const MenuModal = ({ visible, onClose, categories, scrollToCategory }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                  item.products.length > 0 ? (
                    <TouchableOpacity
                      style={styles.container}
                      onPress={() => {
                        scrollToCategory(item.id);
                        onClose(); // Cierra el modal después de hacer scroll
                      }}
                    >
                      <Text style={styles.category_item}>{item.name}</Text>
                      <Text style={styles.products_amount}>
                        {item.products.length} productos
                      </Text>
                    </TouchableOpacity>
                  ) : null
                }
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "95%",
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  container: {
    marginBottom: 20,
  },
  category_item: {
    fontSize: 16,
    textAlign: "center",
    color: "#212529",
    fontWeight: "600",
  },
  products_amount: {
    opacity: 0.75,
    textAlign: "center",
    color: "#212529",
    fontSize: 12,
  },
});

export default MenuModal;
