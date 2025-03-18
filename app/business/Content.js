import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Products from "./Products";

export default function Content({
  categories,
  scrollRef,
  sectionRefs,
  updateSubtotal,
  updateCart,
}) {
  return (
    <View ref={scrollRef}>
      {categories.map((category) =>
        category.products.length > 0 ? (
          <View
            key={category.id}
            ref={(el) => (sectionRefs.current[category.id] = el)}
          >
            <Text style={styles.category_title}>{category.name}</Text>
            <Products
              products={category.products}
              updateSubtotal={updateSubtotal}
              updateCart={updateCart}
            />
          </View>
        ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  category_title: {
    fontSize: 18,
    fontWeight: "600",
    marginStart: 40,
    marginVertical: 20,
  },
});
