/* eslint-disable */

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/loginScreens/LoginScreen";
import SignupScreen from "../../screens/loginScreens/SignupScreen";
import TabBar from "../newBottomTabBar/tabBar";
import Login from "../../screens/Login";
import AccountScreen from "../../screens/Account";

const Stack = createNativeStackNavigator();

const Auth = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TabBar"
          options={{ headerShown: false }}
          component={TabBar}
        />
        <Stack.Screen
          name="AccountScreen"
          options={{ headerShown: false }}
          component={AccountScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Auth;
