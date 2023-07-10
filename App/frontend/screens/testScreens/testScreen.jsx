/* eslint-disable */
import React, { useRef, useEffect, useState, useContext } from "react";
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
import PastQuiz from "../PastQuiz";
import AuthContext from "../../auth/context";
import { Mixpanel } from "mixpanel-react-native";

const trackAutomaticEvents = true;
const mixpanel = new Mixpanel(
  "f601299fc807c669258f66d0997f015e",
  trackAutomaticEvents
);

mixpanel.init();

function Test({ navigation }) {
  const [isRivisionOpen, setIsRivisionOpen] = useState(true);
  const [currTab, setCurrTab] = useState();

  const { tabBarVisible } = useContext(AuthContext);

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

  useEffect(() => {
    let currTab;
    if (isRivisionOpen) currTab = "Revison";
    else currTab = "Exam";
    mixpanel.timeEvent(`time_spent_on_${currTab}_tab`);

    return () => {
      mixpanel
        .eventElapsedTime(`time_spent_on_${currTab}_tab`)
        .then((duration) => {
          mixpanel.track(`time_spent_on_${currTab}_tab`, {
            duration: `${duration + " second"}`,
          });
          mixpanel.clearSuperProperties(`time_spent_on_${currTab}_tab`);
        })
        .catch((error) => {
          console.error("Error calculating screen time:", error);
        });
    };
  }, [isRivisionOpen]);

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
        title="ExamSathi"
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
            <Image
              source={require("../../assets/liveIcon.png")}
              style={{ width: 36, height: 28 }}
            />
            <Text style={{ color: "white", fontSize: 15, marginLeft: 6 }}>
              लाईव्ह रिविजन
            </Text>
          </View>
          {isRivisionOpen && (
            <View
              style={{
                borderBottomColor: "#FA833F",
                borderBottomWidth: 4,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,

                width: 60,
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
            <Image
              source={require("../../assets/testIcon.png")}
              style={{ width: 28, height: 28 }}
            />
            <Text style={{ color: "white", fontSize: 15, marginLeft: 6 }}>
              टेस्ट झोन
            </Text>
          </View>
          {!isRivisionOpen && (
            <View
              style={{
                borderBottomColor: "#FA833F",
                borderBottomWidth: 4,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                width: 60,
              }}
            />
          )}
        </TouchableOpacity>
      </View>

      {isRivisionOpen ? <RevisionQuizScreen /> : <RecentQuizScreen />}
    </View>
  );
}
export default Test;
