import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StackParamList } from "../../types";
import { Header, Text, View, style } from "../../components";
import { useState } from "react";
import toast from "../../helpers/toast";
import Loader from "../../components/Loader";
import { FlatList } from "react-native-gesture-handler";
import { size } from "../../constants";
import { deliveryAddressApi } from "../../api";
import { useFocusEffect } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { actions } from "../../redux";
import { storage } from "../../helpers";

export default function DeliveryInformation({
  navigation,
  route,
}: StackScreenProps<StackParamList, "DeliveryInformation">) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setChangeAddress] = React.useState("");
  const [phone, setChangePhone] = React.useState("");
  const [type, setType] = React.useState("");
  const [idEdit, setIdEdit] = React.useState("");

  const idAddressActive = useAppSelector(
    (state) => state.address.idAddressActive
  );
  const [Addresses, setChangeAddresses]: any = React.useState();
  const [isNull, setNull] = useState(true);
  const [request, setRequest] = useState({
    page: 1,
    per_page: 1000,
  });
  React.useEffect(() => {
    getAll();
  }, []);

  async function getAll() {
    try {
      setLoading(true);
      const data = await deliveryAddressApi.getAll(request);
      if (data.shipment_details.length == 0) {
        setNull(true);
        dispatch(actions.address.clear());
      } else {
        if (data.shipment_details.length == 1) {
          const payload = {
            address: data.shipment_details[0].full_address,
            phone: data.shipment_details[0].phone_number,
            idAddressActive: data.shipment_details[0].id,
          };
          dispatch(actions.address.update(payload));
        }
        setNull(false);
        setChangeAddresses(data.shipment_details);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  async function submit() {
    setModalVisible(!modalVisible);

    try {
      setLoading(true);

      if (type == "edit") {
        const param = {
          shipment_detail: {
            phone_number: phone,
            full_address: address,
          },
        };
        phone.slice(0, 3) != "+84"
          ? (param.shipment_detail.phone_number = `+84${phone.substring(1)}`)
          : param.shipment_detail.phone_number;
        await deliveryAddressApi.update(idEdit, param);
        const payload = {
          address: address,
          phone: phone,
          idAddressActive: idEdit,
        };
        idEdit == idAddressActive
          ? dispatch(actions.address.update(payload))
          : null;
        toast.success("Chỉnh sửa địa chỉ thành công");
      } else if (type == "add") {
        const param = {
          shipment_detail: {
            phone_number: `+84${phone.substring(1)}`,
            full_address: address,
          },
        };
        await deliveryAddressApi.create(param);

        toast.success("Thêm địa chỉ thành công");
      }

      setLoading(false);

      getAll();
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
    setChangeAddress("");
    setChangePhone("");
  }
  function activeAddress(item: any) {
    const payload = {
      address: item.full_address,
      phone: item.phone_number,
      idAddressActive: item.id,
    };
    dispatch(actions.address.update(payload));
  }
  function editInfoAddress(item: any) {
    setType("edit");
    setModalVisible(!modalVisible);
    setIdEdit(item.id);
    setChangeAddress(item.full_address);
    setChangePhone(item.phone_number);
  }

  function deleteInfoAddress(id: any) {
    Alert.alert(
      "Xóa địa chỉ giao hàng?",
      "Bạn sẽ xóa địa chỉ giao hàng này?",
      [
        { text: "Đóng" },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              setLoading(true);
              await deliveryAddressApi.delete(id);
              getAll();
              toast.success("Đã xóa");
              setLoading(false);
            } catch (error) {
              setLoading(false);
              toast.error(error);
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  function renderItem({ item }: { item: any }) {
    return (
      <TouchableOpacity
      style={[
        styles.wrap,
        styles.wrapInfo,
        item.id == idAddressActive ? { borderColor: "#209539" } : null,
      ]}
      onPress={() => activeAddress(item)}
    >
      <Text style={styles.text}>Thông tin giao hàng</Text>
      <View style={[styles.group]}>
        <AntDesign
          name="tago"
          size={20}
          color="#6D6D6D"
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: "#6D6D6D" }}>{item.full_address}</Text>
      </View>
      <View style={[styles.group]}>
        <Feather
          name="phone"
          size={20}
          color="#6D6D6D"
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: "#6D6D6D" }}> {item.phone_number}</Text>
      </View>
      <View style={[styles.group, styles.groupEdit]}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={() => editInfoAddress(item)}>
            Sửa
          </Text>
        </TouchableOpacity>
        <MaterialCommunityIcons
          name="delete-outline"
          size={28}
          color="#979797"
          onPress={() => deleteInfoAddress(item.id)}
        />
      </View>
    </TouchableOpacity>
    )
   
  }

  return (
    <View style={[style.container]}>
      <Loader loading={loading} />
      <Header title="THÔNG TIN GIAO HÀNG" hasBack />
     {
       isNull &&  <View
       style={{
         width: "100%",
         height: "100%",
         alignItems: "center",
         flexDirection: 'column'
       }}
     >
     
       <MaterialCommunityIcons
        style={{
          marginTop: 50
        }}
         name="information"
         size={150}
         color={"#e6e6e6"}
       />
         <Text
         style={{
           fontWeight: "bold",
           fontSize: 16,
           color: "#6D6D6D",
           marginTop: 50
         }}
       >
         Thông tin giao hàng rỗng, bạn hãy thêm vào
       </Text>
     </View>
     }
      <FlatList
        data={Addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {/* Modal */}

      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.backdrop}></View>
          <View style={styles.modalView}>
            <View style={[styles.wrap]}>
              <Text style={styles.item}>
                {type == "add" ? <Text>Nhập </Text> : <Text>Chỉnh sửa </Text>}
                địa chỉ giao hàng:
              </Text>
              <TextInput
                style={[styles.input, styles.item, styles.mrauto]}
                onChangeText={setChangeAddress}
                value={address}
              />
              <Text style={styles.item}>Số điện thoại:</Text>
              <TextInput
                style={[styles.input, styles.item, styles.mrauto]}
                onChangeText={setChangePhone}
                value={phone}
              />
              <View style={styles.row}>
                <Pressable
                  style={[
                    styles.button,
                    styles.mrauto,
                    { backgroundColor: "#fff" },
                  ]}
                  onPress={() => {
                    setModalVisible(!modalVisible),
                      setChangeAddress(""),
                      setChangePhone("");
                  }}
                >
                  <Text style={[styles.buttonText, { color: "#000" }]}>
                    Hủy
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.mrauto]}
                  onPress={submit}
                >
                  <Text style={styles.buttonText}>Đồng ý</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.btnFooter]}
        onPress={() => {
          setModalVisible(true), setType("add");
        }}
      >
        <Text style={styles.buttonText}>THÊM</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#828282",
    opacity: 0.5,
    zIndex: -1,
  },
  modalView: {
    marginTop: size.window.height * 0.35,
    width: "80%",
    height: size.window.height * 0.25,
    justifyContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  item: {
    marginBottom: 10,
    marginHorizontal: 7,
  },
  input: {
    height: 36,
    width: "100%",
    borderRadius: 10,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  mrauto: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  text: { fontWeight: "700", fontSize: 16 },
  wrap: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 10,
    borderRadius: 8,
  },
  wrapInfo: {
    marginBottom: 20,
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  groupColumn: {
    flexDirection: "column",
  },
  groupEdit: {
    paddingLeft: "50%",
    justifyContent: "space-around",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  btnFooter: {
    width: "100%",
    height: 60,
    position: "absolute",
    bottom: 20,
    left: 16,
  },
  button: {
    height: 40,
    width: "38%",
    borderRadius: 6,
    backgroundColor: "#209539",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
