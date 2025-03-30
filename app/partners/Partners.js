import React, { useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Carousel from "./Carousel";

export default function Partners() {
  const navigation = useNavigation();

  const scrollViewRef = useRef(null);
  const formRef = useRef(null);

  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [firstFaq, setFirstFaq] = useState(false);
  const [secondFaq, setSecondFaq] = useState(false);
  const [thirdFaq, setThirdFaq] = useState(false);
  const [fourthFaq, setFourthFaq] = useState(false);
  const [fifthFaq, setFifthFaq] = useState(false);
  const [sixthFaq, setSixthFaq] = useState(false);
  const [seventhFaq, setSeventhFaq] = useState(false);
  const [eighthFaq, setEighthFaq] = useState(false);

  const scrollToForm = () => {
    // Usamos measure para obtener la posición exacta del formulario
    formRef.current.measure((y, pageY) => {
      scrollViewRef.current.scrollTo({ y: pageY - 160, animated: true });
    });
  };

  return (
    <>
      <View style={styles.header}>
        <AntDesign
          name="close"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
      </View>
      <ScrollView ref={scrollViewRef}>
        <View style={styles.logo_container}>
          <Image
            source={require("../assets/logos/logo_partner.png")}
            style={styles.logo}
          />
        </View>
        <ImageBackground
          source={require("../assets/partners/partner_banner.jpg")}
          style={styles.banner}
        >
          <View style={styles.overlay} />
          <Text style={styles.banner_title}>
            Empieza a vender en la app{" "}
            <Text style={[styles.banner_title, { fontWeight: "bold" }]}>
              líder en pedidos{"\n"}online de{"\n"}Latinoamérica
            </Text>
          </Text>
          <View ref={formRef} style={styles.form}>
            <Text style={styles.form_title}>
              ¡Registrá tu local ahora mismo!
            </Text>
            <Text style={styles.form_subtitle}>
              <Text style={[styles.form_subtitle, { fontWeight: "bold" }]}>
                10% de comisión{" "}
              </Text>
              durante los primeros 30 días
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del local *"
              value={businessName}
              onChangeText={setBusinessName}
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre *"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido *"
              value={lastname}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono *"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.form_btn}>
              <Text style={styles.form_btn_text}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={styles.steps_container}>
          <Text style={styles.steps_title}>Comenzar a</Text>
          <Text style={styles.steps_title_strong}>vender</Text>
          <Text style={styles.steps_title_second}>es así de simple</Text>
          <View style={styles.steps_row}>
            <View style={styles.steps_column}>
              <Image source={require("../assets/partners/steps/1.png")} />
              <Text style={styles.step_text}>
                Registrá tus datos y la información bancaria de tu local.
              </Text>
            </View>
            <View style={styles.steps_column}>
              <Image source={require("../assets/partners/steps/2.png")} />
              <Text style={styles.step_text}>
                Cargá tu menú, horarios y logo en nuestro portal de autogestón.
              </Text>
            </View>
          </View>
          <View style={styles.steps_row}>
            <View style={styles.steps_column}>
              <Image source={require("../assets/partners/steps/3.png")} />
              <Text style={styles.step_text}>
                Probá tu sistema de recepción de pedidos.
              </Text>
            </View>
            <View style={styles.steps_column}>
              <Image source={require("../assets/partners/steps/4.png")} />
              <Text style={styles.step_text}>
                ¡Y listo! ¡Recibí tus primeros pedidos en nuestra plataforma!
              </Text>
            </View>
          </View>
          <Text style={styles.step_paragraph}>
            Además, te compartiremos distintos entrenamientos para que todo
            quede claro durante el proceso y puedas potenciar tus ventas desde
            el primer día.
          </Text>
        </View>
        <Text style={styles.orders_title}>
          Gestionamos{"\n"}
          <Text
            style={[
              styles.orders_title,
              { fontWeight: "600", fontSize: 40, lineHeight: 39 },
            ]}
          >
            7 pedidos{"\n"}por segundo
          </Text>
        </Text>
        <View style={styles.orders_image_container}>
          <View style={styles.gradient_background}>
            <View style={{ flex: 1, backgroundColor: "rgba(4, 88, 252, 1)" }} />
            <View style={{ flex: 1, backgroundColor: "rgba(251, 0, 80, 1)" }} />
          </View>
          <Image
            source={require("../assets/partners/takeaway_girl.png")}
            style={styles.orders_image}
          />
        </View>
        <View style={styles.orders_bottom}>
          <Text style={styles.orders_subtitle}>
            Con la app de pedidos de Mobile Hood, tu local puede ser el local
            más elegido de tu zona. Súmate a la plataforma más grande y llega a
            miles de nuevos clientes.
          </Text>
          <View>
            <TouchableOpacity onPress={scrollToForm} style={styles.orders_btn}>
              <Text style={styles.orders_btn_text}>Quiero vender más</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Carousel />
        <View style={styles.background}>
          <Text style={styles.title}>
            La flota más{"\n"}grande{"\n"}
            <Text
              style={[styles.title, { fontWeight: "normal", fontSize: 32 }]}
            >
              de Latinoamérica
            </Text>
          </Text>
          <Text style={styles.subtitle}>
            Sólo tendrás que ocuparte de preparar el mejor pedido. ¡De cobrarlo
            nos encargamos nosotros!
          </Text>
          <View style={styles.img_row}>
            <View style={styles.second_gradient_background}>
              <View
                style={{ flex: 1, backgroundColor: "rgba(0, 220, 255, 1)" }}
              />
              <View
                style={{ flex: 1, backgroundColor: "rgba(255, 228, 56, 1)" }}
              />
            </View>
            <Image
              source={require("../assets/partners/man_with_phone.jpg")}
              style={styles.side_img}
            />
            <Image
              source={require("../assets/partners/takeaway_man.png")}
              style={styles.center_img}
            />
            <Image
              source={require("../assets/partners/girl_with_phone.jpg")}
              style={styles.side_img}
            />
          </View>
        </View>
        <Text style={styles.text}>
          Contamos con la tecnología más avanzada para que puedas gestionar tu
          negocio cargando productos, controlar el inventario y gestionar pagos
          de manera eficiente y ágil asegurando el éxito de tu negocio.
        </Text>
        <View style={styles.btn_container}>
          <TouchableOpacity onPress={scrollToForm} style={styles.btn}>
            <Text style={styles.btn_text}>Quiero empezar a vender</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.faqs_container}>
          <Text style={styles.faqs_title}>Preguntas frecuentes</Text>
          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => setFirstFaq(!firstFaq)}
            style={styles.faqs_row}
          >
            <Text style={styles.faq}>
              ¿Qué requisitos debo cumplir para sumarme a Mobile Hood y empezar
              a vender?
            </Text>
            <AntDesign
              name={firstFaq ? "upcircleo" : "downcircleo"}
              size={16}
              color="black"
            />
          </TouchableOpacity>
          {firstFaq && (
            <Text style={styles.faq_answer}>
              Documento de identidad, Inicio de actividades de Servicio de
              impuestos internos y Cuenta bancaria
            </Text>
          )}
          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => setSecondFaq(!secondFaq)}
            style={styles.faqs_row}
          >
            <Text style={styles.faq}>¿Cómo y cuándo son los pagos?</Text>
            <AntDesign
              name={secondFaq ? "upcircleo" : "downcircleo"}
              size={16}
              color="black"
            />
          </TouchableOpacity>
          {secondFaq && (
            <Text style={styles.faq_answer}>
              En la sección "Finanzas" de Partner Portal, podrás ver tu estado
              de cuenta y las fechas de emisión de tu pago. Cada semana,
              recibirás tu liquidación y emitiremos tu pago por transferencia
              bancaria.
            </Text>
          )}
          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => setThirdFaq(!thirdFaq)}
            style={styles.faqs_row}
          >
            <Text style={styles.faq}>
              ¿Cómo gestiono la información/datos de mi negocio?
            </Text>
            <AntDesign
              name={thirdFaq ? "upcircleo" : "downcircleo"}
              size={16}
              color="black"
            />
          </TouchableOpacity>
          {thirdFaq && (
            <Text style={styles.faq_answer}>
              En MobileHood contás con Partner Portal, nuestro sitio de
              autogestión, donde podrás visualizar datos relevantes de tu
              negocio y realizar acciones como modificar precios, descripciones,
              productos y mucho más. Además, contás con un chat de Ayuda en
              Línea las 24 hs donde nuestros agentes te ayudarán en lo que
              necesites. Para loguearte en Partner Portal de MobileHood,
              recibirás tu usuario y contraseña en el correo electrónico que
              utilizaste para registrar tu negocio. Las credenciales, una vez
              que te son enviadas, tienen apenas unas horas de vigencia, por lo
              que te recomendamos realizar el registro apenas recibas el correo
              electrónico.
            </Text>
          )}
          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => setFourthFaq(!fourthFaq)}
            style={styles.faqs_row}
          >
            <Text style={styles.faq}>
              ¿Con quién me contacto si tengo algún problema?
            </Text>
            <AntDesign
              name={fourthFaq ? "upcircleo" : "downcircleo"}
              size={16}
              color="black"
            />
          </TouchableOpacity>
          {fourthFaq && (
            <Text style={styles.faq_answer}>
              Para poder ayudarte en cualquier tema vinculado a tu cuenta,
              dudas, consultas o problemas con alguna orden, podés comunicarte a
              través de Ayuda en Línea en Partner Portal o en tu sistema de
              recepción de pedidos las 24 hs todos los días de la semana.
            </Text>
          )}
          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => setFifthFaq(!fifthFaq)}
            style={styles.faqs_row}
          >
            <Text style={styles.faq}>¿Cómo debo operar en el día a día?</Text>
            <AntDesign
              name={fifthFaq ? "upcircleo" : "downcircleo"}
              size={16}
              color="black"
            />
          </TouchableOpacity>
          {fifthFaq && (
            <Text style={styles.faq_answer}>
              En MobileHood cuidamos mucho a nuestros usuarios y queremos
              ofrecerles una experiencia increíble, rápida y fácil, por eso es
              muy importante que: 1- Aceptes los pedidos de manera rápida para
              evitar que se cancelen. 2- Evites rechazar pedidos porque es muy
              frustrante para los clientes y a su vez, tu comercio pierde
              reputación. 3- Verifiques en la orden el horario de llegada del
              repartidor para evitar demoras en la promesa de entrega a nuestros
              usuarios. Es clave prestar atención a estos puntos para evitar
              cierres de tu local por fallas operativas. Estos cierres son
              automáticos y buscan cuidar la reputación de tu local, la
              experiencia del usuario y la salud de nuestra plataforma. Si
              tienes inconvenientes o demoras en la cocina, no dudes en
              contactarte con Ayuda en Línea en Partner Portal para que podamos
              guiarte sobre cómo resolverlos.
            </Text>
          )}
          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => setSixthFaq(!sixthFaq)}
            style={styles.faqs_row}
          >
            <Text style={styles.faq}>
              ¿Qué debo tener en cuenta a la hora de recibir un pedido?
            </Text>
            <AntDesign
              name={sixthFaq ? "upcircleo" : "downcircleo"}
              size={16}
              color="black"
            />
          </TouchableOpacity>
          {sixthFaq && (
            <Text style={styles.faq_answer}>
              En MobileHood, cuidamos mucho la experiencia de nuestros usuarios
              y queremos que vuelvan a pedir. Por eso, cuando recibas un pedido,
              es muy importante: 1- Que prestes atención a tu sistema de
              recepción y confirmes el pedido antes de los 5 minutos de haber
              ingresado, para evitar que ese pedido se cancele. 2- Que evites
              rechazar órdenes ya que esto implica una cancelación para los
              usuarios. Si aceptás órdenes de manera rápida y no las cancelas,
              podrás asegurar una buena experiencia para tus clientes, ¡que
              volverán a elegirte!
            </Text>
          )}
          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => setSeventhFaq(!seventhFaq)}
            style={styles.faqs_row}
          >
            <Text style={styles.faq}>
              ¿Cómo funcionan las áreas de entrega?
            </Text>
            <AntDesign
              name={seventhFaq ? "upcircleo" : "downcircleo"}
              size={16}
              color="black"
            />
          </TouchableOpacity>
          {seventhFaq && (
            <Text style={styles.faq_answer}>
              En MobileHood queremos garantizar la mejor experiencia para
              nuestros usuarios y la calidad de los productos que reciben. Por
              eso nuestras áreas de entrega se determinan en función de tiempos
              de manejo. Las áreas de entrega son dinámicas, esto significa que
              pueden modificarse en días de mucha lluvia o de mucho tráfico. De
              esta forma, evitamos que los tiempos se vean afectados y
              aseguramos la calidad de tus productos.
            </Text>
          )}
          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => setEighthFaq(!eighthFaq)}
            style={styles.faqs_row}
          >
            <Text style={styles.faq}>
              ¿Puedo contratar publicidad en la app de MobileHood?
            </Text>
            <AntDesign
              name={eighthFaq ? "upcircleo" : "downcircleo"}
              size={16}
              color="black"
            />
          </TouchableOpacity>
          {eighthFaq && (
            <Text style={styles.faq_answer}>
              En MobileHood contamos con varias propuestas para que destaques tu
              restaurante en la app con espacios de posicionamiento promocionado
              según tus objetivos de venta. Podés gestionarlos desde Partner
              Portal en forma directa. También podrás sumarte a campañas de
              Marketing con productos seleccionados y aplicar descuentos en
              productos específicos o en todo tu menú. Esto te da mayor
              visibilidad, atrae mucho a los usuarios y ayuda a potenciar tu
              negocio.
            </Text>
          )}
        </View>
        <View style={styles.footer}>
          <Image
            source={require("../assets/logos/logo_partner_rectangle.png")}
            style={styles.footer_logo}
          />
          <Text style={styles.footer_text}>Crezcamos juntos</Text>
          <View style={styles.footer_row}>
            <TouchableOpacity>
              <Text style={styles.footer_row_item}>Partner portal</Text>
            </TouchableOpacity>
            <View style={styles.footer_row_line}></View>
            <TouchableOpacity>
              <Text style={styles.footer_row_item}>Canal de Youtube</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer_line}></View>
          <Text style={styles.rights}>
            ©2024 Mobile Hood. Todos los derechos reservados.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    padding: 20,
  },
  logo_container: {
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  logo: {
    alignSelf: "center",
    width: 170,
    height: 34,
  },
  banner: {
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  banner_title: {
    fontSize: 32,
    color: "#f8f9fa",
    textAlign: "center",
    marginTop: 30,
  },
  form: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
  },
  form_title: {
    fontWeight: "bold",
    fontSize: 28,
  },
  form_subtitle: {
    paddingVertical: 8,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#ffe438",
    marginVertical: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "dark(rgb(215, 215, 215), rgb(215, 215, 215))",
    borderRadius: 5,
    paddingHorizontal: 16,
    marginVertical: 6,
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
  steps_container: {
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  steps_title: {
    textAlign: "center",
    fontSize: 32,
  },
  steps_title_strong: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: 35,
  },
  steps_title_second: {
    textAlign: "center",
    fontSize: 32,
    lineHeight: 30,
    paddingBottom: 40,
  },
  steps_row: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 30,
  },
  steps_column: {
    paddingHorizontal: 10,
    maxWidth: 178,
  },
  step_text: {
    fontSize: 16,
    textAlign: "center",
  },
  step_paragraph: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  orders_title: {
    fontSize: 32,
    textAlign: "center",
    color: "#f8f9fa",
    backgroundColor: "#0458fc",
    paddingVertical: 50,
  },
  orders_image_container: {
    position: "relative",
    width: "100%",
    height: 185,
  },
  gradient_background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "column",
  },
  orders_image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    position: "relative",
  },
  orders_bottom: {
    backgroundColor: "rgba(251,0,80,1)",
  },
  orders_subtitle: {
    textAlign: "center",
    color: "#f8f9fa",
    padding: 32,
  },
  orders_btn: {
    alignSelf: "center",
    backgroundColor: "#ffe438",
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  orders_btn_text: {
    fontWeight: "bold",
  },
  background: {
    backgroundColor: "#00dcff",
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    paddingVertical: 30,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 25,
    marginBottom: 30,
  },
  img_row: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  second_gradient_background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "column",
  },
  side_img: {
    position: "relative",
    width: 125,
    height: 125,
  },
  center_img: {
    position: "relative",
    width: 165,
    height: 165,
  },
  text: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    backgroundColor: "rgba(255, 228, 56, 1)",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  btn_container: {
    backgroundColor: "rgba(255, 228, 56, 1)",
    paddingBottom: 60,
  },
  btn: {
    backgroundColor: "#e31010",
    padding: 15,
    alignSelf: "center",
  },
  btn_text: {
    color: "#f8f9fa",
    fontWeight: "bold",
    textAlign: "center",
  },
  faqs_container: {
    padding: 20,
  },
  faqs_title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  line: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  faqs_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faq: {
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: 300,
  },
  faq_answer: {
    marginTop: 20,
  },
  footer: {
    backgroundColor: "#e31010",
    padding: 40,
  },
  footer_logo: {
    alignSelf: "center",
    width: 150,
    height: 54,
    marginVertical: 10,
  },
  footer_text: {
    color: "#f8f9fa",
    textAlign: "center",
    marginVertical: 5,
  },
  footer_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footer_row_item: {
    color: "#f8f9fa",
  },
  footer_row_line: {
    borderEndWidth: 1,
    borderColor: "#f8f9fa",
    height: "100%",
    marginHorizontal: 5,
  },
  footer_line: {
    marginVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  rights: {
    color: "#f8f9fa",
  },
});
