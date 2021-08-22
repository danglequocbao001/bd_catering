import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";

import { defaultColor } from "../../../constants";
import useColorScheme from "../../../hooks/useColorScheme";
import { StackParamList } from "../../../types";
import { Feather } from "@expo/vector-icons";
import { View, Text } from "../../../components";
import { Platform, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import HomeScreen from "./Home";
import OrderScreen from "./Order";
import PersonalScreen from "./Personal";

const BottomStack = createBottomTabNavigator<StackParamList>();
const heightBottomTab = Platform.OS === "ios" ? 82 : 70;
export default function BottomTabNavigator({
  navigation,
  route,
}: StackScreenProps<StackParamList, "Root">) {
  const colorScheme = useColorScheme();

  return (
    <BottomStack.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: defaultColor[colorScheme].tint,
        style: styles.footer,
        showLabel: false,
      }}
    >
      <BottomStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View>
              <View style={styles.groupItemBtn}>
                <Text
                  style={[
                    {
                      color: focused
                        ? color
                        : defaultColor[colorScheme].background,
                    },
                    styles.dot,
                  ]}
                >
                  {" "}
                  ⬤
                </Text>
                <Feather name="home" size={24} color={color} />
              </View>
              <Text
                style={{
                  color: focused
                    ? color
                    : defaultColor[colorScheme].tabIconDefault,
                }}
              >
                Trang chủ
              </Text>
            </View>
          ),
        }}
      />
      <BottomStack.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View>
              <View style={styles.groupItemBtn}>
                <Text
                  style={[
                    {
                      color: focused
                        ? color
                        : defaultColor[colorScheme].background,
                    },
                    styles.dot,
                  ]}
                >
                  {" "}
                  ⬤
                </Text>
                <MaterialCommunityIcons
                  name="tag-outline"
                  size={24}
                  color={color}
                />
              </View>
              <Text
                style={{
                  color: focused
                    ? color
                    : defaultColor[colorScheme].tabIconDefault,
                }}
              >
                Đơn hàng
              </Text>
            </View>
          ),
        }}
      />
      <BottomStack.Screen
        name="Personal"
        component={PersonalScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View>
              <View style={styles.groupItemBtn}>
                <Text
                  style={[
                    {
                      color: focused
                        ? color
                        : defaultColor[colorScheme].background,
                    },
                    styles.dot,
                  ]}
                >
                  {" "}
                  ⬤
                </Text>
                <AntDesign name="user" size={24} color={color} />
              </View>
              <Text
                style={{
                  color: focused
                    ? color
                    : defaultColor[colorScheme].tabIconDefault,
                }}
              >
                Cá nhân
              </Text>
            </View>
          ),
        }}
      />
    </BottomStack.Navigator>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: heightBottomTab,
    borderTopWidth: 0,
    shadowColor: "#ccc",
    shadowOffset: { width: -3, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },

  groupItemBtn: {
    flexDirection: "column",
    alignItems: "center",
  },
  dot: {
    fontSize: 10.5,
    marginBottom: 3,
  },
});
