import React, { useState } from "react";
import {
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CheckBox from "react-native-check-box";
import Constants from "expo-constants";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function PendingOrderModal({
  visible,
  onClose,
  order,
  orderNumber,
  productsAmount,
  time,
  business,
  setBusiness,
  setPendingOrders,
  setAcceptedOrders,
}) {
  const API_URL = Constants.expoConfig.extra.APP_URL;
  const [tab, setTab] = useState(0);
  const [productsWithoutStock, setProductsWithoutStock] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  const acceptOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/acceptOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order }),
      });

      await response.json();

      if (response.ok) {
        setBusiness((prev) => ({
          ...prev,
          orders: prev.orders.map((o) =>
            o.id === order.id ? { ...order, state: "Aceptado" } : order
          ),
        }));

        setPendingOrders((prev) => {
          return prev.filter((o) => o.id !== order.id);
        });

        setAcceptedOrders((prev) => {
          return [...prev, { ...order, state: "Aceptado" }];
        });

        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const rejectOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/rejectOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order }),
      });

      await response.json();

      if (response.ok) {
        setBusiness((prev) => ({
          ...prev,
          orders: prev.orders.map((o) =>
            o.id === order.id ? { ...order, state: "Rechazado" } : order
          ),
        }));

        setPendingOrders((prev) => {
          return prev.filter((o) => o.id !== order.id);
        });

        setAcceptedOrders((prev) => {
          return [...prev, { ...order, state: "Rechazado" }];
        });

        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const acceptUpdatedOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/acceptUpdatedOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order, productsWithoutStock, newProducts }),
      });

      const data = await response.json();

      if (response.ok) {
        setBusiness((prev) => ({
          ...prev,
          orders: prev.orders.map((o) =>
            o.id === order.id
              ? {
                  ...order,
                  state: "Aceptado",
                  payment: data.total,
                  updated_at: data.updated_at,
                  products: [
                    ...order.products.filter(
                      (p) => !productsWithoutStock.includes(p)
                    ),
                    ...newProducts.filter(
                      (new_product) =>
                        !order.products.some((p) => p.id === new_product.id)
                    ),
                  ],
                }
              : o
          ),
        }));

        setPendingOrders((prev) => prev.filter((o) => o.id !== order.id));

        setAcceptedOrders((prev) => {
          return [
            {
              ...order,
              state: "Aceptado",
              payment: data.total,
              updated_at: data.updated_at,
              products: [
                ...order.products.filter(
                  (p) => !productsWithoutStock.includes(p)
                ),
                ...newProducts.filter(
                  (new_product) =>
                    !order.products.some((p) => p.id === new_product.id)
                ),
              ],
            },
            ...prev,
          ];
        });

        setProductsWithoutStock([]);
        setNewProducts([]);
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCheckboxChange = (product) => {
    setProductsWithoutStock((prev) => {
      const existingProduct = prev.includes(product);
      return existingProduct
        ? prev.filter((p) => p !== product)
        : [...prev, product];
    });
  };

  const handleUpdateCheckbox = (product) => {
    setNewProducts((prev) => {
      return prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, { ...product, amount: 1 }];
    });
  };

  const incrementQuantities = (product) => {
    setNewProducts((prev) => {
      return prev.map((p) =>
        p.id === product.id ? { ...p, amount: p.amount + 1 } : p
      );
    });
  };

  const decrementQuantities = (product) => {
    setNewProducts((prev) => {
      return prev.map((p) =>
        p.id === product.id
          ? { ...p, amount: p.amount > 1 ? p.amount - 1 : p.amount }
          : p
      );
    });
  };

  const handleClose = () => {
    setTab(0);
    setProductsWithoutStock([]);
    setNewProducts([]);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          {tab == 0 && (
            <>
              <View style={styles.header_row}>
                <TouchableOpacity onPress={() => handleClose()}>
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTab(1)}>
                  <Text style={styles.reject}>Rechazar</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.business_name}>{business.name}</Text>
              <View style={styles.title_row}>
                <Text style={styles.title}>Pedido nº{orderNumber}</Text>
                <Text style={styles.title_row_time}>
                  {time.value}
                  <Text style={{ fontWeight: "normal" }}> {time.time}</Text>
                </Text>
              </View>
              <View style={styles.client_row}>
                <MaterialIcons
                  name="directions-run"
                  size={24}
                  color="black"
                  style={styles.client_row_icon}
                />
                <View>
                  <Text style={styles.client}>Cliente</Text>
                  <Text style={styles.client_name}>
                    {order.user.name} está en camino...
                  </Text>
                </View>
              </View>
              {order.products.map((product) => (
                <View key={product.id} style={styles.product_row}>
                  <Text style={styles.product_amount}>
                    {product.amount} x
                    <Text style={styles.product_model}>
                      {"  " + product.model}
                    </Text>
                  </Text>
                  <Text>$ {product.price}</Text>
                </View>
              ))}
              <View style={styles.total_row}>
                <Text style={styles.total}>Total</Text>
                <Text style={styles.payment}>${order.payment}</Text>
              </View>
              <Text style={styles.cash}>TARJETA</Text>
              <View style={styles.footer}>
                <Text style={styles.footer_title}>
                  Retiro en aproximadamente {time.value + " " + time.time}
                </Text>
                <TouchableOpacity
                  onPress={() => acceptOrder()}
                  style={styles.footer_btn}
                >
                  <Text style={styles.footer_btn_text}>Aceptar</Text>
                  <Text style={styles.footer_btn_text}>
                    Productos: {productsAmount}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {tab == 1 && (
            <>
              <View style={styles.header_row}>
                <TouchableOpacity onPress={() => setTab(0)}>
                  <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleClose()}>
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.cards_body}>
                <Text style={styles.reject_title}>
                  Es triste verte rechazar :(
                </Text>
                <Text style={styles.reject_subtitle}>
                  Seleccione sus motivos para rechazar
                </Text>
                <View style={styles.cards_container}>
                  <TouchableOpacity
                    onPress={() => rejectOrder()}
                    style={styles.card}
                  >
                    <AntDesign
                      name="closecircleo"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                    <Text style={styles.card_text}>Local cerrado</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => rejectOrder()}
                    style={styles.card}
                  >
                    <AntDesign
                      name="clockcircleo"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                    <Text style={styles.card_text}>
                      Hay mucha demanda en el local
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setTab(2)}
                    style={styles.card}
                  >
                    <MaterialCommunityIcons
                      name="shopping-outline"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                    <Text style={styles.card_text}>
                      Falta de productos para el pedido
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          {tab == 2 && (
            <>
              <View style={styles.header_row}>
                <TouchableOpacity onPress={() => setTab(1)}>
                  <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleClose()}>
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.reject_body}>
                <Text style={styles.reject_title}>
                  ¿Qué productos no están disponibles?
                </Text>
                <Text style={styles.reject_subtitle}>
                  Estos productos serán marcados como no disponibles por el
                  resto del día.
                </Text>
              </View>
              <View style={styles.products_container}>
                {order.products.map((product) => (
                  <View key={product.id} style={styles.row}>
                    <CheckBox
                      isChecked={productsWithoutStock.includes(product)}
                      onClick={() => handleCheckboxChange(product)}
                      checkedCheckBoxColor="#e31010"
                    />
                    <Text style={styles.reject_product_model}>
                      {product.model}
                    </Text>
                  </View>
                ))}
                {productsWithoutStock.length > 0 && (
                  <View style={styles.reject_footer}>
                    <TouchableOpacity
                      onPress={() => setTab(3)}
                      style={styles.reject_footer_btn}
                    >
                      <Text style={styles.reject_footer_btn_text}>
                        Continuar
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          )}
          {tab == 3 && (
            <>
              <View style={styles.header_row}>
                <TouchableOpacity onPress={() => setTab(2)}>
                  <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleClose()}>
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.reject_body}>
                <Text style={styles.reject_title}>¡Salvemos el pedido!</Text>
                <Text style={styles.reject_subtitle}>
                  Intentá llamar al cliente para ofrecerle un producto
                  alternativo de valor similar.
                </Text>
              </View>
              <View style={styles.save_order}>
                <View style={styles.contact_row}>
                  <MaterialCommunityIcons
                    name="shopping-outline"
                    size={24}
                    color="black"
                    style={styles.bag_icon}
                  />
                  <View>
                    <Text style={styles.username}>{order.user.name}</Text>
                    <Text style={styles.phone}>+{order.user.phone}</Text>
                  </View>
                </View>
                <View style={styles.save_order_footer}>
                  <TouchableOpacity
                    onPress={() => setTab(4)}
                    style={styles.save_order_footer_btn}
                  >
                    <Text style={styles.save_order_footer_btn_text}>
                      Modificar orden
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => rejectOrder()}>
                    <Text style={styles.save_order_footer_reject_btn_text}>
                      Rechazar pedido
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          {tab == 4 && (
            <>
              <View style={styles.header_row}>
                <TouchableOpacity onPress={() => setTab(3)}>
                  <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleClose()}>
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.reject_body}>
                <Text style={styles.reject_title}>Modificar pedido</Text>
                <Text style={styles.reject_subtitle}>
                  Seleccioná los nuevos productos elegidos por el cliente.
                </Text>
              </View>
              <ScrollView
                style={[
                  styles.new_products_container,
                  newProducts.length > 0 && { marginBottom: 123 },
                ]}
              >
                <View style={{ paddingVertical: 20 }}>
                  {business.categories.map((category) =>
                    category.products.map((product) => (
                      <View
                        key={product.id}
                        style={styles.update_order_product_row}
                      >
                        <View style={styles.row}>
                          <CheckBox
                            isChecked={newProducts.find(
                              (p) => p.id === product.id
                            )}
                            onClick={() => handleUpdateCheckbox(product)}
                            checkedCheckBoxColor="#e31010"
                          />
                          <Text style={styles.reject_product_model}>
                            {product.model}
                          </Text>
                        </View>
                        {newProducts.find((p) => p.id === product.id) && (
                          <View style={styles.amount_btn_container}>
                            <TouchableOpacity
                              onPress={() => decrementQuantities(product)}
                            >
                              <AntDesign name="minus" size={16} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.amount_number}>
                              {newProducts.map(
                                (p) => p.id === product.id && p.amount
                              )}
                            </Text>
                            <TouchableOpacity
                              onPress={() => incrementQuantities(product)}
                            >
                              <AntDesign name="plus" size={16} color="black" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
              {newProducts.length > 0 && (
                <View style={styles.save_order_footer}>
                  <TouchableOpacity
                    onPress={() => acceptUpdatedOrder()}
                    style={styles.save_order_footer_btn}
                  >
                    <Text style={styles.save_order_footer_btn_text}>
                      Aceptar orden
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => rejectOrder()}>
                    <Text style={styles.save_order_footer_reject_btn_text}>
                      Rechazar pedido
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    flex: 0.9,
  },
  header_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  reject: {
    color: "#e31010",
    fontWeight: "bold",
  },
  business_name: {
    marginStart: 19,
    opacity: 0.6,
  },
  title_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
    borderStartWidth: 3,
    borderColor: "#e31010",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  title_row_time: {
    fontWeight: "bold",
    opacity: 0.6,
  },
  client_row: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "0 8 16 rgba(0, 0, 0, 0.15)",
    padding: 16,
  },
  client_row_icon: {
    marginEnd: 10,
  },
  client: {
    color: "#e31010",
    fontSize: 12,
    fontWeight: "bold",
  },
  client_name: {
    opacity: 0.6,
  },
  product_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "0 8 16 rgba(0, 0, 0, 0.15)",
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  product_amount: {
    color: "#e31010",
    fontWeight: "bold",
  },
  product_model: {
    fontSize: 18,
    color: "black",
  },
  total_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 24,
  },
  total: {
    fontWeight: "bold",
    fontSize: 18,
  },
  payment: {
    fontWeight: "bold",
  },
  cash: {
    fontWeight: "600",
    fontSize: 10,
    flexDirection: "row",
    textAlign: "center",
    backgroundColor: "#d1e7dd",
    color: "#198754",
    borderRadius: 3,
    paddingVertical: 4,
    margin: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 16,
    boxShadow: "-2px -4px 35px -6px rgba(0, 0, 0, 0.75)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  footer_title: {
    fontWeight: "bold",
    color: "#198754",
    paddingVertical: 8,
  },
  footer_btn: {
    backgroundColor: "#198754",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderRadius: 3,
  },
  footer_btn_text: {
    fontWeight: "bold",
    color: "#f8f9fa",
  },
  cards_body: {
    marginHorizontal: 16,
    marginTop: 24,
    flex: 1,
  },
  reject_title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  reject_subtitle: {
    marginVertical: 20,
    textAlign: "center",
  },
  cards_container: {
    flex: 0.9,
    justifyContent: "space-evenly",
  },
  card: {
    alignSelf: "center",
    padding: 24,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "dark(rgb(225, 225, 225), rgb(225, 225, 225))",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
    width: 200,
    height: 125,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  icon: {
    alignSelf: "center",
    marginBottom: 12,
  },
  card_text: {
    textAlign: "center",
  },
  reject_body: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  products_container: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "dark(rgb(225, 225, 225), rgb(225, 225, 225))",
    backgroundColor: "#f8f9fa",
    padding: 40,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  new_products_container: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "dark(rgb(225, 225, 225), rgb(225, 225, 225))",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  reject_product_model: {
    marginStart: 10,
  },
  reject_footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    boxShadow: "-2px -4px 35px -6px rgba(0, 0, 0, 0.75)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  reject_footer_btn: {
    backgroundColor: "#e31010",
    padding: 16,
    borderRadius: 3,
  },
  reject_footer_btn_text: {
    alignSelf: "center",
    color: "#f8f9fa",
    fontWeight: "bold",
  },
  save_order: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "dark(rgb(225, 225, 225), rgb(225, 225, 225))",
    padding: 40,
  },
  contact_row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
  },
  bag_icon: {
    marginEnd: 16,
  },
  username: {
    color: "#e31010",
    fontSize: 10,
    fontWeight: "bold",
  },
  phone: {
    fontWeight: "bold",
  },
  save_order_footer: {
    padding: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    boxShadow: "-2px -4px 35px -6px rgba(0, 0, 0, 0.75)",
  },
  save_order_footer_btn: {
    padding: 16,
    backgroundColor: "#198754",
    borderRadius: 3,
  },
  save_order_footer_btn_text: {
    color: "#f8f9fa",
    fontWeight: "bold",
    alignSelf: "center",
  },
  save_order_footer_reject_btn_text: {
    fontWeight: "bold",
    color: "#e31010",
    alignSelf: "center",
    marginTop: 16,
  },
  update_order_product_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount_btn_container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 100,
    backgroundColor: "#e2e3e5",
    padding: 4,
    borderRadius: 3,
  },
  amount_number: {
    fontWeight: "bold",
  },
});
