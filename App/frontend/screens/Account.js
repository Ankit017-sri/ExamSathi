import Icon from "react-native-vector-icons/Ionicons";
import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";

import CustomHeader from "../components/CustomHeader";
import Colors from "../constants/Colors";
import cache from "../utilities/cache";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import axios from "axios";
import baseUrl from "../baseUrl";
import { CometChat } from "@cometchat-pro/react-native-chat";

const AccountScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext);

  const { name, phone } = useContext(AuthContext);

  const deleteAccountHandler = async () => {
    const res = await axios.delete(`${baseUrl}/auth/delete`, {
      headers: { Authorization: `Bearer ${authContext.token}` },
    });

    //console.log(res);

    if (res.data.message === "USER_DELETED") {
      await cache.clear();
      authStorage.removeToken();
      authContext.setToken(null);
      authContext.setName(null);
    } else alert("Something went wrong. Please try again.");
  };

  const deleteHandler = () => {
    Alert.alert(null, "Are you sure you want to delete your account?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "YES", onPress: () => deleteAccountHandler() },
    ]);
  };

  const DeleteAccount = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: 40,
        }}
        activeOpacity={0.6}
        onPress={deleteHandler}
      >
        <Text
          style={{
            fontSize: 14,
            color: Colors.danger,
            marginRight: 10,
          }}
        >
          Delete Account
        </Text>
        <Icon name={"trash-outline"} size={18} color={Colors.danger} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Account" />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.cardContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={require("../assets/avatar.png")}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.phone}>{phone}</Text>
              <DeleteAccount />
            </View>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: Colors.primary,
              borderRadius: 20,
              height: 40,
              width: "100%",
              backgroundColor: "#1F6E8C",
            }}
            activeOpacity={0.6}
            onPress={async () => {
              await cache.clear();
              authStorage.removeToken();
              authContext.setToken(null);
              authContext.setName(null);
              CometChat.logout().then(
                () => {
                  console.log("Logout completed successfully");
                },
                (error) => {
                  console.log("Logout failed with exception:", { error });
                }
              );
            }}
          >
            <Text
              style={{
                fontSize: 17,
                color: "white",
                marginRight: 10,
              }}
            >
              Logout
            </Text>
            <Icon name={"log-out-outline"} size={27} color="white" />
          </TouchableOpacity>
        </View>
        {/* <View
              style={[
                styles.cardContainer,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // padding: 10,
                  marginTop: 10,
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  borderRadius: 5,
                  height: 40,
                  width: "48%",
                  backgroundColor: "#90AAD5",
                }}
                activeOpacity={0.6}
                onPress={async () => {
                  Linking.openURL("https://t.me/maharshtrapolicebhartiES");
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: Colors.primary,
                    marginRight: 10,
                  }}
                >
                  Join
                </Text>
                <FontAwesome
                  name={"telegram"}
                  size={25}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  borderRadius: 5,
                  height: 40,
                  width: "48%",
                  backgroundColor: "#90AAD5",
                }}
                activeOpacity={0.6}
                onPress={async () => {
                  Linking.openURL(
                    "https://chat.whatsapp.com/GISQhkKkVKg8z0z9rbqF9l"
                  );
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: Colors.primary,
                    marginRight: 10,
                  }}
                >
                  Join
                </Text>
                <Icon
                  name={"logo-whatsapp"}
                  size={23}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View> */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: Colors.primary,
            borderRadius: 20,
            height: 40,
            width: "85%",
            backgroundColor: "#1F6E8C",
            marginTop: 30,
            // marginRight: 40,
          }}
          activeOpacity={0.6}
          onPress={async () =>
            await Share.share({
              message: `मित्रा, हे app डाउनलोड कर आणि ग्रुप मध्ये जॉईन हो! भरतीच्या तयारी साठी खूप उपयुक्त आहे. ह्यात भरपूर free टेस्ट, fast updates आणि discussion ग्रुप आहेत. 
  Exam Sathi app
  https://play.google.com/store/apps/details?id=com.examSathi.examSathi`,
            })
          }
        >
          <Text
            style={{
              fontSize: 17,
              color: "white",
              marginRight: 10,
            }}
          >
            Share App
          </Text>
          <Icon name="share-social-outline" size={20} color={"white"} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: Colors.primary,
            borderRadius: 5,
            height: 40,
            width: "85%",
            backgroundColor: "#90AAD5",
            marginTop: 30,
            // marginRight: 40,
          }}
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate("Feedback");
          }}
        >
          <Text
            style={{
              fontSize: 17,
              color: Colors.primary,
              marginRight: 10,
            }}
          >
            Feedback
          </Text>
          
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cardContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 20,
    // borderWidth: 1,
    width: "100%",
    // flexWrap: "wrap",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    // marginBottom: 5,
    flexWrap: "wrap",
    // maxWidth: "85%",
    // borderWidth: 1,
  },
  phone: {
    fontSize: 16,
    color: "gray",
  },
});

export default AccountScreen;
