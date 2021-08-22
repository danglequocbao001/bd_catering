import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Cart,
  CheckCart,
  DeliveryInformation,
  Login,
  OrderDetail,
  Payment,
  Product,
  Search,
  ChangePassword,
  SearchResult,
} from "../screens";
import BottomTabNavigator from "../screens/Contains/Tabs";
import { IScreen, RootStackParamList, StackParamList } from "../types";

interface IRootScreen extends IScreen {
  name: keyof RootStackParamList;
}
const screens: IRootScreen[] = [
  {
    name: "Search",
    component: Search,
    options: {
      headerShown: false,
    },
  },
  {
    name: "Cart",
    component: Cart,
    options: {
      headerShown: false,
    },
  },
  {
    name: "CheckCart",
    component: CheckCart,
    options: {
      headerShown: false,
    },
  },
  {
    name: "Product",
    component: Product,
    options: {
      headerShown: false,
    },
  },

  {
    name: "OrderDetail",
    component: OrderDetail,
    options: {
      headerShown: false,
    },
  },
  {
    name: "Payment",
    component: Payment,
    options: {
      headerShown: false,
    },
  },
  {
    name: "DeliveryInformation",
    component: DeliveryInformation,
    options: {
      headerShown: false,
    },
  },
  {
    name: "ChangePassword",
    component: ChangePassword,
    options: {
      headerShown: false,
    },
  },
  {
    name: "SearchResult",
    component: SearchResult,
    options: {
      headerShown: false,
    },
  },
  
];

const Stack = createStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator}></Stack.Screen>
      <Stack.Screen name="Login" component={Login}></Stack.Screen>
      {screens.map((screen) => (
        <Stack.Screen
          name={screen.name}
          key={screen.name}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
}
