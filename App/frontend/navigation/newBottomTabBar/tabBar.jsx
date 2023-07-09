/* eslint-disable */
import React, { useContext, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Image,
  View,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import Group from "../../screens/groupScreens/GroupScreen";
import Test from "../../screens/testScreens/testScreen";
import AuthContext from "../../auth/context";

const Tab = createBottomTabNavigator();

export default function TabBar() {
  const { tabBarVisible } = useContext(AuthContext);

  return (
    <Tab.Navigator
      initialRouteName="Group"
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#084347",
          height: 75,
          paddingBottom: 10,
          marginTop: 10,
          display: tabBarVisible ? "flex" : "none",
          // display: "none",
        },
      }}
    >
      <Tab.Screen
        name="Group"
        component={Group}
        options={{
          // tabBarShowLabel:,

          tabBarLabelPosition: "beside-icon",
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            let label;
            return (label = focused ? (
              <Text
                style={{
                  fontSize: 14,
                  color: "#FFF",
                  marginLeft: 15,
                  fontWeight: "bold",
                }}
              >
                भरती परिवार
              </Text>
            ) : (
              <Text style={{ fontSize: 14, color: "#506477", marginLeft: 18 }}>
                भरती परिवार
              </Text>
            ));
          },
          tabBarIcon: ({ color, size }) => (
            <View style={{}}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: "contain",
                  marginHorizontal: 5,
                }}
                source={require("../../assets/images/group.png")}
              ></Image>
              {/* <Text style={{  marginLeft: 5, color: '#fff' }}>भरती परिवार</Text> */}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Test"
        component={Test}
        options={{
          // tabBarShowLabel:,
          tabBarLabelPosition: "beside-icon",
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            let label;
            return (label = focused ? (
              <Text
                style={{
                  fontSize: 14,
                  color: "#FFF",
                  marginLeft: 15,
                  fontWeight: "bold",
                }}
              >
                Test जंक्शन
              </Text>
            ) : (
              <Text style={{ fontSize: 14, color: "#506477", marginLeft: 18 }}>
                Test जंक्शन
              </Text>
            ));
          },
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: "contain",
                  marginHorizontal: 5,
                }}
                source={require("../../assets/images/test.png")}
              ></Image>
              {/* <Text style={{  marginLeft: 5, color: '#fff' }}>भरती जंक्शन</Text> */}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
