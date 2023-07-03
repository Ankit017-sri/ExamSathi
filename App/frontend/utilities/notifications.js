// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import {Platform} from 'react-native';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

// import appConfig from '../app.json';
// import axios from 'axios';

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications;
// async function sendPushNotification(expoPushToken) {
//   const message = {
//     to: expoPushToken,
//     sound: 'default',
//     title: 'Original Title',
//     body: 'And here is the body!',
//     data: {someData: 'goes here'},
//   };

//   await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   });
// }

async function sendPushNotification(expoPushToken) {
  PushNotification.localNotification({
    channelId: 'default',
    title: 'Original Title',
    message: 'And here is the body!',
    userInfo: {someData: 'goes here'},
  });
}

// async function registerForPushNotificationsAsync() {
//   let token;

//   const projectId = appConfig?.expo?.extra?.eas?.projectId;

//   if (Device.isDevice) {
//     const {status: existingStatus} = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const {status} = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync({projectId})).data;
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }

async function registerForPushNotificationsAsync() {
  let token;

  // if (Device.isDevice) {
  PushNotification.configure({
    onRegister: function (result) {
      token = result.token;
    },
    onNotification: function (notification) {
      console.log(notification);
    },
    onAction: function (notification) {
      console.log(notification);
    },
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });
  // } else {
  //   alert('Must use physical device for Push Notifications');
  // }

  return token;
}

export {sendPushNotification, registerForPushNotificationsAsync};
