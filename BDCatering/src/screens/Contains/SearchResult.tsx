import React, { useEffect, useState } from "react";
import { Header, Text } from "../../components";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { Platform, NativeModules } from "react-native";
import { StackParamList } from "../../types";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { productApi } from "../../api";
import useConfirmExitApp from "../../hooks/useConfirmExitApp";
import Loader from "../../components/Loader";
import { toast } from "../../helpers";
const { StatusBarManager } = NativeModules;
const statusBar = Platform.OS === "ios" ? 30 : StatusBarManager.HEIGHT;
export default function HomeScreen({
  navigation,
  route,
}: StackScreenProps<StackParamList, "SearchResult">) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  // const param = route.params?.q
  const [lengthData, setLengthData] = useState(0);
  const search = useAppSelector((state) => state.search.query);
  const [request, setRequest] = useState({
    page: 1,
    per_page: 6,
    q: search,
  });

  useEffect(() => {
    onProducts();
  }, []);

  async function onProducts() {
    setLoading(true);
    try {
      const data = await productApi.get(request);
      setLengthData(data.meta.pagination.total_objects);

      setProducts(products.concat(data.products));
      //   setProducts(data.products);
      setLoading(false);
      //   if(data.products.length == 0) {
      //     setTimeout(() =>{
      //       dispatch(actions.search.update(""));
      //     }, 2000)
      //   }
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }
  function handleLoadMore() {
    setRequest({
      page: request.page++,
      per_page: 2,
      q: "",
    });
    if (lengthData > products.length) {
      onProducts();
    }
  }
  useConfirmExitApp();

  function renderItem({ item }: { item: any }) {
    return (
      <TouchableOpacity
        style={styles.box}
        key={item.id}
        onPress={() => navigation.navigate("Product", { item: item })}
      >
        <View style={styles.boxWrapp}>
          <Image
            source={{ uri: item.thumb_image.url }}
            style={styles.imageSlide}
          />
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.type} numberOfLines={2}>
            {item.description == "" ? "Chưa có mô tả" : item.description}
          </Text>
          <View style={styles.wrapPrice}>
            <View style={styles.cricle}>
              <Entypo name="credit" size={13} color="#209539" />
            </View>
            <Text style={styles.price}>{item.price_range}</Text>
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
      <Header title="" hasBack />

      <SafeAreaView>
        {products && (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={products}
            style={styles.row}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            //KHÔNG XÓA 2 DÒNG NÀY
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )}
      </SafeAreaView>
      {products.length == 0 && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "column",

          }}
        >
          <MaterialCommunityIcons
            name="information"
            size={150}
            color={"#e6e6e6"}
          />
          <Text style={{ fontSize: 18, marginTop: 30, color: "#6D6D6D", }}>Sản phẩm không tồn tại!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: statusBar,
    backgroundColor: "#fff",
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
    height: 40,
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
    height: 40,
    color: "rgba(128, 128, 128, 0.87)",
  },
  price: {
    color: "#209539",
    width: "90%",
    fontSize: 13,
  },
});
