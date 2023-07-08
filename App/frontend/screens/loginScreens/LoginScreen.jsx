/* eslint-disable */
/* eslint-disable */

import React, { useState } from "react";
import {
  Button,
  Text,
  View,
  StatusBar,
  ScrollView,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CometChat } from "@cometchat-pro/react-native-chat";

import { COMETCHAT_CONSTANTS } from "../../utilities/privateKey";
// import Home from './src/Home';

const LoginScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [name, setName] = React.useState("");
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

  const login = (navigation) => {
    console.log("test123");
    var UID = name;
    var authKey = COMETCHAT_CONSTANTS.AUTH_KEY;

    console.log(authKey);

    CometChat.getLoggedinUser().then(
      (user) => {
        console.log("user---", user);
        if (!user) {
          CometChat.login(UID, authKey).then(
            (user) => {
              console.log("Login Successful:", { user });
              setUser(user);
              setIsLoggedIn(true);
            },
            (error) => {
              Alert.alert(error.message);
              console.log("Login failed with exception:", { error });
            }
          );
        } else {
          console.log("Already logged in.", { user });
          setUser(user);
          setIsLoggedIn(true);
        }
      },
      (error) => {
        console.log("Something went wrong", error);
      }
    );
  };

  if (isLoggedIn) return navigation.replace("TabBar");

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <View
        style={{
          padding: 25,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Login</Text>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Enter your name"
        />

        <TouchableOpacity
          onPress={() => {
            login();
          }}
          style={{
            width: "90%",
            height: 45,
            borderRadius: 10,
            backgroundColor: "blue",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
          style={{
            width: "90%",
            height: 45,
            borderRadius: 10,
            backgroundColor: "blue",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "90%",
  },
});
