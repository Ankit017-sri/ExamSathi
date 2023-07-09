import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
// import {StatusBar} from 'expo-status-bar';
import { useCallback, useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
// import {initializeApp} from '@react-native-firebase/app';

// import * as SplashScreen from 'expo-splash-screen';
// import * as Updates from 'expo-updates';
import { Linking, Platform, StatusBar} from "react-native";
// import * as Application from 'expo-application';
import checkVersion from "react-native-store-version";

import { Alert } from "react-native";

import { AppNavigator } from "./navigation/AppNavigator";
import Login from "./screens/Login";
import authStorage from "./auth/storage";
import cache from "./utilities/cache";
import AuthContext from "./auth/context";
import Auth from "./navigation/newAuthNavigation/authNavigation";
import TabBar from "./navigation/newBottomTabBar/tabBar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COMETCHAT_CONSTANTS } from "./utilities/privateKey";
import { CometChat } from "@cometchat-pro/react-native-chat";

// import React from "react";
// import { Button, SafeAreaView } from "react-native";
// import { Mixpanel } from "mixpanel-react-native";

// const trackAutomaticEvents = true;
// const mixpanel = new Mixpanel(
//   "f601299fc807c669258f66d0997f015e",
//   trackAutomaticEvents
// );
// mixpanel.init();

// const SampleApp = () => {
//   return (
//     <SafeAreaView>
//       <Button
//         title="Select Premium Plan"
//         onPress={() =>
//           mixpanel.track("Signed Up", { "Signup Type": "Referral" })
//         }
//       />
//     </SafeAreaView>
//   );
// };

enableScreens();
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import InputComponent from "./components/InputComponent";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState();
  const [Id, setId] = useState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tabBarVisible, setTabBarVisible] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();

      if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        console.log("User has authorized notification permissions");
      } else if (authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
        console.log("User has provisional notification permissions");
      }
    };

    requestUserPermission();

    const getToken = async () => {
      const token = await messaging().getToken();
      console.log("Device Token:", token);
    };

    getToken();
  }, []);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });
    messaging().onMessage(async (remoteMessage) => {
      PushNotification.createChannel(
        {
          channelId: "123456", // Choose any channel ID
          channelName: "My Channel", // Choose any channel name
        },
        () => {}
      );
      let notificationObj = {
        channelId: "123456",
        title: remoteMessage?.notification?.title,
        message: remoteMessage?.notification?.body,
      };
      console.log("object", notificationObj);
      PushNotification.localNotification(notificationObj);
      console.log("Message handled now!", remoteMessage);
    });
  }, []);

  const restoreToken = async () => {
    const storedTokens = await authStorage.getToken();
    setToken(storedTokens?.accessToken);
  };

  const restoreUser = async () => {
    const data = await cache.get("user");
    setId(data?._id);
    setName(data?.fullName);
    setPhone(data?.phoneNumber);
  };

  let appID = COMETCHAT_CONSTANTS.APP_ID;
  let region = COMETCHAT_CONSTANTS.REGION;
  let appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .autoEstablishSocketConnection(true)
    .build();
  CometChat.init(appID, appSetting).then(
    () => {
      console.log("Initialization completed successfully");
    },
    (error) => {
      Alert.alert(error.message);
      console.log("Initialization failed with error:", error);
    }
  );

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
    console.log("name===>", name);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `isReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      // await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  console.log(token);
  const Stack = createNativeStackNavigator();

  return (
    <AuthContext.Provider
      value={{
        setToken,
        token,
        Id,
        setId,
        name,
        phone,
        setPhone,
        setName,
        tabBarVisible,
        setTabBarVisible,
      }}
    >
      <InputComponent />
      {token ? (
        <Auth />
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
              component={Login}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      <StatusBar animated barStyle="light-content" />
    </AuthContext.Provider>
  );
}
