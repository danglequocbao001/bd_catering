import React, { useEffect, useState } from "react";
import { Text, View, Header, Input } from "../../../components";
import { MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../../types";
import { style } from "../../../components";
import { size } from "../../../constants";
import useConfirmExitApp from "../../../hooks/useConfirmExitApp";
import Loader from "../../../components/Loader";
import toast from "../../../helpers/toast";
import { validation } from "../../../configs/validationInput";
import * as yup from "yup";
import { Formik } from "formik";
import { defaultStyles } from "../../../components/Input/default";
import { authApi } from "../../../api";

export default function NewPasswordScreen({
  navigation,
  route
}: StackScreenProps<StackParamList, "NewPassword">) {
  const [loading, setLoading] = useState(false);
  const dataParam = route.params.token
  useConfirmExitApp();

  async function submit(values: any) {
    setLoading(true);
    try {
     await authApi.setNewPassword({
        new_password: values.password,
        new_password_confirmation: values.password_confirmation
       }, dataParam);
       navigation.navigate("LayoutSuccess", { title: "Lấy lại mật khẩu thành công" });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }
  const initialValues = {
    password: "",
    password_confirmation: "",
  };

  const title = {
    password: "Mật khẩu",
    password_confirmation: "Nhập lại mật khẩu",
  };
  const validationSchema = yup.object().shape({
    password: validation.password(title.password),
    password_confirmation: validation.password_confirmation(
      title.password_confirmation
    ),
  });
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }: any) => {
              return (
                <View style={styles.groupInfo}>
                  <View style={{ marginBottom: 16, marginTop: 20 }}>
                    <Text>Nhập mật khẩu mới:</Text>

                    <View style={styles.row}>
                      <Input.Text
                        value={values.password}
                        onChangeText={handleChange("password")}
                        style={style.input}
                        onBlur={handleBlur("password")}
                        touched={touched.password}
                        errors={errors.password}
                      />
                    </View>
                    {errors.password && touched.password && (
                      <Text style={[defaultStyles.error, styles.errors]}>
                        {errors.password}
                      </Text>
                    )}
                    <Text>Nhập lại mật khẩu:</Text>

                    <View style={styles.row}>
                      <Input.Text
                        value={values.password_confirmation}
                        onChangeText={handleChange("password_confirmation")}
                        style={[style.input]}
                        onBlur={handleBlur("password_confirmation")}
                        touched={touched.password_confirmation}
                        errors={errors.password_confirmation}
                      />
                    </View>
                    {errors.password_confirmation &&
                      touched.password_confirmation && (
                        <Text style={[defaultStyles.error, styles.errors]}>
                          {errors.password_confirmation}
                        </Text>
                      )}
                  </View>
                  <View style={styles.footer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleSubmit}
                      disabled={!isValid}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 17,
                          fontWeight: "700",
                        }}
                      >
                        Xác nhận
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  groupIcon: {
    height: size.window.height * 0.27,
  },
  groupInfo: {
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    borderColor: "#D4D4D4",
  },
  errors: {
    marginBottom: 8,
  },
  icon: {
    marginLeft: 6,
    color: "#979797",
    fontSize: 24,
  },
  dJC: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 36,
    margin: 8,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 10,
    color: "rgba(0, 0, 0, 0.87)",
  },
  button: {
    backgroundColor: "#209539",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: 57,
  },
  forgot: {
    color: "#209539",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  footer: {
    textAlign: "center",
    marginBottom: 20,
    marginTop: 90,
  },
});
