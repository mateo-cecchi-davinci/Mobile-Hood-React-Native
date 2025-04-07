import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import Product from "./Product";
import AddCategoryModal from "./AddCategoryModal";
import AddProductModal from "./AddProductModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

const API_URL = Constants.expoConfig.extra.APP_URL;

export default function Menu({ business, setBusiness }) {
  const [categoryMenu, setCategoryMenu] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [categoryState, setCategoryState] = useState();

  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);

  const handleCategoryMenu = () => {
    setCategoryMenu(!categoryMenu);
  };

  const handleSelectedCategory = (category) => {
    setSelectedCategory(category);
    setCategoryState(category.is_active);
  };

  const editCategoryState = () => {
    fetch(`${API_URL}/editCategoryState`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedCategory.id,
        categoryState: !categoryState,
      }),
    });

    setBusiness((prevBusiness) => {
      const updatedCategories = prevBusiness.categories.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, is_active: !categoryState }
          : category
      );

      return { ...prevBusiness, categories: updatedCategories };
    });

    setCategoryState((prev) => !prev);
  };

  const toggleAddCategoryModal = () => {
    setAddCategoryModal(!addCategoryModal);
  };

  const toggleAddProductModal = () => {
    setAddProductModal(!addProductModal);
  };

  const toggleEditCategoryModal = () => {
    setEditCategoryModal(!editCategoryModal);
  };

  const toggleEditProductModal = () => {
    setEditProductModal(!editProductModal);
  };

  const toggleDeleteCategoryModal = () => {
    setDeleteCategoryModal(!deleteCategoryModal);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => toggleAddCategoryModal()}
          style={styles.btn_add_category}
        >
          <Text style={styles.btn_add_category_text}>Agregar categoría</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCategoryMenu()}
          style={styles.options}
        >
          <View style={styles.options_row}>
            <MaterialCommunityIcons
              name="calendar-text"
              size={18}
              color={categoryMenu ? "#e31010" : "black"}
              style={{ marginEnd: 10 }}
            />
            <Text style={categoryMenu && { color: "#e31010" }}>Categorías</Text>
          </View>
          <Entypo
            name={categoryMenu ? "chevron-up" : "chevron-down"}
            size={18}
            color={categoryMenu ? "#e31010" : "black"}
          />
        </TouchableOpacity>
        {categoryMenu &&
          business.categories?.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleSelectedCategory(category)}
              style={
                selectedCategory?.id === category.id &&
                styles.selected_option_item
              }
            >
              <Text
                style={[
                  styles.option_item,
                  selectedCategory?.id === category.id && { color: "#e31010" },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        <View style={styles.line}></View>
        <TouchableOpacity onPress={() => {}} style={styles.options}>
          <View style={styles.options_row}>
            <AntDesign
              name="tago"
              size={18}
              color="black"
              style={{ marginEnd: 10 }}
            />
            <Text>Promociones</Text>
          </View>
          <Entypo name="chevron-down" size={18} color="black" />
        </TouchableOpacity>
        <View style={styles.line}></View>
        {selectedCategory && (
          <>
            <View style={styles.header_row}>
              <Text style={styles.category_name}>{selectedCategory.name}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor="#f8f9fa"
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => editCategoryState()}
                value={!!categoryState}
              />
              <TouchableOpacity
                onPress={() => toggleAddProductModal()}
                style={styles.add_product_btn}
              >
                <Entypo name="plus" size={18} color="#e31010" />
                <Text style={styles.add_product_btn_text}>
                  Agregar producto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleEditCategoryModal()}>
                <FontAwesome5 name="edit" size={18} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleDeleteCategoryModal()}>
                <MaterialIcons name="delete" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={{ color: "#6b6b6b" }}>
              {selectedCategory.products?.filter((p) => p.is_active).length}{" "}
              {selectedCategory.products && "productos activos"}
            </Text>
            {selectedCategory.products?.map((product) => (
              <Product
                key={product.id}
                product={product}
                setBusiness={setBusiness}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                visible={editProductModal}
                onClose={toggleEditProductModal}
              />
            ))}
          </>
        )}
      </View>
      <AddCategoryModal
        visible={addCategoryModal}
        onClose={toggleAddCategoryModal}
        business={business}
        setBusiness={setBusiness}
      />
      <AddProductModal
        visible={addProductModal}
        onClose={toggleAddProductModal}
        business={business}
        setBusiness={setBusiness}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {selectedCategory && (
        <>
          <EditCategoryModal
            visible={editCategoryModal}
            onClose={toggleEditCategoryModal}
            setBusiness={setBusiness}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <DeleteCategoryModal
            visible={deleteCategoryModal}
            onClose={toggleDeleteCategoryModal}
            setBusiness={setBusiness}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 48,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  btn_add_category: {
    backgroundColor: "#e31010",
    paddingVertical: 8,
    borderRadius: 3,
    marginBottom: 48,
  },
  btn_add_category_text: {
    color: "#f8f9fa",
    textAlign: "center",
    fontWeight: "600",
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  options_row: {
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  option_item: {
    paddingStart: 8,
    marginVertical: 10,
  },
  selected_option_item: {
    borderStartWidth: 4,
    borderColor: "#e31010",
    backgroundColor: "rgba(0, 0, 55, 0.03)",
  },
  header_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderColor: "#e31010",
    marginBottom: 16,
    paddingBottom: 16,
  },
  category_name: {
    fontSize: 22,
    fontWeight: "500",
    maxWidth: 100,
    lineHeight: 22,
  },
  add_product_btn: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 100,
  },
  add_product_btn_text: {
    color: "#e31010",
    marginStart: 10,
    fontWeight: "500",
    lineHeight: 15,
    textAlign: "center",
  },
  product_container: {
    borderBottomWidth: 1,
    borderColor: "#dee2e6",
    paddingVertical: 16,
  },
  product_image: {
    width: "100%",
    height: 362,
    marginBottom: 16,
  },
  product_model: {
    fontSize: 18,
    fontWeight: "500",
  },
  product_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
