import { useEffect, useState, useRef } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import ProfileNav from "./ProfileNav";
import Header from "./Header";
import Menu from "./Menu";
import Content from "./Content";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CartModal from "./CartModal";

const API_URL = Constants.expoConfig.extra.APP_URL;

const BusinessProfile = () => {
  const route = useRoute();
  const { businessId } = route.params;
  const [business, setBusiness] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [user, setUser] = useState(null);
  const [cartModal, setCartModal] = useState(false);

  // Referencias para hacer scroll
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem("user").then(JSON.parse);
      setUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/business/${businessId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          setBusiness(data.business);
          setCategories(data.categories || []);

          // Calcular el subtotal a partir del carrito
          const cartTotal = data.cart.reduce((sum, item) => {
            const product = data.categories
              .flatMap((category) => category.products)
              .find((product) => product.id === item.fk_carts_products);
            return sum + product.price * item.quantity;
          }, 0);

          setCart(data.cart);
          setSubtotal(cartTotal);
        })
        .catch((error) => console.error("Error al cargar el negocio:", error));
    }
  }, [businessId, user]);

  const toggleModal = () => {
    setCartModal(!cartModal);
  };

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

  const updateSubtotal = (price) => {
    setSubtotal((prev) => prev + price);
  };

  const updateCart = (item) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.fk_carts_products === item.fk_carts_products
      );

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.fk_carts_products === item.fk_carts_products
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prev, item];
      }
    });
  };

  return (
    <>
      <ScrollView
        style={[
          styles.background,
          subtotal > 0 ? styles.backgroundWithButton : null,
        ]}
        ref={scrollRef}
      >
        <ProfileNav />
        <Header business={business} />
        <Menu categories={categories} scrollToCategory={scrollToCategory} />
        <Content
          categories={categories}
          scrollRef={scrollRef}
          sectionRefs={sectionRefs}
          updateSubtotal={updateSubtotal}
          updateCart={updateCart}
        />
      </ScrollView>
      {subtotal > 0 && (
        <View style={styles.btn_container}>
          <TouchableOpacity style={styles.btn} onPress={toggleModal}>
            <Text style={styles.btn_text}>Ver mi pedido ${subtotal}</Text>
          </TouchableOpacity>
        </View>
      )}
      <CartModal
        visible={cartModal}
        onClose={toggleModal}
        user={user}
        business={business}
        categories={categories}
        cart={cart}
        setCart={setCart}
        subtotal={subtotal}
        updateSubtotal={updateSubtotal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    overflow: "scroll",
  },
  backgroundWithButton: {
    marginBottom: 90,
  },
  btn_container: {
    padding: 20,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
  },
  btn: {
    backgroundColor: "#e31010",
    width: "100%",
    borderRadius: 50,
    paddingVertical: 16,
  },
  btn_text: {
    color: "#f8f9fa",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default BusinessProfile;
