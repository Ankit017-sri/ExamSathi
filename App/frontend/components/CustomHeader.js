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
import Constants from "../constants/index";
import ProfileIcon from "react-native-vector-icons/EvilIcons";
import Colors from "../constants/Colors";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import baseUrl from "../baseUrl";
import AuthContext from "../auth/context";
import { useNavigation } from "@react-navigation/native";
import { CometChat } from "@cometchat-pro/react-native-chat";
import { Mixpanel } from "mixpanel-react-native";

const trackAutomaticEvents = true;
const mixpanel = new Mixpanel(
  "f601299fc807c669258f66d0997f015e",
  trackAutomaticEvents
);

mixpanel.init();

const CustomHeader = ({
  title,
  isBack,
  navigation,
  sub,
  imgUri,
  setTabBarVisible,
  share,
  mute,
  group,
  bgColor,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const { token } = useContext(AuthContext);
  const navigation1 = useNavigation();

  const shareMessage = `मित्रा, हे app डाउनलोड कर आणि ग्रुप मध्ये जॉईन हो! भरतीच्या तयारी साठी खूप उपयुक्त आहे. ह्यात भरपूर free टेस्ट, fast updates आणि discussion ग्रुप आहेत. 
  Exam Sathi app
  https://bit.ly/ExamSathiApp`;
  const whatsappUrl = `whatsapp://send?text=${shareMessage}`;

  const appShareCount = async () => {
    try {
      const res = await axios.put(
        `${baseUrl}/auth/app/share`,
        { screen: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const Share = () => {
    mixpanel.track("Header_share_button_click", {
      buttonName: "shareButton",
    });

    let url = `whatsapp://send?text=" + ${shareMessage}`;
    appShareCount();
    Linking.openURL(url)
      .then((data) => {
        console.log("WhatsApp Opened successfully " + data); //<---Success
      })
      .catch(() => {
        alert("Make sure WhatsApp installed on your device"); //<---Error
      });
    // try {
    //   const supported = await Linking.canOpenURL(whatsappUrl);
    //   appShareCount();
    //   if (supported) {
    //     await Linking.openURL(whatsappUrl);
    //   } else {
    //     console.log(`Unable to open WhatsApp URL: ${whatsappUrl}`);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
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
        // console.log(res.data);
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
          backgroundColor: bgColor,
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
          <Icon name="arrow-back-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
      )}
      {imgUri && <Image source={imgUri} style={styles.avatar} />}
      <View
        style={
          (share || mute) && {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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
            <Icon
              name={isMuted ? "volume-high" : "volume-mute"}
              size={20}
              color={"white"}
            />
          </TouchableOpacity>
        )}
        {share && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              id="shareButton"
              style={{
                flexDirection: "row",
                borderRadius: 50,
                borderColor: "#25D366",
                borderWidth: 1,
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 2,
                backgroundColor: "#78EA5B",
              }}
              onPress={Share}
            >
              <Image
                source={require("../assets/WhatsApp.svg.png")}
                style={{ width: 28, height: 28 }}
              />
              <Text
                style={{
                  marginLeft: 4,
                  fontSize: 14,
                  textAlignVertical: "center",
                  color: "#1F6F0C",
                  fontWeight: "600",
                }}
              >
                मित्र आमंत्रित करा
              </Text>
            </TouchableOpacity>
            <ProfileIcon
              name="user"
              onPress={() => {
                navigation1.navigate("AccountScreen");
              }}
              size={40}
              color={"white"}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 45 + Constants.statusBarHeight,
    justifyContent: "center",
    alignItems: "flex-end",
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
