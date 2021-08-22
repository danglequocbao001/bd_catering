import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { Alert, BackHandler } from 'react-native';

export default function useConfirmExitApp() {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Xác nhận thoát ứng dụng?",
          '',
          [
            {
              text: "Có",
              onPress: () => BackHandler.exitApp(),
              style: 'cancel'
            },
            { text: "Không" }
          ],
          {
            cancelable: true
          }
        );
        return true
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
}
