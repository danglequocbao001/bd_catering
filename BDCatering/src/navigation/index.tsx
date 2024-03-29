import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import * as React from "react";
import { useState } from "react";
import { ColorSchemeName } from "react-native";
import { storage } from "../helpers";
import toast from "../helpers/toast";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { actions } from "../redux";
import AuthNavigator from "./AuthNavigate";
import LinkingConfiguration from "./LinkingConfiguration";
import RootNavigator from "./RootNavigate";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const isLogin = useAppSelector((state) => state.auth.isLogin);

  React.useEffect(() => {
    getToken();
  }, []);
  async function getToken() {
    setLoading(true);
    try {
      const token = await storage.get("token");
      if (token) {
        dispatch(actions.auth.login(token));
      }
    } catch (error) {
      toast.error(error);
    }
    setLoading(false);
  }
  return (
    <>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        {isLogin ? <RootNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </>
  );
}
