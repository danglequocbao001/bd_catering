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
import { storage } from "../../../helpers";
import Loader from "../../../components/Loader";
import toast from "../../../helpers/toast";
import { validation } from "../../../configs/validationInput";
import * as yup from "yup";
import { Formik } from "formik";
import { defaultStyles } from "../../../components/Input/default";
import { authApi } from "../../../api";
import { ILogin, ISignUp } from "../../../api/apiInterfaces";

export default function EmailScreen({
  navigation,
}: StackScreenProps<StackParamList, "Email">) {
  const [loading, setLoading] = useState(false);
  useConfirmExitApp();
  useEffect(() => {});

  async function getCode(values: any) {
    setLoading(true);
    try {
      await authApi.sendVerifyMail({email: values.email});
      goto("VerificationCode");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  }
  function goto(screen: any) {
    navigation.navigate(screen);
  }
  const initialValues = {
    email: "",
  };

  const title = {
    email: "example@gmail.com",
  };
  const validationSchema = yup.object().shape({
    email: validation.email("Email"),
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
            <MaterialIcons name="mark-email-unread" size={46} color="#209539" />
          </View>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={getCode}
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
                  <Text style={{ textAlign: "center" }}>
                    Mã xác minh sẽ được gửi tới Email:
                  </Text>

                  <View style={{ marginBottom: 16, marginTop: 20 }}>
                    <View style={styles.row}>
                      <Input.Text
                        value={values.email}
                        onChangeText={handleChange("email") }
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
    height: size.window.height * 0.35,
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
