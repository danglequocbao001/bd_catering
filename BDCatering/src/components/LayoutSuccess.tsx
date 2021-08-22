import * as React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, View } from "./Themed";
import { Ionicons } from "@expo/vector-icons";
import { IHeader, StackParamList } from "../types";
import { useNavigation } from "@react-navigation/native";
import { size } from "../constants";
import { StackScreenProps } from "@react-navigation/stack";
import Header from "./Header";
import style  from './StyledText'
import { useEffect } from "react";
export default function LayoutSuccess({
  navigation,
  route,
}: StackScreenProps<StackParamList, "LayoutSuccess">) {
  const title = route.params.title;
  useEffect(() => {
    setTimeout(() =>{
      navigation.navigate('Login')
    }, 1900)
    return () => {
    }
  }, [])
  function go() {
      navigation.navigate('Login')
  }
  return (
    <View style={style.container}>
      <Header title="Quên mật khẩu" color="#00244E" hasBack />
      <View style={styles.wrap}>
        <View style = {styles.group}>
          <Ionicons name="ios-checkmark-circle" size={60} color="#209539" style ={{marginBottom: 20}} />
          <Text style ={{fontSize: 14}}> {title}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={go}>
          <Text
            style={{
              color: "#fff",
              fontSize: 17,
              fontWeight: "700",
            }}
          >
            Xác nhận
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textTransform: "uppercase",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  group: {
    alignItems: 'center'
  },
  wrap: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
  },
  button: {
    backgroundColor: "#209539",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: 57,
    width: "100%",
  },
  ionCheck: {
    width: 30,
    height: 30,
  },
});
