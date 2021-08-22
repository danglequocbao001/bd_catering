import React, { useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { StackParamList } from "../../../types";
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Loader from "../../../components/Loader";
import { Header, style } from "../../../components";
import { MaterialIcons } from "@expo/vector-icons";
import { size } from "../../../constants";
import { toast } from "../../../helpers";
import { authApi } from "../../../api";

export default function VerificationCodeScreen({
  navigation,
}: StackScreenProps<StackParamList, "VerificationCode">) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const CELL_COUNT = 6;
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  async function handleSubmit() {
    setLoading(true);
    try {
    
      value.length < 6? toast.warning('Bạn vui lòng điền đủ mã code'): null
      const data = await authApi.verifyCode({code: value});
      navigation.navigate("NewPassword", { token: data.token});
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }
  return (
    <View style={style.container}>
      <Loader loading={loading} />
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Header title="QUÊN MẬT KHẨU" hasBack color="#00244E" />
          <View style={[styles.groupIcon, styles.dJC]}>
            <MaterialIcons name="lock" size={44} color="#209539" />
          </View>
          <Text style={{ textAlign: "center" }}>
                    Nhập mã xác minh được gửi tới Email của bạn:
                  </Text>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
            <View style={styles.footer}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 17,
                            fontWeight: "700",
                          }}
                        >
                          Tiếp tục
                        </Text>
                      </TouchableOpacity>
                      <Text style={{ textAlign: "center", marginTop: 10 }}>
                      Gửi lại mã sau (7s)
                    </Text>
                    </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  groupIcon: {
    height: size.window.height * 0.35,
  },
  footer: {
    textAlign: "center",
    marginBottom: 20,
    marginTop: 90
  },
  dJC: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#209539",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: 57,
  },
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 44,
    height: 40,
    lineHeight: 38,
    borderRadius: 10,  
    fontSize: 20,
    borderWidth: 1,
    color: '#666666',
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#209539",
  },
});
