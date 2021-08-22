import React, { useEffect, useState } from "react";
import { Text, View } from "../../../components";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { defaultColor } from "../../../constants";
import { StackParamList } from "../../../types";
import { cartApi, homePageApi } from "../../../api";
import {
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import useConfirmExitApp from "../../../hooks/useConfirmExitApp";
import { Platform, NativeModules } from "react-native";
import Loader from "../../../components/Loader";
import { toast } from "../../../helpers";
import { actions } from "../../../redux";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
const { StatusBarManager } = NativeModules;
const statusBar = Platform.OS === "ios" ? 30 : StatusBarManager.HEIGHT;

export default function HomeScreen({
  navigation,
}: StackScreenProps<StackParamList, "Root">) {
  const [loading, setLoading] = useState(false);
  var [products, setProducts]: any = useState([]);
  const [cartAmount, setCartAmount] = useState(0);
  const dispatch = useDispatch();

  useConfirmExitApp();

  useEffect(() => {
    onProducts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      onCartAmount();
    }, [])
  );

  async function onProducts() {
    handleSetRequest().then(async (request) => {
      setLoading(true);
      try {
        const data = await homePageApi.getAll(request.date, request.limit);
        setProducts(products.concat(data.data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error);
        onExpired(error);
      }
    });
  }

  async function handleSetRequest() {
    const request = {
      date: products.length == 0 ? 0 : products[products.length - 1].createdAt,
      limit: 10,
    };
    return request;
  }

  function handleLoadMore() {
    onProducts();
  }

  const onCartAmount = async () => {
    try {
      const data = await cartApi.getCount();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  function onExpired(error: any) {
    if (error == undefined) {
      Alert.alert("Thông báo", "Phiên đã hết hạn, vui lòng đăng nhập lại!", [
        {
          text: "Đồng ý",
          onPress: () => {
            navigation.replace("Login");
            dispatch(actions.auth.logout());
          },
        },
      ]);
    }
  }

  function renderItem({ item }: { item: any }) {
    return (
      <TouchableOpacity
        style={styles.box}
        key={item.foodId}
        onPress={() => navigation.navigate("Product", { item: item })}
      >
        <View style={styles.boxWrapp}>
          <Image
            source={{ uri: item.images[0].imageUrl }}
            style={styles.imageSlide}
          />
          <Text style={styles.title} numberOfLines={1}>
            {item.foodName}
          </Text>
          <Text style={styles.type} numberOfLines={2}>
            {item.description == "" ? "Chưa có mô tả" : item.description}
          </Text>
          <View style={styles.wrapPrice}>
            <View style={styles.cricle}>
              <Entypo name="credit" size={13} color="#209539" />
            </View>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function goTo(screen: any) {
    navigation.navigate(screen);
  }

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.groupIconHeader}>
        <TouchableOpacity style={styles.wrapIon} onPress={() => goTo("Search")}>
          <AntDesign name="search1" size={24} color={defaultColor.color.main} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.wrapIon} onPress={() => goTo("Cart")}>
          <MaterialCommunityIcons
            name="cart-minus"
            size={24}
            color={defaultColor.color.main}
          />
          {cartAmount > 0 ? (
            <View
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                backgroundColor: "red",
                right: -5,
                top: -5,
                borderRadius: 50,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                {cartAmount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
      <SafeAreaView>
        {products && (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={products}
            style={styles.row}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(index)}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )}
      </SafeAreaView>
      {products.length == 0 && (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>Sản phẩm không tồn tại</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBar,
    padding: 10,
  },
  groupIconHeader: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: "1.5%",
    paddingTop: 16,
    marginBottom: 10,
  },
  wrapIon: {
    borderRadius: 1000,
    padding: 12,
    shadowColor: "#828282",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    backgroundColor: "#fff",
    elevation: 3,
    marginRight: 14,
  },
  ionSearch: {
    marginRight: 10,
  },
  ionCart: {
    paddingRight: 6,
  },
  row: {
    marginBottom: 70,
  },
  boxWrapp: {
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    backgroundColor: "#fff",
    elevation: 2,
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  box: {
    width: "50%",
    paddingHorizontal: "1%",
  },

  imageSlide: {
    width: "100%",
    height: 116,
    borderRadius: 3,
  },
  title: {
    marginTop: 4,
    marginBottom: 4,
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 15,
  },
  wrapPrice: {
    flexDirection: "row",
  },
  cricle: {
    borderWidth: 1,
    marginRight: 2,
    borderColor: "#209539",
    borderRadius: 10000,
    width: 17,
    height: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  type: {
    color: "rgba(128, 128, 128, 0.87)",
    marginBottom: 5,
  },
  price: {
    color: "#209539",
    width: "90%",
    fontSize: 13,
  },
});
