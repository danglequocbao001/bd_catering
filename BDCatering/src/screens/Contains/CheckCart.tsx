import { Entypo, Octicons, SimpleLineIcons } from "@expo/vector-icons";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Header, Text, View, style } from "./../../components";
import { cartItemApi, orderApi } from "../../api";
import toast from "../../helpers/toast";
import Loader from "../../components/Loader";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../types";
import { useAppSelector } from "../../hooks/useRedux";

export default function CheckCartScreen({
  navigation,
  route,
}: StackScreenProps<StackParamList, "CheckCart">) {
  const [cart, setCart]: any = useState([
    {
      amount: "",
      product_id: "",
      product_name: "",
      product_option_id: null,
      product_option_name: "",
      product_property_id: "",
      product_property_name: "",
      product_thumb_image: {
        url: "",
      },
      total_price: "",
    },
  ]);
  const total = route.params.total;
  const [loading, setLoading] = useState(false);
  const [checkAddress, setcheckAddress] = React.useState(true);
  const phone = useAppSelector((state) => state.address.phone);
  const address = useAppSelector((state) => state.address.address);

  useEffect(() => {
    onCarts();
    phone != null && address != null
      ? setcheckAddress(true)
      : setcheckAddress(false);
  }, [phone, address]);
  async function onCarts() {
    setLoading(true);
    try {
      const data = await cartItemApi.get();
      if (data.cart_items.length == 0) {
      } else {
        setCart(data.cart_items);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  async function clearCart() {
    for (let obj of cart) {
      cartItemApi.delete(obj.id);
    }
  }

  async function createOrder() {
    setLoading(true);
    let order_details_attributes: any = [];
    for (let obj of cart) {
      order_details_attributes.push({
        amount: obj.amount,
        product_id: obj.product_id,
        product_option_id: obj.product_option_id,
        product_property_id: obj.product_property_id,
      });
    }
    try {
      const data = await orderApi.create({
        long: 0.0,
        lat: 0.0,
        note: "Cần tư vấn đầy đủ cho tộc trưởng của lâu đài",
        full_address: address,
        phone_number_receiver: phone,
        order_details_attributes: order_details_attributes,
      });
      clearCart();
      Alert.alert(
        "Chúng tôi đã tạo đơn hàng cho bạn",
        "Bạn muốn tiếp tục thanh toán tiền cọc hay sẽ thanh toán sau? (Thanh toán sau trong chi tiết đơn hàng bạn đang đặt)",
        [
          { text: "Thanh toán sau" },
          {
            text: "Tiếp tục",
            onPress: () =>
              navigation.navigate("Payment", { id: data.order.id }),
            style: "cancel",
          },
        ]
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  function currencyFormat(num: any) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }

  function renderItem({ item }: { item: any }) {
    return (
      <View>
        <View style={styles.mainView}>
          <Image
            source={{
              uri: item.product_thumb_image.url
                ? item.product_thumb_image.url
                : null,
            }}
            style={styles.image}
          />
          <View style={{ flexDirection: "column", width: "52%" }}>
            <Text style={styles.title}>{item.product_name}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: "#6D6D6D",
                  fontSize: 14,
                  marginRight: 15,
                  marginBottom: 20,
                }}
              >
                {item.product_option_name}
              </Text>
              <Text style={{ color: "#6D6D6D", fontSize: 14 }}>
                x{item.amount}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.cricle}>
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
      </View>
    );
  }

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <Loader loading={loading} />
      <View style={[style.container, { marginBottom: 10 }]}>
        <Header title="KIỂM TRA ĐƠN HÀNG" hasBack />
        {!checkAddress && (
          <Text style={{ fontSize: 16 }}>
            Bạn chưa có địa chỉ giao hàng, bấm
            <Text
              style={{ color: "#209539" }}
              onPress={() => navigation.navigate("DeliveryInformation")}
            >
              {" "}
              Tiếp tục
            </Text>{" "}
            để đi tới thêm địa chỉ
          </Text>
        )}
        {checkAddress && (
          <View
            style={{
              height: 150,
              borderColor: "#209539",
              borderWidth: 1.5,
              borderRadius: 5,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: "80%",
                height: "80%",
                marginTop: "3%",
                marginLeft: 10,
              }}
            >
              <View style={{ marginLeft: 10, marginTop: 10 }}>
                <Text
                  style={{
                    color: "#000",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  Thông tin giao hàng
                </Text>
                <View style={styles.inputCover}>
                  <Octicons style={styles.icon} name="tag" />
                  <Text>{address}</Text>
                </View>
                <View style={styles.inputCover}>
                  <SimpleLineIcons style={styles.icon} name="phone" />
                  <Text>{phone}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#209539",
                width: "55%",
                right: 3,
                height: "22%",
                marginTop: 112,
                position: "absolute",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
              // onPress={() => editInfo()}
              onPress={() => navigation.navigate("DeliveryInformation")}
            >
              <Text style={{ color: "#fff", fontSize: 13, padding: 3 }}>
                {/* {isEdit == true ? "Xác nhận" : "Sửa"} */}
                Chọn địa chỉ giao hàng khác
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 15 }}
          data={cart}
          renderItem={renderItem}
          keyExtractor={(item, index) => (item.id + index).toString()}
        ></FlatList>
      </View>
      <View style={{ height: 70, width: "100%", flexDirection: "row" }}>
        <View style={[styles.footerPart, { backgroundColor: "#FFF" }]}>
          <View style={{ flexDirection: "column" }}>
            <Text style={{ marginBottom: 3, marginLeft: 10 }}>
              {total.amount} Sản phẩm
            </Text>
            <Text style={styles.price}>{currencyFormat(total.price)} đ</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => {
            createOrder();
          }}
        >
          <View style={[styles.footerPart, { backgroundColor: "#209539" }]}>
            <Text
              style={{
                color: "#FFF",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: 16,
              }}
            >
              Thanh toán
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputCover: {
    flexDirection: "row",
    marginTop: 2,
  },
  icon: {
    fontSize: 18,
    color: "#979797",
    marginTop: 2,
    marginRight: 6,
  },
  input: {
    fontSize: 16,
    marginLeft: 5,
    color: "#6D6D6D",
  },
  editInput: {
    fontSize: 16,
    marginLeft: 5,
    color: "#6D6D6D",
    borderWidth: 1,
    borderColor: "#209539",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  mainView: {
    flexDirection: "row",
    height: 120,
    borderColor: "#D8D8D8",
    borderRadius: 10,
    borderWidth: 2,
    paddingLeft: 5,
    paddingTop: 5,
    marginBottom: 5,
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
  price: {
    fontSize: 18,
    color: "#209539",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  footerPart: {
    height: "100%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
});
