import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Login, Signup } from "../screens";
import { IScreen, StackParamList } from "../types";
import BottomTabNavigator from "../screens/Contains/Tabs";

interface IAuthScreen extends IScreen {
  name: keyof StackParamList;
}
const screensAuth: IAuthScreen[] = [
  {
    name: "Signup",
    component: Signup,
    options: {
      headerShown: false,
    },
  },
  {
    name: "Login",
    component: Login,
    options: {
      headerShown: false,
    },
  },
];
const StackAuth = createStackNavigator<StackParamList>();

export default function AuthNavigator() {
  return (
    <StackAuth.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <StackAuth.Screen name="Root" component={BottomTabNavigator} />
      <StackAuth.Screen name="Login" component={Login} />
      <StackAuth.Screen name="Signup" component={Signup} />
    </StackAuth.Navigator>
  );
}
