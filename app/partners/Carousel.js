import ReanimatedCarousel from "react-native-reanimated-carousel";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width: screenWidth } = Dimensions.get("window");

const carouselData = [
  {
    id: 1,
    image: require("../assets/partners/info/1.png"),
    title: "Cómo recibir pedidos",
    text: "Con tu sistema de recepción podrás aceptar tus pedidos, verificar el horario de entrega y tendrás toda la información necesaria para entregarlo correctamente.",
    btnText: "+info",
  },
  {
    id: 2,
    image: require("../assets/partners/info/2.png"),
    title: "Cómo gestionar tu local",
    text: "En Partner Portal podrás modificar tu menú y horarios de apertura, descargar tu Estado de Cuenta y mucho más.",
    btnText: "+info",
  },
  {
    id: 3,
    image: require("../assets/partners/info/3.webp"),
    title: "Cómo entregar los pedidos",
    text: "Cumplir con los tiempos de entrega y las expectativas de los clientes permite asegurarles una gran experiencia. ¡Cuidar tu operativa es clave para que los usuarios vuelvan a confiar y así poder vender cada vez más!",
    btnText: "+info",
  },
  {
    id: 4,
    image: require("../assets/partners/info/4.webp"),
    title: "Cómo potenciar tus ventas",
    text: "Te ofrecemos distintas herramientas para publicitar tu local y aumentar tu visibilidad en nuestra aplicación, ¡logrando así más ventas y nuevos clientes!",
    btnText: "+info",
  },
];

export default function Carousel() {
  const progressValue = useSharedValue(0);

  const renderItem = ({ item }) => (
    <Animated.View style={styles.carousel_item}>
      <View style={styles.carousel_item_image_container}>
        <Image source={item.image} style={styles.carousel_item_image} />
      </View>
      <Text style={styles.carousel_item_title}>{item.title}</Text>
      <Text style={styles.carousel_item_text}>{item.text}</Text>
      <TouchableOpacity>
        <Text style={styles.carousel_item_btn}>{item.btnText}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.carousel}>
      <Text style={styles.carousel_title}>¿Cómo funcionamos?</Text>
      <View style={styles.pagination}>
        {carouselData.map((_, index) => {
          return (
            <PaginationDot
              key={index}
              index={index}
              progressValue={progressValue}
            />
          );
        })}
      </View>
      <View style={styles.carousel_container}>
        <AntDesign
          name="leftcircleo"
          size={28}
          color="black"
          style={styles.left_arrow_btn}
        />
        <ReanimatedCarousel
          data={carouselData}
          renderItem={renderItem}
          width={screenWidth * 1}
          height={350}
          loop={false}
          autoPlay={false}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress;
          }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
        />
        <AntDesign
          name="rightcircleo"
          size={28}
          color="black"
          style={styles.right_arrow_btn}
        />
      </View>
    </View>
  );
}

// Componente para los puntos de paginación
const PaginationDot = ({ index, progressValue }) => {
  const dotWidth = useAnimatedStyle(() => {
    const isActive = Math.round(progressValue.value) === index;
    return {
      width: 8,
      backgroundColor: isActive ? "#e31010" : "#D8D8D8",
    };
  });

  return <Animated.View style={[styles.dot, dotWidth]} />;
};

const styles = StyleSheet.create({
  carousel: {
    backgroundColor: "#fff",
    paddingTop: 70,
    paddingBottom: 70,
  },
  carousel_title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  carousel_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  carousel_item: {
    paddingHorizontal: 25,
  },
  left_arrow_btn: {
    position: "absolute",
    left: 30,
    top: 100,
  },
  right_arrow_btn: {
    position: "absolute",
    right: 30,
    top: 100,
  },
  carousel_item_image_container: {
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#eeeeee",
    width: 160,
    height: 160,
  },
  carousel_item_image: {
    alignSelf: "center",
    width: 120,
    height: 120,
  },
  carousel_item_title: {
    textAlign: "center",
    fontSize: 24,
    marginVertical: 10,
  },
  carousel_item_text: {
    textAlign: "center",
    color: "#6b6b6b",
  },
  carousel_item_btn: {
    textAlign: "center",
    color: "#e31010",
    textDecorationLine: "underline",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
