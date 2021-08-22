import React from "react";
import { StyleSheet } from "react-native";
import Toast, { BaseToast } from "react-native-toast-message";
import { defaultColor } from "./../constants";

const defaultError = "Có lỗi xảy ra, vui lòng thử lại sau!";

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 0,
    height: 70,
    paddingVertical: 20,
    paddingHorizontal: 10,
    margin: 0,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
  },
  icon: {
    display: "none",
  },
});

export const toastConfig = {
  success: ({ text1, ...rest }: any) => (
    <BaseToast
      {...rest}
      style={{ ...styles.container, backgroundColor: defaultColor.success }}
      text2Style={styles.text}
      text2NumberOfLines={3}
      trailingIconContainerStyle={styles.icon}
    />
  ),
  error: ({ text1, ...rest }: any) => (
    <BaseToast
      {...rest}
      style={{ ...styles.container, backgroundColor: defaultColor.error }}
      text2Style={styles.text}
      text2NumberOfLines={3}
      trailingIconContainerStyle={styles.icon}
    />
  ),
  info: ({ text1, ...rest }: any) => (
    <BaseToast
      {...rest}
      style={{ ...styles.container, backgroundColor: defaultColor.warning }}
      text2Style={{ ...styles.text, color: "#000" }}
      text2NumberOfLines={3}
      trailingIconContainerStyle={styles.icon}
    />
  ),
};

export default {
  success: (text: string, time?: number) => {
    Toast.show({
      type: "success",
      position: "top",
      visibilityTime: time || 1200,
      text2: typeof text === "string" ? text : "",
    });
  },

  error: (text: string = "", time?: number) => {
    Toast.show({
      type: "error",
      position: "top",
      visibilityTime: time || 1200,
      text2: typeof text === "string" && text ? text : defaultError,
    });
  },

  warning: (text: string = "", time?: number) => {
    Toast.show({
      type: "info",
      position: "top",
      visibilityTime: time || 1200,
      text2: typeof text === "string" ? text : "",
    });
  },
};
