import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import * as React from "react";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Linking,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { Header, Text, View, style } from "./../../components";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../types";
import { orderApi, paymentApi } from "../../api";
import Loader from "../../components/Loader";
import { toast } from "../../helpers";

export default function Payment({
  route,
}: StackScreenProps<StackParamList, "Payment">) {
  const orderId = route.params.id;
  const [loading, setLoading] = useState(false);
  const [paymentValue, setPaymentValue] = useState("CHUYỂN KHOẢN");
  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [content, setContent] = useState(
    "Nội dung: <user>_thanh toan_<ID đơn hàng>"
  );
  const [orderDetail, setOrderDetail]: any = useState([]);
  const [property, setProperty] = useState({
    type: 0,
    totalItem: 0,
  });

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    try {
      const dataOrder = await orderApi.getOne(orderId);
      setOrderDetail(dataOrder.order);
      calProperty(dataOrder.order.order_details);
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  }

  function calProperty(order: any) {
    let temmpType = order.length;
    let tempTotalItem = 0;
    for (let obj of order) {
      tempTotalItem += obj.amount;
    }
    setProperty({
      type: temmpType,
      totalItem: tempTotalItem,
    });
  }

  function payment() {
    if (name == "") {
      toast.warning("Quý khách vui lòng điền đầy đủ họ tên!");
    } else {
      if (paymentValue == "banking") {
        if (accountNumber == "") {
          toast.warning("Quý khách vui lòng điền đầy đủ số tài khoản!");
        } else {
          Alert.alert(
            "Chuyển khoản bằng ngân hàng",
            "Bạn hãy sử dụng bất kỳ phương thức chuyển khoản nào, thanh toán trước 60% tiền cọc (" +
              orderDetail.prepayment +
              ') như bên dưới qua ngân hàng vào số tài khoản ở trên cùng với nội dung chúng tôi đã để sẵn (bấm vào biểu tượng bên cạnh đó để sao chép, điền tên người dùng và mã đơn hàng như mẫu), sau khi đã chuyển khoản, bấm "Xác nhận đã chuyển khoản" để chúng tôi xác nhận đơn hàng và báo lại bạn!',
            [
              {
                text: "Xác nhận đã chuyển khoản",
                onPress: async () => {
                  setLoading(true);
                  const param = {
                    payment: {
                      order_id: orderDetail.id,
                      full_name: name,
                      account_number: accountNumber,
                      bank_info: "",
                      note: "",
                    },
                  };
                  try {
                    await paymentApi.bank(param);
                    toast.success(
                      "Gửi yêu cầu xác nhận thành công, chúng tôi sẽ sớm liên hệ lại bạn!"
                    );
                    setLoading(false);
                  } catch (error) {
                    toast.error(error);
                    setLoading(false);
                  }
                },
              },
              {
                text: "Đóng và tiếp tục chuyển khoản",
              },
            ],
            {
              cancelable: true,
            }
          );
        }
      } else if (paymentValue == "momo") {
        Alert.alert(
          "Thanh toán bằng MoMo",
          "Dùng MoMo thanh toán trước 60% tiền cọc (" +
            orderDetail.prepayment +
            ") như bên dưới qua MoMo của chúng tôi cùng với nội dung chúng tôi đã để sẵn (bấm vào biểu tượng bên cạnh đó để sao chép, điền tên người dùng và mã đơn hàng như mẫu)",
          [
            {
              text: "Đóng",
            },
            {
              text: "Tiếp tục thanh toán",
              onPress: async () => {
                setLoading(true);
                const param = {
                  payment: {
                    app_link: "no link",
                    order_id: orderDetail.id,
                  },
                };
                try {
                  const data = await paymentApi.momo(param);
                  Linking.canOpenURL(data.pay_url).then((supported) => {
                    if (supported) {
                      Linking.openURL(data.pay_url);
                    } else {
                    }
                  });
                  setLoading(false);
                } catch (error) {
                  toast.error(error);
                  setLoading(false);
                }
              },
            },
          ],
          {
            cancelable: true,
          }
        );
      } else if (paymentValue == "cash") {
        Alert.alert(
          "Thanh toán bằng tiền mặt",
          "Hãy bấm 'Gửi yêu cầu' để chúng tôi biết bạn sẽ thanh toán bằng tiền mặt, sau đó thanh toán trước 60% tiền cọc (" +
            orderDetail.prepayment +
            ") như bên dưới tại cửa hàng chúng tôi, chúng tôi sẽ xác nhận trực tiếp với bạn!",
          [
            {
              text: "Đóng",
            },
            {
              text: "Gửi yêu cầu",
              onPress: async () => {
                setLoading(true);
                const param = {
                  payment: {
                    order_id: orderDetail.id,
                  },
                };
                try {
                  await paymentApi.cash(param);
                  toast.success(
                    "Gửi yêu cầu xác nhận thành công, hẹn gặp bạn tại cửa hàng của chúng tôi!"
                  );
                  setLoading(false);
                } catch (error) {
                  toast.error(error);
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
    }
  }

  const copyToClipboard = (string: string) => {
    Clipboard.setString(string);
    toast.success("Đã sao chép '" + string + "' vào bộ nhớ tạm!");
  };

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
    <ScrollView style={[style.container]}>
      <Loader loading={loading} />
      <Header title="THANH TOÁN" hasBack />
      <View style={styles.group}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <FontAwesome
              name="credit-card"
              size={22}
              color={"#209539"}
              style={{ marginRight: 10 }}
            ></FontAwesome>
            <Text style={{ fontSize: 17, fontWeight: "bold", lineHeight: 18 }}>
              STK: 0999999999
            </Text>
            <TouchableOpacity onPress={() => copyToClipboard("0999999999")}>
              <MaterialIcons
                name="content-copy"
                size={24}
                color="black"
                style={{ marginLeft: 50 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.infoText}>Nguyễn văn A</Text>
          <Text style={styles.infoText}>Ngân hàng ACB, chi nhánh A</Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              marginLeft: 35,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                width: "70%",
                height: "100%",
              }}
            >
              {content}
            </Text>
            <TouchableOpacity
              onPress={() => copyToClipboard("<user>_thanh toan_<mã đơn>")}
            >
              <MaterialIcons
                name="content-copy"
                size={24}
                color="black"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.pickerText}>Thanh toán bằng</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={paymentValue}
          onValueChange={(itemValue, itemIndex) => setPaymentValue(itemValue)}
        >
          <Picker.Item label="CHUYỂN KHOẢN" value="banking" />
          <Picker.Item label="MOMO" value="momo" />
          <Picker.Item label="TIỀN MẶT" value="cash" />
        </Picker>
      </View>
      {/* <View style={{ flexDirection: "row", marginBottom: 15, width: "90%" }}>
        <Text style={[styles.notice, { fontWeight: "bold" }]}>*Lưu ý: </Text>
        <Text style={styles.notice}>
          Nếu bạn thanh toán bằng tiền mặt, hãy giao dịch với chúng tôi tại cửa
          hàng, chúng tôi sẽ xác nhận trực tiếp với bạn!
        </Text>
      </View> */}
      <Text style={styles.pickerText}>Tên chủ tài khoản</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        onChangeText={(text) => setName(text)}
        defaultValue={name}
      />
      {paymentValue == "banking" ? (
        <View style={{ marginTop: 5 }}>
          <Text style={styles.pickerText}>Số tài khoản</Text>
          <TextInput
            style={styles.input}
            placeholder="Số tài khoản"
            onChangeText={(accountNumber) => setAccountNumber(accountNumber)}
            defaultValue={accountNumber}
          />
        </View>
      ) : null}
      <FlatList
        style={{ marginTop: 15 }}
        data={orderDetail.order_details}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(index)}
      ></FlatList>
      <View style={styles.bottomView}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <Text style={styles.total}>ID đơn hàng</Text>
          <Text style={styles.total}>{orderDetail.id}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.bottomText}>Loại hàng</Text>
          <Text style={styles.bottomText}>{property.type} loại</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.bottomText}>Tổng số món</Text>
          <Text style={styles.bottomText}>{property.totalItem}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.bottomText}>Tổng tiền hàng</Text>
          <Text style={styles.bottomText}>{orderDetail.total_price}</Text>
        </View>
        <View style={styles.bar}></View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.total}>Tổng cộng:</Text>
          <Text style={[styles.total, { color: "#209539" }]}>
            {orderDetail.total_price}
          </Text>
        </View>
      </View>

      <View style={[styles.payment]}>
        <Text>Cần thanh toán trước 60%</Text>
        <Text style={{ color: "#209539", fontWeight: "700" }}>
          {orderDetail.prepayment}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={payment}>
        <Text style={styles.buttonText}>THANH TOÁN</Text>
      </TouchableOpacity>
      <View
        style={[
          styles.group,
          { flexDirection: "row", justifyContent: "center" },
        ]}
      >
        <Text style={{ color: "#6D6D6D" }}>Cần trợ giúp? Hotline</Text>
        <TouchableOpacity onPress={() => copyToClipboard("0987 291 009")}>
          <Text
            style={{
              textDecorationLine: "underline",
              color: "#6D6D6D",
              marginLeft: 5,
            }}
          >
            0987 291 009
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  circle: {
    backgroundColor: "#209539",
    borderRadius: 100,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  price: {
    fontSize: 18,
    color: "#209539",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoText: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 35,
  },
  pickerText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#6D6D6DDE",
  },
  group: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  picker: {
    width: "100%",
    color: "#6D6D6DDE",
    borderWidth: 1,
    borderColor: "#209539",
    borderRadius: 10,
    height: 40,
    paddingVertical: 8,
    marginBottom: 10,
  },
  payment: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 7,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 17,
    color: "#6D6D6D",
    fontWeight: "bold",
  },
  bottomView: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#D2D2D2",
    borderRadius: 5,
    marginTop: 20,
  },
  bottomText: {
    fontSize: 14,
    color: "#6D6D6D",
    marginBottom: 15,
  },
  bar: {
    borderColor: "#D2D2D2",
    borderWidth: 0.5,
    marginBottom: 15,
  },
  total: {
    color: "#6D6D6D",
    fontSize: 14,
    fontWeight: "bold",
  },

  button: {
    height: 60,
    width: "70%",
    borderRadius: 10,
    backgroundColor: "#209539",
    marginTop: 15,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#fff",
  },
  notice: {
    fontSize: 14,
    color: "#000",
  },
});
