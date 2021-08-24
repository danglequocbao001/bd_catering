import React, { useEffect, useState } from "react";
import { Text, View, Header } from "../../components";
import { Entypo } from "@expo/vector-icons";
import {
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../types";
import { style } from "../../components";
import toast from "../../helpers/toast";
import Loader from "../../components/Loader";
import { format } from "../../helpers";

const checkIOS = Platform.OS === "ios" ? true : false;

export default function ProductScreen({
  navigation,
  route,
}: StackScreenProps<StackParamList, "Product">) {
  const [loading, setLoading] = useState(false);
  const food = route.params.food;

  useEffect(() => {
    console.log(food);
  }, []);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Loader loading={loading} />
      <View style={style.container}>
        <Header hasBack title="SẢN PHẨM" />
        <View style={{ marginTop: 10 }}>
          <Image
            style={styles.image}
            source={{ uri: food.images[0].imageUrl }}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <TouchableOpacity>
            <Text style={styles.title}>{food.foodName}</Text>
          </TouchableOpacity>
          <Text style={styles.desc}>{food.description}</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={[styles.footerPart, { backgroundColor: "#FFF" }]}>
          <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.cricle}>
                <Entypo name="credit" size={15} color="#FFF" />
              </View>
              <Text style={{ marginBottom: 3, marginLeft: 4 }}>Tạm tính</Text>
            </View>

            <Text style={styles.price}>
              {format.currencyFormat(food.price)}đ
            </Text>
          </View>
        </View>
        <TouchableOpacity style={{ width: "100%" }}>
          <View style={[styles.footerPart, { backgroundColor: "#209539" }]}>
            <Text
              style={{
                color: "#FFF",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: 16,
              }}
            >
              THÊM VÀO GIỎ HÀNG
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#209539",
    borderRadius: 20,
  },
  desc: {
    textAlign: "center",
    fontSize: 18,
  },
  image: {
    height: 220,
    borderRadius: 10,
    width: "100%",
  },
  cricle: {
    marginRight: 7,
    backgroundColor: "#FFC316",
    borderRadius: 100,
    width: 22,
    height: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    height: 70,
    width: "100%",
    flexDirection: "row",
  },
  footerPart: {
    height: "100%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    color: "#209539",
    fontWeight: "bold",
  },
});
