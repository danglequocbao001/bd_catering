import * as React from "react";
import { Text, View, Header } from "../../components";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { style } from "../../components";
import { productApi, requestApi, searchApi } from "./../../api";
import { StyleSheet, TextInput, Pressable } from "react-native";
import toast from "../../helpers/toast";
import Loader from "../../components/Loader";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../types";
import { size } from "../../constants";
import { useRef } from "react";
import { useAppDispatch } from "../../hooks/useRedux";
import { actions } from "../../redux";

export default function Search({
  navigation,
  route,
}: StackScreenProps<StackParamList, "Search">) {
  const dispatch = useAppDispatch();

  const [text, onChangeText] = React.useState("");
  const [textInput, setValueText] = React.useState("");
  const [textPhone, setValuePhone] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [names, setNames] = useState([]);
  const [len, setLen] = useState(false);
  const [onFocus, setFocus] = useState(false);

  const [request, setRequest] = useState({
    page: 1,
    per_page: 1000,
    q: "",
  });
  const typingTimeoutRef: any = useRef(null);
  useEffect(() => {
    getSearch();
  }, []);
  async function getSearch() {
    setLoading(true);
    try {
      const data = await searchApi.get();
      const results = await productApi.get(request);
      setProducts(
        results.products.map((element: any) => {
          return element.name;
        })
      );
      setNames(data.recent_search.keywords);
      data.recent_search.keywords.length > 0 ? setLen(true) : setLen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }
  async function deleteSearch() {
    setLoading(true);
    try {
      await searchApi.delete();
      getSearch();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }
  async function Submit() {
    setLoading(true);
    const param = {
      request: {
        content: textInput,
        phone_number: "+84" + textPhone.substring(1),
      },
    };
    try {
      await requestApi.create(param);
      toast.success("Gửi yêu cầu thành công!");
      setValueText("");
      setValuePhone("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  const Search = (text: string) => {
    onChangeText(text);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      if (text) {
        const newData = products.filter(function (item: any) {
          const itemData = item ? item.toUpperCase() : "".toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        const params = {
          recent_search: {
            keyword: text,
          },
        };
       
        if (newData.length == 0) {
          toast.warning("Không tìm thấy sản phẩm", 300);
        } else {
          setNames(newData);
         
          setLen(true)
        }
        try {
          await searchApi.add(params);
        } catch (error) {
          throw error;
        }
      } else {
        getSearch()
      }
    }, 500);
  };
  function goHome(item: any) {
    dispatch(actions.search.update(item));
    navigation.replace("SearchResult");
  }
  function renderItemSearch({ item }: { item: any }) {
    return (
      <Pressable onPress={() => goHome(item)} style={styles.wrapSearch}>
        <Text style={styles.itemSearch}> {item} </Text>
        <Ionicons name="md-reload-outline" size={24} color="#1A73E9" />
      </Pressable>
    );
  }
  function renderItem({ item }: { item: any }) {
    return (
      <Pressable onPress={() => goHome(item)} style={styles.wrapSearch}>
        <Text style={styles.itemSearch}> {item} </Text>
        <Ionicons name="md-reload-outline" size={24} color="#1A73E9" />
      </Pressable>
    );
  }
  return (
    <View style={style.container}>
      <Loader loading={loading} />
      <Header title="" hasBack />
      <TextInput
        style={styles.inputSearch}
        placeholder="Bạn đang tìm kiếm gì ?"
        onFocus={() => setFocus(true)}
        onBlur={() =>  setFocus(false)} 
        onChangeText={(text) => {
          Search(text);
        }}
        value={text}
      />
      {len && (
        <View style={styles.dJC}>
          <Text style={styles.nearHere}>Gần đây</Text>
          <Text style={styles.clear} onPress={deleteSearch}>
            XÓA
          </Text>
        </View>
      )}
      {len && (
        <FlatList
          data={names}
          renderItem={renderItem}
          keyExtractor={(item, index) => item + index}
        />
       )}  

      {!len && !onFocus && (
        <View>
          <Text style={{ fontSize: 18 }}>Không có sản phẩm tìm gần đây</Text>
        </View>
      )}
     {!onFocus &&  <View>
        <Text style={styles.require}>Không tìm ra sản phẩm?</Text>
        <Text style={styles.require}>Để lại yêu cầu:</Text>
        <TextInput
          onChangeText={setValueText}
          value={textInput}
          placeholder="Yêu cầu"
          style={[styles.input, styles.inputText]}
        />

        <TextInput
          onChangeText={setValuePhone}
          value={textPhone}
          placeholder="SDT"
          style={styles.input}
        />

        <Pressable style={styles.btnSubmit} onPress={() => Submit()}>
          <Text style={styles.btnSend}> GỬI</Text>
        </Pressable>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  dJC: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Flatlist: {
    height: size.window.height * 0.2,
  },
  inputSearch: {
    height: 40,
    borderRadius: 20,
    marginBottom: 16,
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    textAlign: "center",
    color: "#c8c8c8",
    fontSize: 16,
    borderColor: "#e7e7e7",
  },

  wrapSearch: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  itemSearch: {
    paddingTop: 10,
    color: "#212121",
  },

  titleSearch: {},
  nearHere: {
    fontSize: 20,
    fontWeight: "500",
    color: "#212121",
  },
  require: {
    fontSize: 18,
    marginTop: 8,
    color: "#212121",
    fontWeight: "600",
  },
  clear: {
    fontSize: 14,
    fontWeight: "500",
    color: "#a9a9a9",
  },
  input: {
    borderRadius: 6,
    borderWidth: 1,
    height: 50,
    borderColor: "#c3c3c3",
    color: "#212121",
    paddingLeft: 10,
    marginBottom: 20,
  },
  inputText: {
    height: 100,
    marginTop: 6,
  },
  inputPhone: {
    height: 50,
    flex: 1,
  },
  groupSendRequire: {
    flexDirection: "row",
  },
  btnSubmit: {
    backgroundColor: "#209539",
    width: "70%",
    height: 50,
    borderRadius: 6,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  btnSend: {
    color: "#fff",
  },
});
