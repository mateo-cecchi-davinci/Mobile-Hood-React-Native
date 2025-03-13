import { useEffect, useState, useRef } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import ProfileNav from "./ProfileNav";
import Header from "./Header";
import Menu from "./Menu";
import Content from "./Content";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.APP_URL;

const BusinessProfile = () => {
  const route = useRoute();
  const { businessId } = route.params;
  const [business, setBusiness] = useState(null);
  const [categories, setCategories] = useState([]);

  // Referencias para hacer scroll
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    fetch(`${API_URL}/business/${businessId}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setBusiness(data.business);
        setCategories(data.categories || []);
      })
      .catch((error) => console.error("Error al cargar el negocio:", error));
  }, [businessId]);

  if (!business) return <Text>Cargando...</Text>;

  // Función para hacer scroll a una categoría específica
  const scrollToCategory = (categoryId) => {
    if (sectionRefs.current[categoryId]) {
      sectionRefs.current[categoryId].measureLayout(
        scrollRef.current,
        (x, y) => {
          scrollRef.current.scrollTo({ y, animated: true });
        }
      );
    }
  };

  return (
    <ScrollView style={styles.background} ref={scrollRef}>
      <ProfileNav />
      <Header business={business} />
      <Menu categories={categories} scrollToCategory={scrollToCategory} />
      <Content
        categories={categories}
        scrollRef={scrollRef}
        sectionRefs={sectionRefs}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    overflow: "scroll",
  },
});

export default BusinessProfile;
