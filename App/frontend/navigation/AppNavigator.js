import React, { useContext, useState, useEffect } from "react";
import { Text, View, Animated, Dimensions, Image } from "react-native";
import axios from "axios";
import baseUrl from "../baseUrl";
import { Keyboard } from "react-native";
import {
  TransitionPresets,
  // CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// import { useSelector } from "react-redux";

import AccountScreen from "../screens/Account";
import PastQuizScreen from "../screens/PastQuiz";
import RecentQuizScreen from "../screens/RecentQuiz";
import ChatsScreen from "../screens/Chats";
// import ProductsOverviewScreen, {
//   screenOptions as productsOverviewScreenOptions,
// } from "../screens/shop/ProductsOverviewScreen";
// import ProductDetailScreen, {
//   screenOptions as productDetailScreenOptions,
// } from "../screens/shop/ProductDetailScreen";
// import CartScreen, {
//   screenOptions as cartScreenOptions,
// } from "../screens/shop/CartScreen";
// import OrdersScreen, {
//   screenOptions as ordersScreenOptions,
// } from "../screens/shop/OrdersScreen";
// import UserProductsScreen, {
//   screenOptions as userProductsScreenOptions,
// } from "../screens/user/UserProductsScreen";
// import AuthScreen, {
//   screenOptions as authScreenOptions,
// } from "../screens/user/AuthScreen";
// import EditProductScreen, {
//   screenOptions as editProductScreenOptions,
// } from "../screens/user/EditProductScreen";
// import StartupScreen from "../screens/StartupScreen";
import Colors from "../constants/Colors";
import QuizDetails from "../screens/QuizDetails";
import Solution from "../screens/Solution";
import AuthContext from "../auth/context";
import ChatContext from "../chat/context";
import ChatGroups from "../screens/ChatGroups";
// import NewGroup from "../screens/NewGroup";
// import GroupDescription from "../screens/GroupDescription";
// import GroupChat from "../screens/GroupChat";
import cache from "../utilities/cache";
import FeedbackScreen from "../screens/Feedback";

let defaultNavOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  headerStyle: {
    backgroundColor: Colors.primary,
    elevation: 0,
  },
  headerTitleAlign: "center",
  headerTitleStyle: {
    fontFamily: "product-sans-regular",
    fontSize: 22,
  },
  headerTintColor: Colors.text,
  // headerMode: "float",
  headerShown: false,
  headerLeft: null,
};

// const ProductsStackNavigator = createStackNavigator();

// export const ProductsNavigator = () => {
//   return (
//     <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
//       <ProductsStackNavigator.Screen
//         title="All Products"
//         name="ProductsOverview"
//         component={ProductsOverviewScreen}
//         options={productsOverviewScreenOptions}
//       />
//       <ProductsStackNavigator.Screen
//         name="ProductDetail"
//         component={ProductDetailScreen}
//         options={productDetailScreenOptions}
//       />
//     </ProductsStackNavigator.Navigator>
//   );
// };

// export const ProductsNavigator = createStackNavigator(
//   {
//     ProductsOverview: ProductsOverviewScreen,
//     ProductDetail: ProductDetailScreen,
//   },
//   {
//     defaultNavigationOptions: defaultNavOptions,
//   }
// );

const QuizStackNavigator = createStackNavigator();

export const QuizNavigator = () => {
  return (
    <QuizStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <QuizStackNavigator.Screen
        name="QuizDetail"
        component={PastQuizScreen}
        // options={ordersScreenOptions}
      />
      <QuizStackNavigator.Screen
        name="QuizDetailScreen"
        component={QuizDetails}
        // options={productDetailScreenOptions}
      />
      <QuizStackNavigator.Screen
        name="SolutionScreen"
        component={Solution}
        // options={productDetailScreenOptions}
      />
    </QuizStackNavigator.Navigator>
  );
};

const ChatStackNavigator = createStackNavigator();

