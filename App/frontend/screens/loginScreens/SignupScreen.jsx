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

import { COMETCHAT_CONSTANTS } from "../../support/privateKey";
// import Home from './src/Home';

const SignupScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [names, setNames] = React.useState("");
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

  const sign_up = () => {
    console.log("PRINT----");
    let authKey = COMETCHAT_CONSTANTS.AUTH_KEY;
    let uid = names;
    let name = names;

    let user = new CometChat.User(uid);

    user.setName(name);

    CometChat.createUser(user, authKey).then(
      (user) => {
        console.log("user created", user);
        navigation.navigate("Login");
      },
      (error) => {
        console.log("error", error);
      }
    );
  };

  if (isLoggedIn) return navigation.navigate("TabBar");

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
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <View
          style={{
            padding: 25,
            marginTop: 35,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Sign Up</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNames}
            value={names}
            placeholder="Enter your name"
          />
          <TouchableOpacity
            onPress={() => {
              sign_up();
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
          {/* <Button  title="Sign Up" onPress={sign_up} /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "90%",
  },
});
