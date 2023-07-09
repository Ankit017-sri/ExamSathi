/* eslint-disable */

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/loginScreens/LoginScreen";
import SignupScreen from "../../screens/loginScreens/SignupScreen";
import TabBar from "../newBottomTabBar/tabBar";
import Login from "../../screens/Login";
import AccountScreen from "../../screens/Account";
import Feedback from "../../screens/Feedback";
import PastQuiz from "../../screens/PastQuiz";
import QuizDetails from "../../screens/QuizDetails";
import Solution from "../../screens/Solution";
import RecentQuiz from "../../screens/RecentQuiz";
import Test from "../../screens/testScreens/testScreen";
import App from "../../App";

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
        <Stack.Screen
          name="Feedback"
          options={{ headerShown: false }}
          component={Feedback}
        />
        <Stack.Screen
          name="PastQuizz"
          options={{ headerShown: false }}
          component={PastQuiz}
        />
        <Stack.Screen
          name="QuizDetails"
          options={{ headerShown: false }}
          component={QuizDetails}
        />
        <Stack.Screen
          name="MainScreen"
          options={{ headerShown: false }}
          component={TabBar}
        />
        <Stack.Screen
          name="SolutionScreen"
          options={{ headerShown: false }}
          component={Solution}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Auth;
