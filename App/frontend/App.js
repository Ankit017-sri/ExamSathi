import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import { Linking, Platform } from "react-native";
import * as Application from "expo-application";
import checkVersion from "react-native-store-version";

import { Alert } from "react-native";

import { AppNavigator } from "./navigation/AppNavigator";
import Login from "./screens/Login";
import authStorage from "./auth/storage";
import cache from "./utilities/cache";
import AuthContext from "./auth/context";

enableScreens();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tabBarVisible, setTabBarVisible] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const restoreToken = async () => {
    const storedTokens = await authStorage.getToken();
    setToken(storedTokens.accessToken);
  };

  const restoreUser = async () => {
    const data = await cache.get("user");
    setName(data?.fullName);
    setPhone(data?.phoneNumber);
  };

  const checkForUpdates = async () => {
    const currentVersion = Application.nativeApplicationVersion;
    console.log(currentVersion);
    const storeUrl =
      Platform.OS === "android"
        ? `https://play.google.com/store/apps/details?id=com.examSathi.examSathi`
        : `https://itunes.apple.com/lookup?bundleId=com.examSathi.examSathi`;

    try {
      const check = await checkVersion({
        version: currentVersion, // app local version
        iosStoreURL: storeUrl,
        androidStoreURL: storeUrl,
        country: "in", // default value is 'jp'
      });

      if (check.result === "new") {
        Alert.alert("Update Available", "please update to latest version ", [
          {
            text: "update",
            onPress: () => {
              Linking.openURL(storeUrl);
            },
          },
        ]);
      }
      console.log(check);
    } catch (e) {
      console.log(e);
    }
  };

  const checkForOTAUpdates = async () => {
    if (!__DEV__) {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // Wait for the new update to be downloaded and applied
        await Updates.reloadAsync();
      }
    }
  };

  useEffect(() => {
    checkForUpdates();
    checkForOTAUpdates();
  });
  useEffect(() => {
    async function prepare() {
      try {
        await restoreToken();
        await restoreUser();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsReady(true);
      }
    }
    if (!updateAvailable) {
      prepare();
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `isReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        setToken,
        token,
        name,
        phone,
        setPhone,
        setName,
        tabBarVisible,
        setTabBarVisible,
      }}
    >
      <NavigationContainer>
        {token ? <AppNavigator onLayout={onLayoutRootView} /> : <Login />}
      </NavigationContainer>
      <StatusBar animated style="dark" />
    </AuthContext.Provider>
  );
}