const ChatsNavigator = () => {
  const { token } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [memCount, setMemCount] = useState();
  const [replyMessage, setReplyMessage] = useState({});
  const handleGroup = (group) => {
    setGroups([...groups, group]);
  };
  const fetchGroups = async () => {
    const groupDetails = await cache.get("groups");
    if (groupDetails !== null) {
      setGroups(groupDetails);
    } else {
      const res = await axios
        .get(`${baseUrl}/group/names`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((e) => console.log(e));
      // console.log(res.data);
      if (res?.data) {
        setGroups(res?.data);
      }
    }
  };

  async function fetchCounts() {
    await axios
      .get(`${baseUrl}/auth/users/count`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        // console.log(data.data[0].count);
        setMemCount(data.data[0].count);
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    fetchGroups();
    fetchCounts();
  }, []);
  return (
    <ChatContext.Provider
      value={{
        handleGroup,
        groups,
        setGroups,
        memCount,
        replyMessage,
        setReplyMessage,
      }}
    >
      <ChatStackNavigator.Navigator screenOptions={defaultNavOptions}>
        <ChatStackNavigator.Screen name="Chat Groups" component={ChatGroups} />
        <ChatStackNavigator.Screen name="Chat" component={ChatsScreen} />
        {/* <ChatStackNavigator.Screen name="Group Chat" component={GroupChat} />
        <ChatStackNavigator.Screen name="New Group" component={NewGroup} /> */}
        {/* <ChatStackNavigator.Screen
          name="Group Description"
          component={GroupDescription}
        /> */}
      </ChatStackNavigator.Navigator>
    </ChatContext.Provider>
  );
};
const AccountStackNavigator = createStackNavigator();
const AccountNavigator = () => {
  return (
    <AccountStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AccountStackNavigator.Screen name="Account" component={AccountScreen} />
      <AccountStackNavigator.Screen
        name="Feedback"
        component={FeedbackScreen}
      />
    </AccountStackNavigator.Navigator>
  );
};

const Tab = createBottomTabNavigator();

export const AppNavigator = ({ onLayout }) => {
  const { width } = Dimensions.get("screen");
  const [position] = useState(new Animated.ValueXY());

  const { tabBarVisible } = useContext(AuthContext);
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardIsVisible(true);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardIsVisible(false);
    });
  }, []);

  const animStyles = {
    position: "absolute",
    left: 20,
    borderRadius: 20,
    elevation: 35,
    bottom: 45,
    height: 5,
    width: width / 7,
    backgroundColor: Colors.tabSlider,
    transform: position.getTranslateTransform(),
    display: tabBarVisible && !keyboardIsVisible ? "flex" : "none",
  };

  const animate = (value) => {
    Animated.timing(position, {
      toValue: { x: value, y: 0 },
      duration: 160,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      {<Animated.View style={animStyles} onLayout={onLayout} />}
      <Tab.Navigator
        initialRouteName="Chats"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            color = focused ? Colors.text : "black";
            size = focused ? 26 : 24;

            if (route.name === "Chats")
              iconName = focused ? "home" : "home-outline";
            else if (route.name === "New Quiz")
              return (
                <Image
                  source={require("../assets/quiz.jpg")}
                  style={{ height: 30, width: 70 }}
                />
              );
            else if (route.name === "AccountNFeedback") {
              iconName = focused ? "person" : "person-outline";
              size = focused ? 23 : 21;
            } else if (route.name === "Past Quiz") {
              iconName = focused ? "newspaper" : "newspaper-outline";
              size = focused ? 23 : 21;
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "#fff",
            // borderTopColor: Colors.primary,
            height: 50,
            display: tabBarVisible ? "flex" : "none",
          },
          tabBarActiveTintColor: Colors.text,
          tabBarInactiveTintColor: Colors.primary,
          tabBarShowLabel: false,
          lazy: false,
        })}
      >
        {/* <Animated.View style={animStyles} /> */}
        <Tab.Screen
          name="Chats"
          component={ChatsNavigator}
          listeners={{
            tabPress: (e) => {
              // e.preventDefault();
              animate(0);
            },
            focus: () => animate(0),
          }}
        />

        <Tab.Screen
          name="New Quiz"
          component={RecentQuizScreen}
          // options={{
          //   // tabBarBadge: cartItems.length,
          //   tabBarBadgeStyle: {
          //     backgroundColor: "#de3c3c",
          //     color: "white",
          //     fontFamily: "product-sans-medium",
          //     marginTop: 2,
          //   },
          // }}
          listeners={{
            tabPress: (e) => {
              // e.preventDefault();
              animate(width / 4);
            },
            focus: () => animate(width / 4),
          }}
        />
        <Tab.Screen
          name="Past Quiz"
          component={QuizNavigator}
          listeners={{
            tabPress: (e) => {
              // e.preventDefault();
              animate(width / 2);
            },
            focus: () => animate(width / 2),
          }}
        />

        <Tab.Screen
          name="AccountNFeedback"
          component={AccountNavigator}
          listeners={{
            tabPress: (e) => {
              // e.preventDefault();
              animate(width / 2 + width / 4);
            },
            focus: () => animate(width / 2 + width / 4),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

// const ShopNavigator = createBottomTabNavigator(tabScreenConfig, {
//   tabBarOptions: {
//     animationEnabled: true,
//     activeTintColor: Colors.text,
//     // inactiveTintColor: Colors.accent,
//     keyboardHidesTabBar: true,
//     tabStyle: {
//       paddingTop: 17,
//     },
//   },
//   tabBarComponent: (props) => <CustomBottomBar {...props} />,
// });

// const MainNavigator = createSwitchNavigator({
//   Startup: StartupScreen,
//   Auth: AuthNavigator,
//   Shop: ShopNavigator,
// });

// export default createAppContainer(MainNavigator);
