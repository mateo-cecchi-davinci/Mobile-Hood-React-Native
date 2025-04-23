import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import MenuModal from "./MenuModal";

export default function Menu({ categories, scrollToCategory }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.background}>
      <FlatList
        data={[{ id: "menu" }, ...categories]}
        horizontal={true}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flat_list}
        renderItem={({ item }) =>
          item.id === "menu" ? (
            <TouchableOpacity
              style={styles.menu}
              onPress={() => setModalVisible(true)}
            >
              <AntDesign name="search1" size={20} color="black" />
              <View style={styles.menu_btn}>
                <Text style={styles.menu_btn_text}>Menú</Text>
                <Entypo name="chevron-down" size={12} color="#212529" />
              </View>
              <View style={styles.line}></View>
            </TouchableOpacity>
          ) : item.products.length > 0 ? (
            <TouchableOpacity
              style={styles.categories_btn}
              onPress={() => scrollToCategory(item.id)}
            >
              <Text style={styles.categories_btn_text}>{item.name}</Text>
            </TouchableOpacity>
          ) : null
        }
      />
      <MenuModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        categories={categories}
        scrollToCategory={scrollToCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flexDirection: "row",
  },
  menu: {
    flexDirection: "row",
    alignItems: "center",
  },
  menu_btn: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: 10,
    backgroundColor: "#e2e3e5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  menu_btn_text: {
    fontSize: 12,
    marginEnd: 2,
    fontWeight: "bold",
    color: "#212529",
  },
  line: {
    marginHorizontal: 16,
    height: 30,
    borderRightWidth: 1,
    borderRightColor: "rgb(234, 227, 227)",
  },
  categories: {
    flexDirection: "row",
    alignItems: "center",
  },
  categories_btn: {
    marginEnd: 10,
    backgroundColor: "#e2e3e5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  categories_btn_text: {
    fontSize: 12,
    marginEnd: 2,
    fontWeight: "bold",
    color: "#212529",
  },
  flat_list: {
    marginVertical: 20,
    marginHorizontal: 40,
  },
});
