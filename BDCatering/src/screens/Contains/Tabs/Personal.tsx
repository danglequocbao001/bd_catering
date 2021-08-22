import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Clipboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Text, View, style } from "../../../components";
import { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../../types";
import { useDispatch } from "react-redux";
import { actions } from "../../../redux";
import Loader from "../../../components/Loader";
import { userApi } from "../../../api";
import toast from "../../../helpers/toast";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function PersonalScreen({
  navigation,
}: StackScreenProps<StackParamList, "Root">) {
  const [loading, setLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [profile, setProfile]: any = useState([]);
  const [onChangeName, setChangeName] = React.useState("");
  const textDetail = {
    title: "TƯ VẤN - THIẾT KẾ - THI CÔNG QUẢNG CÁO TẠI TP.HCM",
    content:
      "Quảng Cáo Thanh Quang được thành lập từ năm 2006, chuyên cung cấp dịch vụ thiết kế thi công quảng cáo chuyên nghiệp tại TP.HCM. Với đội ngũ thiết kế nhiều kinh nghiệm, máy móc hiện đại và đầy đủ trang thiết bị, chúng tôi tự tin mang lại những bảng hiệu, chữ nổi, hộp đèn, led...nổi bật nhất tại Tp.HCM và các tỉnh lân cận.",
    ads1: "✔️ Chất lượng",
    ads2: "✔️ Giá cả cạnh tranh",
    ads3: "✔️ TỐC ĐỘ của dịch vụ nhanh",
    ads4: "✔️ Chuyên xử lý đơn hàng gấp - Có trong ngày.",
    number: "GỌI: 0987 291 009",
  };

  const dispatch = useDispatch();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    setLoading(true);
    try {
      const data = await userApi.get();
      data.user.phone_number = "0" + data.user.phone_number.substring(3);
      setProfile(data.user);
      setChangeName(data.user.full_name);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  function onLogout() {
    Alert.alert(
      "Đăng xuất",
      "Bạn muốn đăng xuất?",
      [
        {
          text: "Đóng",
        },
        {
          text: "Đăng xuất",
          onPress: () => {
            navigation.replace("Login");
            dispatch(actions.auth.logout());
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  async function editName() {
    if (isEdit == false) {
      setEdit(true);
    } else {
      setLoading(true);
      setEdit(false);
      try {
        const param = {
          full_name: onChangeName,
          thumb_image_attributes: profile.thumb_image,
        };
        const data = await userApi.update(param);
        data.user.phone_number = "0" + data.user.phone_number.substring(3);
        setProfile(data.user);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error);
      }
    }
  }

  function editAvatar() {
    Alert.alert(
      "Lựa chọn",
      "Bạn muốn chọn từ thư viện ảnh hay camera?",
      [
        {
          text: "Thư viện ảnh",
          onPress: async () => {
            let result: any = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 4],
              quality: 1,
            });

            updateAvatar(result.uri);
            if (!result.cancelled) {
              return;
            }
          },
        },
        {
          text: "Camera",
          onPress: async () => {
            let result: any = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 4],
              quality: 1,
            });

            updateAvatar(result.uri);
            if (result.cancelled) {
              return;
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  async function updateAvatar(uri: any) {
    setLoading(true);
    try {
      const data: any = await FileSystem.uploadAsync(
        "http://image-service.patitek.com/api/v1/images/upload",
        uri,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "files[]",
        }
      );
      const param = {
        full_name: onChangeName,
        thumb_image_attributes: {
          url: JSON.parse(data.body).data[0],
        },
      };
      await userApi.update(param);
      getProfile();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  function changePassword() {
    navigation.navigate("ChangePassword");
  }

  const copyToClipboard = (string: string) => {
    Clipboard.setString(string);
    toast.success("Đã sao chép '" + string + "' vào bộ nhớ tạm!");
  };

  return (
    <ScrollView
      style={[style.container, { backgroundColor: "#fff", paddingTop: 30 }]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <Loader loading={loading} />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => editAvatar()}>
          <Image
            source={{
              uri:
                profile.thumb_image == null
                  ? "https://scontent-sin6-4.xx.fbcdn.net/v/t1.6435-9/86191096_1034066846965323_7356023782445678592_n.jpg?_nc_cat=103&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=F5ufBlzUW4QAX9ZlfpD&_nc_ht=scontent-sin6-4.xx&oh=0fc44fbb3cc85881a4fbc7c296e7424c&oe=61420380"
                  : profile.thumb_image.url,
            }}
            style={styles.image}
          />
        </TouchableOpacity>
        <View>
          <View style={styles.dSB}>
            <TextInput
              onChangeText={setChangeName}
              editable={isEdit}
              style={
                isEdit == true
                  ? [
                      styles.title,
                      {
                        borderWidth: 1,
                        borderColor: "#209539",
                        padding: 5,
                        borderRadius: 8,
                      },
                    ]
                  : [styles.title, { padding: 5 }]
              }
            >
              {profile.full_name}
            </TextInput>
            {isEdit == false ? (
              <TouchableOpacity onPress={() => editName()}>
                <AntDesign
                  name="edit"
                  size={22}
                  color="#929292"
                  style={{ marginTop: 8 }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => editName()}>
                <AntDesign
                  name="check"
                  size={22}
                  color="#929292"
                  style={{ marginTop: 8 }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.dFlex}>
            <AntDesign
              name="mail"
              size={17}
              color="#929292"
              style={{ marginRight: 4 }}
            />
            <Text>{profile.email}</Text>
          </View>
          <View style={styles.dFlex}>
            <AntDesign
              name="phone"
              size={17}
              color="#929292"
              style={{ marginRight: 4 }}
            />
            <Text>{profile.phone_number}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity onPress={() => changePassword()}>
              <Text style={styles.auth}>Đổi mật khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onLogout()}>
              <Text style={styles.auth}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "column" }}>
        <Text style={styles.secondTitle}>{textDetail.title}</Text>
        <Text style={styles.secondText}>{textDetail.content}</Text>
        <Text style={styles.bottomTitle}>{textDetail.ads1}</Text>
        <Text style={styles.bottomTitle}>{textDetail.ads2}</Text>
        <Text style={styles.bottomTitle}>{textDetail.ads3}</Text>
        <Text style={styles.bottomTitleBold}>{textDetail.ads4}</Text>
      </View>
      <TouchableOpacity onPress={() => copyToClipboard("0987 291 009")}>
        <Text style={styles.bottomEnd}>{textDetail.number}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dSB: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  dFlex: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  image: {
    borderRadius: 150,
    width: 120,
    height: 120,
    marginRight: 10,
  },
  auth: {
    marginTop: 10,
    fontSize: 14,
    color: "#929292",
  },
  secondTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    color: "#979797",
  },
  secondText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#979797",
  },
  bottomTitle: {
    marginTop: 15,
    fontSize: 18,
    marginLeft: 25,
  },
  bottomTitleBold: {
    marginTop: 15,
    fontSize: 18,
    marginLeft: 25,
    fontWeight: "bold",
  },
  bottomEnd: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    paddingBottom: 20,
    color: "#FF0000",
  },
  centeredView: {
    justifyContent: "center",
    marginTop: 200,
    width: "55%",
    borderRadius: 20,
    marginLeft: "25%",
  },
  modalView: {
    paddingTop: 35,
    paddingBottom: 35,
    backgroundColor: "#979797",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
