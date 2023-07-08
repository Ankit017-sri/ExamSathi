/* eslint-disable */
import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  Text,
  View,
  Image,
  ImageBackground,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { CometChat } from "@cometchat-pro/react-native-chat";
import RecentQuizScreen from "../RecentQuiz";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import RevisionQuizScreen from "../RevisionQuizScreen";
import CustomHeader from "../../components/CustomHeader";

const Tab = createMaterialTopTabNavigator();
function Test({ navigation }) {
  const [isRivisionOpen, setIsRivisionOpen] = useState(true);
  const logout = (navigation) => {
    CometChat.logout().then(
      () => {
        console.log("Logout completed successfully");
        navigation.navigate("SignUp");
      },
      (error) => {
        console.log("Logout failed with exception:", { error });
      }
    );
  };
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
      <CustomHeader
        title="Exam Sathi"
        share
        navigation={navigation}
        bgColor={"#084347"}
        // sub={`${memCount} members, ${len} online`}
      />
      {/* top tabbar */}
      <View
        style={{
          backgroundColor: "#084347",
          // padding: 4,
          width: "100%",
          display: "flex",
          // paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setIsRivisionOpen(true);
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",

              padding: 12,
            }}
          >
            <Image source={require("../../assets/images/group.png")} />
            <Text style={{ color: "white", fontSize: 15, marginLeft: 6 }}>
              लाईव्ह रिविजन
            </Text>
          </View>
          {isRivisionOpen && (
            <View
              style={{
                borderBottomColor: "red",
                borderBottomWidth: 4,
                // backgroundColor: "red",
                width: 40,
              }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsRivisionOpen(false);
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",

              padding: 12,
            }}
          >
            <Image source={require("../../assets/images/group.png")} />
            <Text style={{ color: "white", fontSize: 15, marginLeft: 6 }}>
              टेस्ट झोन
            </Text>
          </View>
          {!isRivisionOpen && (
            <View
              style={{
                borderBottomColor: "red",
                borderBottomWidth: 4,
                // backgroundColor: "red",
                width: 40,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1, width: "100%", marginBottom: 70 }}>
        {isRivisionOpen ? <RevisionQuizScreen /> : <RecentQuizScreen />}
        {false && (
          <View style={{ padding: 25, marginTop: 35, width: "100%" }}>
            <TouchableOpacity
              onPress={() => {
                logout();
              }}
              style={{
                backgroundColor: "blue",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: 55,
                borderRadius: 12,
                marginTop: 20,
              }}
              textStyle={{ color: "white" }}
            >
              <Text>LogOut</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
export default Test;
