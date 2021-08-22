import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Text, View, style, Header } from "../../../components";
import { RootStackParamList } from "../../../types";
import { orderApi } from "../../../api";
import toast from "../../../helpers/toast";
import Loader from "../../../components/Loader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function OrderScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "Root">) {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders]: any = useState([
    {
      id: "",
      total_price: "",
      status: "",
      created_at: "",
      total_product: "",
      order_details: [
        {
          amount: "",
          total_price: "",
          product_name: "",
          product_option_name: "",
          product_property_name: "",
        },
      ],
    },
  ]);
  const [isNull, setNull] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      onOrders();
    }, [])
  );

  async function onOrders() {
    setLoading(true);
    try {
      const data = await orderApi.get();
      if (data.orders.length == 0) {
        setNull(true);
      } else {
        setNull(false);
        setOrders(data.orders);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  function formatStatus(status: string) {
    if (status == "pending") return (status = "Chờ xác nhận");
    else if (status == "confirmed") return (status = "Đã xác nhận");
    else if (status == "paid") return (status = "Đã thanh toán");
    else if (status == "built") return (status = "Đã thi công");
    else if (status == "done") return (status = "Đã giao hàng");
    else if (status == "failed") return (status = "Đã hủy");
    else return status;
  }

  function renderItem({ item }: { item: any }) {
    let options: string = "";
    for (let obj of item.order_details) {
      if (obj.product_option_name != "") {
        options += obj.product_option_name + ", ";
      }
    }
    options = options.substring(0, options.length - 2);
    if (isNull) {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginTop: 80,
              fontWeight: "bold",
              fontSize: 16,
              color: "#6D6D6D",
            }}
          >
            Hiện không có đơn hàng nào
          </Text>
          <MaterialCommunityIcons
            style={{ marginTop: 50 }}
            name="cart-off"
            size={150}
            color={"#e6e6e6"}
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate("OrderDetail", { item: item })}
        >
          <View style={styles.orderView}>
            <Text style={styles.title}>ID đơn hàng: {item.id}</Text>
            <Text style={styles.orderText}>Tùy chọn: {options}</Text>
            <Text style={styles.orderText}>
              Ngày đặt: {item.created_at.substring(0, 10)}
            </Text>
            <View
              style={{
                width: "100%",
                borderWidth: 0.5,
                borderColor: "#D2D2D2",
                marginBottom: 10,
              }}
            ></View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "50%" }}>
                <Text style={styles.orderText}>Trạng thái</Text>
                <Text style={styles.orderText}>Loại hàng</Text>
                <Text style={[styles.orderText, { marginBottom: 0 }]}>Giá</Text>
              </View>
              <View style={{ width: "30%", marginLeft: "20%" }}>
                <Text
                  style={
                    item.status == "failed"
                      ? {
                          fontSize: 14,
                          color: "#FF0000",
                          marginBottom: 10,
                          fontWeight: "bold",
                        }
                      : {
                          fontSize: 14,
                          color: "#209539",
                          marginBottom: 10,
                          fontWeight: "bold",
                        }
                  }
                >
                  {formatStatus(item.status)}
                </Text>
                <Text style={styles.orderText}>{item.total_product} loại</Text>
                <Text
                  style={[
                    styles.orderText,
                    { fontWeight: "bold", color: "#209539", marginBottom: 0 },
                  ]}
                >
                  {item.total_price}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }

  return (
    <View style={style.container}>
      <Loader loading={loading} />
      <Header title="ĐƠN HÀNG" />
      <View style={styles.mainView}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 15 }}
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item, index) => String(index)}
        ></FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: "column",
    paddingBottom: 80,
  },
  orderView: {
    padding: 10,
    borderColor: "#D2D2D2",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderText: {
    fontSize: 14,
    color: "#6D6D6D",
    marginBottom: 10,
  },
});
