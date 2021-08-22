import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RootStackParamList } from "../../types";
import { Header, Text, View, style } from "../../components";
import { useState } from "react";
import { orderApi } from "../../api";
import { useEffect } from "react";
import toast from "../../helpers/toast";
import Loader from "../../components/Loader";

export default function OrderDetail({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "OrderDetail">) {
  const [loading, setLoading] = useState(false);
  const [order, setOrders]: any = useState([]);
  const dataOrder = route.params.item;
  const [orderDetails, setOrderDetails]: any = useState([]);
  const [subStatus, setSubStatus] = useState({
    confirmed: false,
    paid: false,
    built: false,
    done: false,
  });
  useEffect(() => {
    onOrders();
  }, []);

  async function onOrders() {
    setLoading(true);
    try {
      const data = await orderApi.getOne(dataOrder.id);
      data.order.created_at = data.order.created_at.substring(0, 10);
      handleOrderStatus(data.order.status);
      setOrders(data.order);
      setOrderDetails(data.order.order_details);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  function cancelOrders() {
    Alert.alert(
      "Xác nhận hủy đơn?",
      "Bạn sẽ hủy đơn hàng này (hãy chắc chắn rằng đơn hàng bạn chưa thanh toán hoặc có thể nhận lại bồi hoàn, việc hủy đơn sẽ không làm ảnh hưởng đến hoạt động tài khoản!)",
      [
        { text: "Đóng" },
        {
          text: "Hủy đơn hàng",
          onPress: async () => {
            setLoading(true);
            try {
              await orderApi.delete(dataOrder.id);
              setLoading(false);
              navigation.goBack();
              toast.success("Đã hủy đơn hàng có ID " + dataOrder.id);
            } catch (error) {
              setLoading(false);
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
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

  function formatPaymentMethod(method: string) {
    if (method == "bank") return (method = "Chuyển khoản");
    else if (method == "momo") return (method = "MoMo");
    else if (method == "cash") return (method = "Tiền mặt");
  }

  function handleOrderStatus(orderStatus: string) {
    if (orderStatus == "confirmed") {
      setSubStatus({
        confirmed: true,
        paid: false,
        built: false,
        done: false,
      });
    } else if (orderStatus == "paid") {
      setSubStatus({
        confirmed: true,
        paid: true,
        built: false,
        done: false,
      });
    } else if (orderStatus == "built") {
      setSubStatus({
        confirmed: true,
        paid: true,
        built: true,
        done: false,
      });
    } else if (orderStatus == "done") {
      setSubStatus({
        confirmed: true,
        paid: true,
        built: true,
        done: true,
      });
    } else {
      setSubStatus({
        confirmed: false,
        paid: false,
        built: false,
        done: false,
      });
    }
  }

  function renderItem({ item }: { item: any }) {
    return (
      <View style={styles.mainView}>
        <Image
          source={{
            uri: item.product_thumb_image.url,
          }}
          style={styles.image}
        />
        <View style={{ flexDirection: "column", width: "60%" }}>
          <Text style={styles.title}>{item.product_name}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#6D6D6D",
                fontSize: 14,
                marginRight: 15,
                marginBottom: 15,
              }}
            >
              {item.product_option_name}
            </Text>
            <Text style={{ color: "#6D6D6D", fontSize: 14 }}>
              x{item.amount}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={[
                styles.circle,
                {
                  backgroundColor: "#FFC316",
                  width: 25,
                  height: 25,
                  marginRight: 10,
                },
              ]}
            >
              <Entypo
                name="credit"
                size={15}
                color="#FFF"
                style={{ marginLeft: 2 }}
              />
            </View>
            <Text style={styles.price}>{item.total_price}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <Loader loading={loading} />
      <View style={[style.container]}>
        <Header title="CHI TIẾT ĐƠN HÀNG" hasBack />
        <View style={styles.statusView}>
          <View
            style={
              subStatus.confirmed == true ? styles.circle : styles.revCircle
            }
          >
            <FontAwesome5 name="check" size={13} color="#FFF" />
          </View>
          <View style={styles.barCover}>
            <View
              style={subStatus.paid == true ? styles.bar : styles.revBar}
            ></View>
          </View>
          <View
            style={subStatus.paid == true ? styles.circle : styles.revCircle}
          >
            <FontAwesome5 name="check" size={13} color="#FFF" />
          </View>
          <View style={styles.barCover}>
            <View
              style={subStatus.built == true ? styles.bar : styles.revBar}
            ></View>
          </View>
          <View
            style={subStatus.built == true ? styles.circle : styles.revCircle}
          >
            <FontAwesome5 name="check" size={13} color="#FFF" />
          </View>
          <View style={styles.barCover}>
            <View
              style={subStatus.done == true ? styles.bar : styles.revBar}
            ></View>
          </View>
          <View
            style={subStatus.done == true ? styles.circle : styles.revCircle}
          >
            <FontAwesome5 name="check" size={13} color="#FFF" />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text>Xác nhận</Text>
          <Text>Thanh toán</Text>
          <Text>Thi công</Text>
          <Text>Giao hàng</Text>
        </View>
        <FlatList
          style={{ marginTop: 15 }}
          data={orderDetails}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => String(index)}
        ></FlatList>
      </View>
      <View
        style={{
          marginTop: 15,
          paddingBottom: 25,
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <Text style={[styles.title, { fontSize: 18 }]}>
          Chi tiết thanh toán
        </Text>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={styles.text}>Hình thức thanh toán</Text>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            {formatPaymentMethod(order.payment_method)}
          </Text>
        </View>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={styles.text}>Đã thanh toán</Text>
          <Text style={styles.text}>{order.paid_on}</Text>
        </View>
        <Text style={[styles.title, { fontSize: 18 }]}>Chi tiết đơn hàng</Text>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={styles.text}>Ngày đặt</Text>
          <Text style={styles.text}>{order.created_at}</Text>
        </View>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={styles.text}>Trạng thái</Text>
          <Text
            style={
              order.status == "failed"
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
            {formatStatus(order.status)}
          </Text>
        </View>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={styles.priceBottom}>Tổng tiền</Text>
          <Text style={styles.priceBottom}>{order.total_price}</Text>
        </View>
      </View>
      <View style={{ width: "100%", height: 70, flexDirection: "row" }}>
        {order.status == "failed" ? null : (
          <TouchableOpacity
            onPress={() => navigation.navigate("Payment", { id: dataOrder.id })}
            style={{
              backgroundColor: "#209539",
              height: "100%",
              width: "50%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Chưa thanh toán?
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => cancelOrders()}
          style={
            order.status == "failed"
              ? {
                  backgroundColor: "red",
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }
              : {
                  backgroundColor: "#209539",
                  height: "100%",
                  width: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                }
          }
          disabled={order.status == "failed" ? true : false}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {order.status == "failed" ? "Đơn đã hủy" : "Hủy đơn"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusView: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 10,
    paddingRight: 18,
    paddingBottom: 10,
    paddingLeft: 18,
  },
  barCover: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  bar: {
    borderWidth: 1,
    borderColor: "#209539",
    height: 1,
    width: "100%",
  },
  revBar: {
    borderWidth: 1,
    borderColor: "#6D6D6D",
    height: 1,
    width: "100%",
  },
  mainView: {
    flexDirection: "row",
    height: 120,
    borderColor: "#D8D8D8",
    borderRadius: 10,
    borderWidth: 2,
    paddingLeft: 5,
    paddingTop: 5,
    marginBottom: 15,
  },
  image: {
    width: "35%",
    height: "95%",
    borderRadius: 3,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 5,
  },
  text: {
    color: "#6D6D6D",
    marginBottom: 10,
  },
  circle: {
    backgroundColor: "#209539",
    borderRadius: 100,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  revCircle: {
    backgroundColor: "#209539",
    borderRadius: 100,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  price: {
    fontSize: 18,
    color: "#209539",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  priceBottom: {
    fontSize: 16,
    color: "#209539",
    fontWeight: "bold",
  },
});
