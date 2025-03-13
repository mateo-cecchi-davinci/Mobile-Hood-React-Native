import { View, Text, StyleSheet } from "react-native";
import { useRef } from "react";
import Products from "./Products";

export default function Content({ categories, scrollRef, sectionRefs }) {
  return (
    <View ref={scrollRef}>
      {categories.map((category) =>
        category.products.length > 0 ? (
          <View
            key={category.id}
            ref={(el) => (sectionRefs.current[category.id] = el)}
          >
            <Text style={styles.category_title}>{category.name}</Text>
            <Products products={category.products} />
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
