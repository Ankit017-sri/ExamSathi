import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
import * as SplashScreen from "expo-splash-screen";

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

  const restoreToken = async () => {
    const storedTokens = await authStorage.getToken();
    setToken(storedTokens.accessToken);
  };

  const restoreUser = async () => {
    const data = await cache.get("user");
    setName(data?.fullName);
    setPhone(data?.phoneNumber);
  };

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

    prepare();
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
