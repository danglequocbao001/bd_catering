import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { BackHandler } from "react-native";

export default function useBackButtonHook(onBackPress?: Function, disableDefaultBack = true) {
  useFocusEffect(
    React.useCallback(() => {
      const _onBackPress = () => {
        onBackPress && onBackPress()
        return disableDefaultBack
      };

      BackHandler.addEventListener('hardwareBackPress', _onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', _onBackPress);
    }, [])
  );
}