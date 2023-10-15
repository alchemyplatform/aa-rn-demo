import React, { useEffect } from "react";
import { LogBox, StatusBar, useColorScheme } from "react-native";
import "react-native-gesture-handler";
import BootSplash from "react-native-bootsplash";
/**
 * ? Local Imports
 */
import { AlertProvider } from "@context/alert";
import { Compose } from "@context/global";
import { WalletProvider } from "@context/wallet";
import { isAndroid } from "@freakycoder/react-native-helpers";
import { useMagicSigner } from "@hooks/useMagicSigner";
import Snackbar from "@shared-components/notification/SnackBar";
import { ThemeProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/navigation";

LogBox.ignoreAllLogs();

const App = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const { magic } = useMagicSigner();

  useEffect(() => {
    const init = async () => {
      StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
      if (isAndroid) {
        StatusBar.setBackgroundColor("rgba(0,0,0,0)");
        StatusBar.setTranslucent(true);
      }
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, [scheme, isDarkMode]);

  return (
    <Compose
      components={[
        SafeAreaProvider,
        AlertProvider,
        ThemeProvider,
        WalletProvider,
      ]}
    >
      <magic.Relayer />
      <Navigation />
      <Snackbar />
    </Compose>
  );
};

export default App;
