import React, { useEffect, useState } from "react";
import { Text, View, Input } from "../../components";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../types";
import { style } from "../../components";
import { size } from "../../constants";
import useConfirmExitApp from "../../hooks/useConfirmExitApp";
import { authApi } from "../../api";
import { ILogin } from "../../api/apiInterfaces";
import Loader from "../../components/Loader";
import toast from "../../helpers/toast";
import { validation } from "../../configs/validationInput";
import * as yup from "yup";
import { Formik } from "formik";
import { defaultStyles } from "../../components/Input/default";
import { useAppDispatch } from "../../hooks/useRedux";
import { actions } from "../../redux";

export default function LoginScreen({
  navigation,
}: StackScreenProps<StackParamList, "Login">) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [nameEye, setNameEye]: any = useState("eye-off-sharp");
  const [securePassword, setsecurePassword] = useState(true);
  useConfirmExitApp();

  useEffect(() => {
    dispatch(actions.auth.logout());
  }, []);

  async function onLogin(params: ILogin) {
    setLoading(true);
    try {
      const data = await authApi.login({
        email: params.email,
        password: params.password,
      });
      dispatch(actions.auth.login(data.data.token));
      setLoading(false);
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }

  function goTo(screen: any) {
    navigation.navigate(screen);
  }

  function toggleClickEye() {
    securePassword ? setsecurePassword(false) : setsecurePassword(true);
    nameEye == "eye" ? setNameEye("eye-off-sharp") : setNameEye("eye");
  }

  const initialValues = {
    email: "",
    password: "",
  };

  const title = {
    email: "Email",
    password: "Mật khẩu",
  };

  const validationSchema = yup.object().shape({
    email: validation.string(title.email),
    password: validation.string(title.password),
  });

  return (
    <View style={style.container}>
      <Loader loading={loading} />
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.welcome}>
            <Text style={styles.title}>Xin chào!</Text>
            <Text style={{ color: "#979797" }}>Đăng nhập để tiếp tục</Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onLogin}
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
                  <View style={{ marginBottom: 16 }}>
                    <View style={styles.row}>
                      <Feather name="phone" style={styles.icon} />
                      <Input.Text
                        value={values.email}
                        onChangeText={handleChange("email")}
                        style={style.input}
                        onBlur={handleBlur("email")}
                        touched={touched.email}
                        errors={errors.email}
                        title={title.email}
                      />
                    </View>
                    {errors.email && touched.email && (
                      <Text style={[defaultStyles.error, styles.errors]}>
                        {errors.email}
                      </Text>
                    )}
                  </View>

                  <View style={{ marginBottom: 16 }}>
                    <View style={styles.row}>
                      <Ionicons
                        name="md-lock-closed-outline"
                        style={styles.icon}
                      />
                      <Input.Text
                        value={values.password}
                        onChangeText={handleChange("password")}
                        style={style.input}
                        onBlur={handleBlur("password")}
                        touched={touched.password}
                        errors={errors.password}
                        title={title.password}
                        secureTextEntry={securePassword}
                      />
                      <Ionicons
                        name={nameEye}
                        style={[styles.icon, styles.iconEye]}
                        onPress={toggleClickEye}
                      />
                    </View>
                    {errors.password && touched.password && (
                      <Text style={[defaultStyles.error, styles.errors]}>
                        {errors.password}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={!isValid}
                  >
                    <Text
                      style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}
                    >
                      {" "}
                      Đăng nhập
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          </Formik>
          <View style={styles.footer}>
            <View style={styles.dJC}>
              <Text style={{ color: "#979797" }}>Chưa có tài khoản?</Text>
              <Pressable onPress={() => goTo("Signup")}>
                <Text
                  style={[styles.forgot, { marginLeft: 4, fontWeight: "700" }]}
                >
                  Đăng ký ngay
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  welcome: {
    height: size.window.height * 0.4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
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
    borderColor: "#D4D4D4",
    position: "relative",
  },
  errors: {
    marginTop: 8,
    marginLeft: 6,
  },
  iconEye: {
    position: "absolute",
    right: 10,
    color: "#cecece",
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
    marginTop: 90,
    textAlign: "center",
    marginBottom: 20,
  },
});
