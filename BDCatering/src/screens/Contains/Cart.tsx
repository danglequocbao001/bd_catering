import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Header, Text, View, style } from "./../../components";
import { cartItemApi } from "../../api";
import toast from "../../helpers/toast";
import Loader from "../../components/Loader";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../types";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { actions } from "../../redux";

export default function CartScreen({
  navigation,
}: StackScreenProps<StackParamList, "Root">) {
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
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({
    amount: 0,
    price: 0,
  });
  const [isNull, setNull] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      onCarts();
    }, [])
  );

  const dispatch = useDispatch();

  async function onCarts() {
    setLoading(true);
    try {
      const data = await cartItemApi.get();
      if (data.cart_items.length == 0) {
        setNull(true);
        dispatch(actions.cartAmount.update(0));
      } else {
        setNull(false);
        setCart(data.cart_items);
        totalPrice(data.cart_items);
        dispatch(actions.cartAmount.update(data.cart_items.length));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  function totalPrice(cart: any) {
    let amount = cart.length;
    let price = 0;
    for (let obj of cart) {
      let tempPrice = parseInt(obj.total_price.replace(/\./g, ""));
      price += tempPrice;
    }
    setTotal({
      amount: amount,
      price: price,
    });
  }

  function currencyFormat(num: any) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }

  function deleteCart(id: any) {
    Alert.alert(
      "Xóa khỏi giỏ hàng?",
      "Bạn muốn xóa sản phẩm khỏi giỏ hàng?",
      [
        { text: "Đóng" },
        {
          text: "Xóa",
          onPress: async () => {
            await cartItemApi.delete(id);
            onCarts();
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  function clearCart() {
    if (isNull == true) {
      toast.warning(
        "Giỏ hàng hiện đang rỗng, quay lại để thêm sản phẩm vào giỏ hàng"
      );
    } else {
      Alert.alert(
        "Xóa tất cả?",
        "Bạn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?",
        [
          { text: "Đóng" },
          {
            text: "Xóa",
            onPress: () => {
              setCart([]);
              setNull(true);
              dispatch(actions.cartAmount.update(0));
              for (let obj of cart) {
                cartItemApi.delete(obj.id);
              }
            },
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  }

  function renderItem({ item }: { item: any }) {
    return isNull == true ? (
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
          Giỏ hàng rỗng, quay lại để thêm vào giỏ hàng
        </Text>
        <MaterialCommunityIcons
          style={{ marginTop: 50 }}
          name="cart-remove"
          size={150}
          color={"#e6e6e6"}
        />
      </View>
    ) : (
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
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              width: "8%",
            }}
          >
            <TouchableOpacity onPress={() => deleteCart(item.id)}>
              <AntDesign
                name="closecircle"
                size={18}
                color={"#D8D8D8"}
                style={{ marginLeft: 10 }}
              ></AntDesign>
            </TouchableOpacity>
            {/* <AntDesign
                name="checksquareo"
                size={22}
                color={"#D8D8D8"}
                style={{ marginLeft: 8, marginBottom: 8 }}
              ></AntDesign> */}
          </View>
        </View>
        {/* <TouchableOpacity>
            <View style={styles.editCover}>
              <Text style={styles.edit}>Sửa</Text>
            </View>
          </TouchableOpacity> */}
      </View>
    );
  }

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <Loader loading={loading} />
      <View style={style.container}>
        <Header title="GIỎ HÀNG" hasBack />
        <TouchableOpacity
          onPress={() => clearCart()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-end",
          }}
        >
          <AntDesign name="delete" size={25} color={"#D8D8D8"}></AntDesign>
          <Text style={{ marginLeft: 5, color: "#209539" }}>Xóa tất cả</Text>
        </TouchableOpacity>
        {/* <View
          style={{
            flexDirection: "row",
            right: 0,
            marginLeft: width * 0.74,
            marginTop: -15,
          }}
        >
          <Text
            style={{
              textAlign: "right",
              fontSize: 15,
              fontWeight: "700",
              marginRight: 5,
            }}
          >
            Tất cả
          </Text>
          <AntDesign
            name="checksquareo"
            size={20}
            color={"#D8D8D8"}
          ></AntDesign>
        </View> */}
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 15 }}
          data={cart}
          renderItem={renderItem}
          keyExtractor={(item, index) => String(index)}
        />
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
          disabled={isNull}
          style={{ width: "100%" }}
          onPress={() =>
            navigation.navigate("CheckCart", {
              cart: cart,
              total: { amount: total.amount, price: total.price },
            })
          }
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
              Kiểm tra đơn hàng
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  editCover: {
    backgroundColor: "#D8D8D8",
    width: 45,
    height: 20,
    borderRadius: 15,
    marginBottom: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  edit: {
    textTransform: "uppercase",
    color: "#FFF",
    fontSize: 10,
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
    textTransform: "uppercase",
  },
});
