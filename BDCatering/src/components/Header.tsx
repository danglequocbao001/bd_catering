import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";
import { Ionicons } from "@expo/vector-icons";
import { IHeader } from "../types";
import { useNavigation } from "@react-navigation/native";
import { size } from "../constants";

export default function Header({ title, hasBack, color }: IHeader) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {hasBack && <TouchableOpacity
        style={styles.wrapIon}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#8F8F8F" />
      </TouchableOpacity>
      }
     
      <Text style={[styles.title, {color: color? color: '#000'}]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginBottom: 10,
  },
  wrapIon: {
    borderRadius: 1000,
    shadowColor: "#ccc",
    position: "absolute",
    left: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    elevation: 6,
    width: 50,
    height: 50,
    marginRight: 14,
  },
  title: {
    textTransform: "uppercase",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
