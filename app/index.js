import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./components/Home";
import Orders from "./user/Orders";
import OrderInfo from "./user/OrderInfo";
import UserProfile from "./user/UserProfile";
import PersonalInfo from "./user/PersonalInfo";
import EditPersonalInfo from "./user/EditPersonalInfo";
import BusinessProfile from "./business/BusinessProfile";
import Order from "./business/Order";
import Login from "./components/Login";
import SignIn from "./components/SignIn";
import Partners from "./partners/Partners";

const Stack = createStackNavigator();

export default function HomeScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderInfo"
        component={OrderInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditPersonalInfo"
        component={EditPersonalInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BusinessProfile"
        component={BusinessProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Order"
        component={Order}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Partners"
        component={Partners}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
