import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
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

  const checkForUpdates = () => {
    Updates.checkForUpdateAsync()
      .then((update) => {
        console.log("checking....");
        if (update.isAvailable) {
          setUpdateAvailable(true);
          Alert.alert(
            "Update Available",
            "please press ok to update to latest version ",
            [
              {
                text: "OK",
                onPress: () =>
                  Updates.fetchUpdateAsync()
                    .then(() => {
                      Updates.reloadAsync();
                      setUpdateAvailable(false);
                    })
                    .catch((err) => console.log(err)),
              },
            ]
          );
        }
      })
      .catch((error) => {
        console.log("An error occurred: ", error);
      });
  };
  useEffect(() => {
    checkForUpdates();
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
