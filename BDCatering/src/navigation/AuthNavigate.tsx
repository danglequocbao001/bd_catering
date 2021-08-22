import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Email, Login, NewPassword, Signup, VerificationCode } from "../screens";
import { AuthStackParamList, IScreen, StackParamList } from "../types";
import BottomTabNavigator from "../screens/Contains/Tabs";
import { LayoutSuccess } from "../components";

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
      <StackAuth.Screen name="Email" component={Email} />
      <StackAuth.Screen name="NewPassword" component={NewPassword} />
      <StackAuth.Screen name="LayoutSuccess" component={LayoutSuccess} />
      <StackAuth.Screen name="VerificationCode" component = {VerificationCode} />

      {/* {screensAuth.map((screen) => {
        <StackAuth.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />;
      })} */}
    </StackAuth.Navigator>
  );
}
