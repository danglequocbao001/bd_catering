import React, { useEffect, useState } from "react";
import { Text, View, Header } from "../../components";
import { Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { size } from "./../../constants";
import {
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../types";
import { style } from "../../components";
import toast from "../../helpers/toast";
import { productApi, cartItemApi } from "../../api";
import Loader from "../../components/Loader";
import { useAppSelector } from "../../hooks/useRedux";
import { useDispatch } from "react-redux";
import { actions } from "../../redux";

const checkIOS = Platform.OS === "ios" ? true : false;

export default function ProductScreen({
  navigation,
  route,
}: StackScreenProps<StackParamList, "Product">) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct]: any = useState([]);
  const dataProduct = route.params.item;
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [price, onChangePrice] = React.useState(0);
  const [amount, setAmount] = React.useState("1");
  const [option, setOption] = useState([]);
  const [property, setProperty] = useState([]);
  const [productOptionId, setOptionId] = useState(null);
  const [productPropertyId, setPropertyId] = useState(null);
  const [rawPrice, setRawPrice] = useState(0);
  const cartAmount = useAppSelector((state) => state.cart.cartAmount);

  useEffect(() => {
    onProduct();
  }, []);

  const dispatch = useDispatch();

  async function onProduct() {
    setLoading(true);
    try {
      const data = await productApi.getOne(dataProduct.id);
      setOption(data.product.product_options);
      setProperty(data.product.product_properties);
      setProduct(data.product);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  async function addToCart() {
    setLoading(true);
    if (parseInt(amount) <= 0) {
      toast.error("Số lượng không được nhỏ hơn hoặc bằng 0");
      setLoading(false);
    } else {
      try {
        await cartItemApi.create({
          cart_item: {
            product_id: parseInt(product.id),
            product_option_id: productOptionId,
            product_property_id: productPropertyId,
            amount: parseInt(amount),
          },
        });
        dispatch(actions.cartAmount.update(cartAmount + 1));
        toast.success("Thêm thành công!");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error);
      }
    }
  }

  function currencyFormat(num: any) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Loader loading={loading} />
      <View style={style.container}>
        <Header hasBack title="SẢN PHẨM" />
        <SafeAreaView>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ height: size.window.height - 160 }}
          >
            <Image
              style={styles.tinyLogo}
              source={{ uri: dataProduct.thumb_image.url }}
            />
            <View style={styles.group}>
              <Text style={styles.title}> {product.name}</Text>
              <View style={styles.selectGroup}>
                <Text style={styles.label}>Loại in</Text>
                {/* code for IOS */}
                {checkIOS && (
                  <Picker
                    itemStyle={{ height: "100%", fontSize: 14 }}
                    style={styles.selectIos}
                    selectedValue={selectedOption}
                    onValueChange={(item: any) => {
                      setSelectedOption(item.name);
                      setOptionId(item.id);
                    }}
                  >
                    {option.map((item: any) => {
                      return (
                        <Picker.Item
                          label={item.name}
                          value={item}
                          key={item.id}
                          style={styles.picker}
                        />
                      );
                    })}
                  </Picker>
                )}
                {/* code for android */}
                {!checkIOS && (
                  <View style={styles.selects}>
                    <Picker
                      selectedValue={selectedOption}
                      onValueChange={(item: any) => {
                        setSelectedOption(item.name);
                        setOptionId(item.id);
                      }}
                    >
                      {option.map((item: any) => {
                        return (
                          <Picker.Item
                            label={item.name}
                            value={item}
                            key={item.id}
                            style={styles.picker}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                )}
              </View>
              <View style={styles.selectGroup}>
                <Text style={styles.label}>Kích thước</Text>
                {/* Code for IOS */}
                {checkIOS && (
                  <Picker
                    itemStyle={{ height: "100%", fontSize: 14 }}
                    selectedValue={selectedProperty}
                    style={styles.selectIos}
                    onValueChange={(item: any) => {
                      setSelectedProperty(item.name);
                      setPropertyId(item.id);
                      onChangePrice(item.price);
                      setRawPrice(item.price * parseInt(amount));
                    }}
                  >
                    {property.map((item: any) => {
                      return (
                        <Picker.Item
                          label={item.name}
                          value={item}
                          key={item.id}
                          style={styles.picker}
                        />
                      );
                    })}
                  </Picker>
                )}

                {!checkIOS && (
                  <View style={styles.selects}>
                    {/*  Code for android */}
                    <Picker
                      itemStyle={{ height: 30, fontSize: 18 }}
                      selectedValue={selectedProperty}
                      onValueChange={(item: any) => {
                        setSelectedProperty(item.name);
                        setPropertyId(item.id);
                        onChangePrice(item.price);
                        setRawPrice(item.price * parseInt(amount));
                      }}
                    >
                      {property.map((item: any) => {
                        return (
                          <Picker.Item
                            label={item.name}
                            value={item}
                            key={item.id}
                            style={styles.picker}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                )}
              </View>
              <View style={!checkIOS ? styles.selectGroup : styles.groupIos}>
                <Text style={styles.label}>Số lượng</Text>
                <View
                  style={!checkIOS ? styles.selects : styles.selectInputIos}
                >
                  <TextInput
                    onChange={() => {
                      setRawPrice(price * parseInt(amount));
                    }}
                    onChangeText={setAmount}
                    value={amount}
                    style={styles.amount}
                  />
                </View>
              </View>
              <View style={!checkIOS ? styles.selectGroup : styles.groupIos}>
                <Text style={styles.label}>Đơn giá</Text>
                <View
                  style={!checkIOS ? styles.selects : styles.selectInputIos}
                >
                  <Text style={!checkIOS ? styles.priceUnit : styles.priceIos}>
                    {price}/MÉT
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
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

            <Text style={styles.price}>{currencyFormat(rawPrice)} đ</Text>
          </View>
        </View>
        <TouchableOpacity style={{ width: "100%" }} onPress={() => addToCart()}>
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
  group: {
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
  },
  tinyLogo: {
    height: 222,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 10,
    color: "rgba(0, 0, 0, 0.87)",
  },
  label: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    fontSize: 15,
  },
  selectGroup: {
    paddingTop: 20,
  },
  selectIos: {
    alignSelf: "center",
    height: 85,
    width: "100%",
  },
  selectInputIos: {
    backgroundColor: "#eeeef0",
    height: 36,
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 7,
  },
  selects: {
    borderRadius: 10,
    height: 45,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 7,
    borderWidth: 1,
  },
  groupIos: {
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
  },
  priceIos: {
    letterSpacing: 1.1,
    fontSize: 14,
    paddingLeft: 9,
    color: "#209539",
  },
  picker: {
    color: "#6d6d6d",
    fontWeight: "700",
  },
  amount: {
    paddingLeft: 9,
    color: "#6D6D6DDE",
    fontSize: 16,
  },
  itemSelect: {
    lineHeight: 45,
    textTransform: "uppercase",
  },
  input: {
    padding: 10,
  },
  unit: {
    color: "#209539",
    letterSpacing: 2,
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
    textTransform: "uppercase",
  },
  priceUnit: {
    letterSpacing: 1.1,
    fontSize: 16,
    paddingLeft: 9,
    color: "#209539",
  },
});
