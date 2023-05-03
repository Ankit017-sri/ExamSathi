import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Image,
  Button,
  Linking,
} from "react-native";
import Constants from "expo-constants";

import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import baseUrl from "../baseUrl";
import AuthContext from "../auth/context";

const CustomHeader = ({
  title,
  isBack,
  navigation,
  sub,
  imgUri,
  setTabBarVisible,
  share,
  appShareCount,
  mute,
  group,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const { token } = useContext(AuthContext);

  const shareMessage = `मित्रा, हे app डाउनलोड कर आणि ग्रुप मध्ये जॉईन हो! भरतीच्या तयारी साठी खूप उपयुक्त आहे. ह्यात भरपूर free टेस्ट, fast updates आणि discussion ग्रुप आहेत. 
  Exam Sathi app
  https://play.google.com/store/apps/details?id=com.examSathi.examSathi`;
  const whatsappUrl = `whatsapp://send?text=${shareMessage}`;

  const Share = async () => {
    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      appShareCount();
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        console.log(`Unable to open WhatsApp URL: ${whatsappUrl}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleMute = async () => {
    const res = await axios
      .put(
        `${baseUrl}/group/toggle-mute/${group}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setIsMuted(!isMuted);
        console.log(res.data);
      })
      .catch((e) => console.log(e));

    // console.log(res);
  };

  const fetchMutedGroups = async () => {
    const res = await axios
      .put(
        `${baseUrl}/group/muted-groups`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.find((grp) => grp === group)) setIsMuted(true);
        console.log(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchMutedGroups();
  }, []);

  return (
    <View
      style={[
        styles.headerContainer,
        {
          height: sub
            ? 60 + Constants.statusBarHeight
            : 45 + Constants.statusBarHeight,
        },
      ]}
    >
      {isBack && (
        <TouchableOpacity
          style={{
            left: 10,
            position: "absolute",
            alignSelf: "flex-end",
            bottom: sub ? 10 : 5,
          }}
          onPress={() => {
            Keyboard.dismiss();
            navigation.goBack();
            setTabBarVisible && setTabBarVisible(true);
          }}
        >
          <Ionicons name="arrow-back-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
      )}
      {imgUri && <Image source={imgUri} style={styles.avatar} />}
      <View
        style={
          (share || mute) && {
            flexDirection: "row",
            justifyContent: "space-between",
            width: mute ? "60%" : "90%",
            marginLeft: mute ? 50 : 0,
          }
        }
      >
        <View>
          <Text
            style={[
              styles.title,
              {
                fontSize: sub ? 16 : 20,
                // marginLeft: imgUri ? 50 : 0,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {sub && <Text style={styles.sub}>{sub}</Text>}
        </View>
        {mute && (
          <TouchableOpacity
            style={{
              alignItems: "center",
            }}
            onPress={handleToggleMute}
          >
            <Text style={{ color: "white" }}>
              {isMuted ? "Unmute" : "Mute"}
            </Text>
            <Ionicons
              name={isMuted ? "volume-high" : "volume-mute"}
              size={20}
              color={"white"}
            />
          </TouchableOpacity>
        )}
        {share && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              borderRadius: 12,
              borderColor: "#25D366",
              borderWidth: 1,
              paddingHorizontal: 8,
              paddingVertical: 2,
              backgroundColor: "#fff",
            }}
            onPress={Share}
          >
            {/* <Ionicons name="logo-whatsapp" color="#25D366" size={25} /> */}
            <Image
              source={require("../assets/WhatsApp.svg.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                marginLeft: 4,
                textAlignVertical: "center",
                color: "#25D366",
                fontWeight: "600",
              }}
            >
              Share App
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 45 + Constants.statusBarHeight,
    // backgroundColor: Colors.primary,
    backgroundColor: "#23395d",
    justifyContent: "center",
    alignItems: "flex-end",
    elevation: 5,
    marginBottom: 5,
    paddingBottom: 10,
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    // color: Colors.text,
    color: "#fff",
    alignSelf: "center",
  },
  sub: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#17cfe3",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    position: "absolute",
    left: 50,
    bottom: 10,
  },
});

export default CustomHeader;
