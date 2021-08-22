import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./src/hooks/useCachedResources";
import useColorScheme from "./src/hooks/useColorScheme";
import Navigation from "./src/navigation";
import store from "./src/store";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import { toastConfig } from './src/helpers/toast'

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
