import React, {useContext, useState, useEffect, useRef} from 'react';
import {Text, View, Animated, Dimensions, Image, Platform} from 'react-native';
import axios from 'axios';
import baseUrl from '../baseUrl';
import {Keyboard} from 'react-native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import PushNotification from 'react-native-push-notification';

import AccountScreen from '../screens/Account';
import PastQuizScreen from '../screens/PastQuiz';
import RecentQuizScreen from '../screens/RecentQuiz';
import ChatsScreen from '../screens/Chats';
import Colors from '../constants/Colors';
import QuizDetails from '../screens/QuizDetails';
import Solution from '../screens/Solution';
import AuthContext from '../auth/context';
import ChatContext from '../chat/context';
import ChatGroups from '../screens/ChatGroups';
import cache from '../utilities/cache';
import FeedbackScreen from '../screens/Feedback';
import {registerForPushNotificationsAsync} from '../utilities/notifications';
import RevisionQuizScreen from '../screens/RevisionQuizScreen';

let defaultNavOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  headerStyle: {
    backgroundColor: Colors.primary,
    elevation: 0,
  },
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontFamily: 'product-sans-regular',
    fontSize: 22,
  },
  headerTintColor: Colors.text,
  // headerMode: "float",
  headerShown: false,
  headerLeft: null,
};

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

// const ChatStackNavigator = createStackNavigator();

// const ChatsNavigator = () => {
//   const { token } = useContext(AuthContext);
//   const [groups, setGroups] = useState([]);
//   const [memCount, setMemCount] = useState();
//   const [replyMessage, setReplyMessage] = useState({});
//   const handleGroup = (group) => {
//     setGroups([...groups, group]);
//   };
//   const fetchGroups = async () => {
//     const groupDetails = await cache.get("groups");
//     if (groupDetails !== null) {
//       setGroups(groupDetails);
//     } else {
//       const res = await axios
//         .get(`${baseUrl}/group/names`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .catch((e) => console.log(e));
//       // console.log(res.data);
//       if (res?.data) {
//         setGroups(res?.data);
//       }
//     }
//   };

//   async function fetchCounts() {
//     await axios
//       .get(`${baseUrl}/auth/users/count`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((data) => {
//         // console.log(data.data[0].count);
//         setMemCount(data.data[0].count);
//       })
//       .catch((e) => console.log(e));
//   }

//   useEffect(() => {
//     fetchGroups();
//     fetchCounts();
//   }, []);
//   return (
//     <ChatContext.Provider
//       value={{
//         handleGroup,
//         groups,
//         setGroups,
//         memCount,
//         replyMessage,
//         setReplyMessage,
//       }}
//     >
//       <ChatStackNavigator.Navigator screenOptions={defaultNavOptions}>
//         <ChatStackNavigator.Screen name="Chat Groups" component={ChatGroups} />
//         <ChatStackNavigator.Screen name="Chat" component={ChatsScreen} />
//       </ChatStackNavigator.Navigator>
//     </ChatContext.Provider>
//   );
// };

const AccountStackNavigator = createStackNavigator();
const RevisionScreenNavigator = () => {
  return (
    <AccountStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AccountStackNavigator.Screen
        name="RevisionScreen"
        component={RevisionQuizScreen}
      />
      <AccountStackNavigator.Screen
        name="Feedback"
        component={FeedbackScreen}
      />
    </AccountStackNavigator.Navigator>
  );
};

const Tab = createBottomTabNavigator();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });
PushNotification.configure({
  requestPermissions: Platform.OS === 'ios',
});

export const AppNavigator = ({onLayout}) => {
  const {width} = Dimensions.get('screen');
  const [position] = useState(new Animated.ValueXY());
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const {tabBarVisible} = useContext(AuthContext);
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

  const {token} = useContext(AuthContext);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardIsVisible(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardIsVisible(false);
    });
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // notificationListener.current =
    //   Notifications.addNotificationReceivedListener(notification => {
    //     setNotification(notification);
    //   });

    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener(response => {
    //     console.log(response);
    //   });

    return () => {
      PushNotification.unregister();
    };
  }, []);

  useEffect(() => {
    const storeToken = async () => {
      await axios
        .put(
          `${baseUrl}/notifications/subscribe`,
          {expoPushToken},
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        )
        .then(res => null)
        .catch(err => console.log(err));
    };

    if (expoPushToken && token) {
      storeToken();
    }
  }, [expoPushToken, token]);

  // useEffect(() => {
  //   console.log("Expo Push Token: ", expoPushToken);
  //   if (notification) {
  //     console.log("Title: ", notification.request.content.title);
  //     console.log("Body: ", notification.request.content.body);
  //     console.log("Data: ", notification.request.content.data);
  //   }
  // }, [notification, expoPushToken]);

  const animStyles = {
    position: 'absolute',
    left: 20,
    borderRadius: 20,
    elevation: 35,
    bottom: 45,
    height: 5,
    width: width / 7,
    backgroundColor: Colors.tabSlider,
    transform: position.getTranslateTransform(),
    display: tabBarVisible && !keyboardIsVisible ? 'flex' : 'none',
  };

  const animate = value => {
    Animated.timing(position, {
      toValue: {x: value, y: 0},
      duration: 160,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      {<Animated.View style={animStyles} onLayout={onLayout} />}
      <Tab.Navigator
        initialRouteName="Chats"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            color = focused ? Colors.text : 'black';
            size = focused ? 26 : 24;

            if (route.name === 'RevisionQuiz') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'New Quiz') {
              return (
                <Image
                  source={require('../assets/quiz.jpg')}
                  style={{height: 30, width: 70}}
                />
              );
            } else if (route.name === 'AccountNFeedback') {
              iconName = focused ? 'person' : 'person-outline';
              size = focused ? 23 : 21;
            } else if (route.name === 'Past Quiz') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
              size = focused ? 23 : 21;
            }

            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: '#fff',
            // borderTopColor: Colors.primary,
            height: 50,
            display: tabBarVisible ? 'flex' : 'none',
          },
          tabBarActiveTintColor: Colors.text,
          tabBarInactiveTintColor: Colors.primary,
          tabBarShowLabel: false,
          lazy: false,
        })}>
        {/* <Animated.View style={animStyles} /> */}
        <Tab.Screen
          name="RevisionQuiz"
          component={RevisionScreenNavigator}
          listeners={{
            tabPress: e => {
              // e.preventDefault();
              animate(0);
            },
            focus: () => animate(0),
          }}
        />

        <Tab.Screen
          name="New Quiz"
          component={RecentQuizScreen}
          listeners={{
            tabPress: e => {
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
            tabPress: e => {
              // e.preventDefault();
              animate(width / 2);
            },
            focus: () => animate(width / 2),
          }}
        />

        {/* <Tab.Screen
          name="AccountNFeedback"
          component={AccountScreen}
          listeners={{
            tabPress: e => {
              // e.preventDefault();
              animate(width / 2 + width / 4);
            },
            focus: () => animate(width / 2 + width / 4),
          }}
        /> */}
      </Tab.Navigator>
    </>
  );
};
