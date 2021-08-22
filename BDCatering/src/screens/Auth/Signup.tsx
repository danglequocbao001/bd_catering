import React, { useEffect, useState } from "react";
import { Text, View, Input } from "../../components";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types";
import { style } from "../../components";
import { size } from "../../constants";
import { validation } from "../../configs/validationInput";
import { ISignUp } from "../../api/apiInterfaces";
import { authApi } from "../../api";
import { storage } from "../../helpers";
import { useAppDispatch } from "../../hooks/useRedux";
import { actions } from "../../redux";
import toast from "../../helpers/toast";
import { defaultStyles } from "../../components/Input/default";
import Loader from "../../components/Loader";

export default function SignupScreen({
  navigation,
  route,
}: StackScreenProps<AuthStackParamList, "Signup">) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [nameEye, setNameEye]: any =  useState('eye-off-sharp');
  const [securePassword, setsecurePassword] =  useState(true);
  useEffect(() => {});

  function goto(screen: any) {
    navigation.navigate(screen);
  }
  function toggleClickEye() {
    securePassword? setsecurePassword(false): setsecurePassword(true) 
    nameEye == 'eye'?  setNameEye('eye-off-sharp'): setNameEye('eye')
  }
  const initialValues = {
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  };

  const title = {
    full_name: "Họ và tên",
    phone_number: "Số điện thoại",
    email: "Email",
    password: "Mật khẩu",
    password_confirmation: "Nhập lại mật khẩu",
  };

  const validationSchema = yup.object().shape({
    full_name: validation.name(title.full_name),
    email: validation.email(title.email),
    phone_number: validation.phone(title.phone_number),
    password: validation.password(title.password),
    password_confirmation: validation.password(title.password_confirmation),
  });
  async function signUp(params: ISignUp) {
    params.phone_number = "+84" + params.phone_number.substring(1);
    try {
      setLoading(true);
      const data = await authApi.signUp(params);
      await storage.set("token", data.token);
      dispatch(actions.auth.login);
      goto("Root");
      setLoading(false);
      toast.success("Đăng ký thành công!");
      goto("Root");
    } catch (error) {
      toast.error(error);
      setLoading(false);
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
          <View style={styles.welcome}>
            <Text style={styles.title}>Bắt đầu nào!</Text>
            <Text style={{ color: "#979797" }}>Đăng nhập để tiếp tục</Text>
          </View>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={signUp}
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
                      <AntDesign name="user" style={styles.icon} />
                      <Input.Text
                        value={values.full_name}
                        onChangeText={handleChange("full_name")}
                        style={style.input}
                        onBlur={handleBlur("full_name")}
                        touched={touched.full_name}
                        errors={errors.full_name}
                        title={title.full_name}
                      />
                    </View>

                    {errors.full_name && touched.full_name && (
                      <Text style={[defaultStyles.error, styles.errors]}>
                        {errors.full_name}
                      </Text>
                    )}
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <View style={styles.row}>
                      <Feather name="phone" style={styles.icon} />
                      <Input.Text
                        value={values.phone_number}
                        onChangeText={handleChange("phone_number")}
                        style={style.input}
                        onBlur={handleBlur("phone_number")}
                        touched={touched.phone_number}
                        errors={errors.phone_number}
                        title={title.phone_number}
                      />
                    </View>
                    {errors.phone_number && touched.phone_number && (
                      <Text style={[defaultStyles.error, styles.errors]}>
                        {errors.phone_number}
                      </Text>
                    )}
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <View style={styles.row}>
                      <MaterialCommunityIcons
                        name="email-outline"
                        style={styles.icon}
                      />
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
                    <Ionicons name="md-lock-closed-outline" style= {styles.icon} />
                      <Input.Text
                        value={values.password}
                        onChangeText={handleChange("password")}
                        style={style.input}
                        onBlur={handleBlur("password")}
                        touched={touched.password}
                        errors={errors.password}
                        title={title.password}
                        secureTextEntry = {securePassword}

                      />
                        <Ionicons name = {nameEye} style ={[styles.icon, styles.iconEye]} onPress = {toggleClickEye} />
                    </View>
                    {errors.password && touched.password && (
                      <Text style={[defaultStyles.error, styles.errors]}>
                        {errors.password}
                      </Text>
                    )}
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <View style={styles.row}>
                    <Ionicons name="md-lock-closed-outline" style= {styles.icon} />
                      <Input.Text
                        value={values.password_confirmation}
                        onChangeText={handleChange("password_confirmation")}
                        style={style.input}
                        onBlur={handleBlur("password_confirmation")}
                        touched={touched.password_confirmation}
                        errors={errors.password_confirmation}
                        title={title.password_confirmation}
                      />
                    </View>
                    {errors.password_confirmation &&
                      touched.password_confirmation && (
                        <Text style={[defaultStyles.error, styles.errors]}>
                          {errors.password_confirmation}
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
                      Đăng ký
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          </Formik>
          <View style={styles.footer}>
            <View style={styles.dJC}>
              <Text style={{ color: "#979797" }}>Đã có tài khoản?</Text>
              <Pressable onPress={() => goto("Login")}>
                <Text style={[styles.forgot, { marginLeft: 4 }]}>
                  Đăng nhập ngay
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
    height: size.window.height * 0.25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  groupInfo: {
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  dJC: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#D4D4D4",
  },
  errors: {
    marginTop: 8,
    marginLeft: 6,
  },
  icon: {
    marginLeft: 6,
    color: "#979797",
    fontSize: 24,
  },
  iconEye: {
    position: 'absolute',
    right: 10,
    color: '#cecece'
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
    fontWeight: "700",
  },
  footer: {
    marginTop: 60,
    textAlign: "center",
    marginBottom: 20,
  },
});
