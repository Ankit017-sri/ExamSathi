import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  BackHandler,
  Alert,
} from "react-native";

import AuthContext from "../auth/context";
import baseUrl from "../baseUrl";
import CustomHeader from "../components/CustomHeader";
import Loader from "../components/Loader";
import QuesCard from "../components/QuesCard";
import Colors from "../constants/Colors";

const RecentQuiz = ({ navigation }) => {
  const [response, setResponse] = useState([]);
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [data15, setData15] = useState([]);
  const [data100, setData100] = useState([]);
  const [dataCurrAffair, setDataCurrAffair] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [is15Submitted, setIs15Submitted] = useState(false);
  const [is100Submitted, setIs100Submitted] = useState(false);
  const [isCurrAffairSubmitted, setIsCurrAffairSubmitted] = useState(false);
  const [quizType, setQuizType] = useState(0);

  const { token, setTabBarVisible } = useContext(AuthContext);

  const getData = async () => {
    setLoading(true);
    const result15 = await axios.get(
      `${baseUrl}/quizData/latest`,

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const result100 = await axios.get(
      `${baseUrl}/quizData/latest/long`,

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const resultcurrAffairs = await axios.get(
      `${baseUrl}/quizData/latest/current-affairs`,

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setIs15Submitted(false);
    if (result15.data.length === 0) {
      setIs15Submitted(true);
      setLoading(false);
    }
    if (result100.data.length === 0) {
      setIs100Submitted(true);
      setLoading(false);
    }
    if (resultcurrAffairs.data.length === 0) {
      setIsCurrAffairSubmitted(true);
      setLoading(false);
    }

    // console.log(result);
    setData15(...result15.data);
    setData100(...result100.data);
    setDataCurrAffair(...resultcurrAffairs.data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const onSelect = (index, crctOption) => {
    if (response.length === 0) {
      response.push({ quesIndex: index, value: crctOption });
      setResponse(response);
    } else {
      const resIndex = response.map((p) => p.quesIndex).indexOf(index);
      const resAlreadyExists = resIndex !== -1;
      if (resAlreadyExists) {
        response[resIndex].value = crctOption;
        setResponse(response);
      } else {
        response.push({ quesIndex: index, value: crctOption });
        setResponse(response);
      }
    }
  };

  const submitHandler = async () => {
    setIsSubmitting(true);
    console.log(response);
    await axios
      .post(
        `${baseUrl}/submitQuiz`,
        {
          submittedQuizDetails: response,
          quizId: quizData._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setIsSubmitting(false);
        setTabBarVisible(true);
        setQuizStarted(false);
        // setIs15Submitted(true);
        navigation.navigate("QuizDetailScreen", { quiz: quizData });
      })
      .catch((e) => {
        alert("Something went wrong. Please try again.");
        setIsSubmitting(false);
      });
  };

  let interval;

  const startTimer = () => {
    // const countdownTime = new Date().getTime() + 15 * 60 * 1000;

    var countDownDate =
      new Date().getTime() +
      (quizData.quizDetails.length === 100 ? 90 : 15) * 60 * 1000;
    // console.log(countdownTime - new Date().getTime());

    interval = setInterval(() => {
      var now = new Date().getTime();
      const distance = countDownDate - now;

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 60)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval);
        submitHandler();
      } else {
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
  };

  useEffect(() => {
    if (quizStarted) startTimer();
    return () => clearInterval(interval);
  }, [quizStarted]);

  useEffect(() => {
    const backAction = () => {
      if (quizStarted)
        Alert.alert(
          "Watch Out!",
          "If you go back test will be submitted with the response. You want to continue?",
          [
            {
              text: "Cancel Test and Submit",
              onPress: () => submitHandler(),
              style: "cancel",
            },
            {
              text: "Continue Test!",
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
      else BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [quizStarted]);

  const selectQuiz = (type) => {
    if (type === 0) setQuizData(data100);
    else if (type === 1) setQuizData(dataCurrAffair);
    else if (type === 2) setQuizData(data15);
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="New Quiz" />
      {loading ? (
        <Loader />
      ) : quizStarted ? (
        <View style={{ marginBottom: 160 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            {timerMinutes === 0 && timerSeconds === 0 && timerHours === 0 ? (
              <Text style={{ color: "red", fontSize: 15, fontWeight: "bold" }}>
                Times Up
              </Text>
            ) : (
              <>
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Time Remaining:{" "}
                </Text>
                <Text
                  style={{
                    color: timerMinutes < 3 ? "red" : Colors.primary,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  {timerHours}:{timerMinutes}:
                  {timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                </Text>
              </>
            )}
          </View>

          <View style={{ height: Dimensions.get("window").height - 140 }}>
            <FlashList
              data={quizData.quizDetails}
              key={quizData._id}
              // keyExtractor={(item) => item._id}
              estimatedItemSize={100}
              renderItem={(itemData, index) => (
                <QuesCard
                  data={itemData.item}
                  index={index}
                  onSelect={onSelect}
                />
              )}
            />
          </View>
          <TouchableOpacity
            style={{
              ...styles.button,
              width: "90%",
              alignSelf: "center",
              height: 40,
              backgroundColor: isSubmitting ? "#aaa" : Colors.primary,
            }}
            activeOpacity={0.6}
            onPress={() => submitHandler()}
            disabled={isSubmitting}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardContainer}>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <View
              style={{
                ...styles.card,
                width: "45%",
                alignItems: "center",
                marginRight: 15,
              }}
            >
              {is15Submitted ? (
                <>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: "bold",
                      color: Colors.text,
                    }}
                  >
                    All Submitted
                  </Text>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={100}
                    color={"#26b1bf"}
                  />
                </>
              ) : (
                <>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: "bold",
                      color: Colors.text,
                      marginBottom: 20,
                    }}
                  >
                    नवीन १०० मार्क्स टेस्ट!
                  </Text>
                  <TouchableOpacity
                    style={{ ...styles.button, width: "100%" }}
                    activeOpacity={0.6}
                    onPress={() => {
                      selectQuiz(0);
                      setTabBarVisible(false);
                      setQuizStarted(true);
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 16 }}>
                      Start Now
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View
              style={{ ...styles.card, width: "45%", alignItems: "center" }}
            >
              {is100Submitted ? (
                <>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: "bold",
                      color: Colors.text,
                    }}
                  >
                    All Submitted
                  </Text>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={100}
                    color={"#26b1bf"}
                  />
                </>
              ) : (
                <>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: "bold",
                      color: Colors.text,
                      marginBottom: 20,
                    }}
                  >
                    Latest चालू घडामोडी टेस्ट!
                  </Text>
                  <TouchableOpacity
                    style={{ ...styles.button, width: "100%" }}
                    activeOpacity={0.6}
                    onPress={() => {
                      selectQuiz(1);
                      setTabBarVisible(false);
                      setQuizStarted(true);
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 16 }}>
                      Start Now
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          <View style={{ ...styles.card, width: "45%", alignItems: "center" }}>
            {isCurrAffairSubmitted ? (
              <>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                    color: Colors.text,
                  }}
                >
                  All Submitted
                </Text>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={100}
                  color={"#26b1bf"}
                />
              </>
            ) : (
              <>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                    color: Colors.text,
                    marginBottom: 20,
                  }}
                >
                  नवीन १५ मार्क्स टेस्ट!
                </Text>
                <TouchableOpacity
                  style={{ ...styles.button, width: "100%" }}
                  activeOpacity={0.6}
                  onPress={() => {
                    selectQuiz(2);
                    setTabBarVisible(false);
                    setQuizStarted(true);
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>Start Now</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.primary,
    elevation: 5,
  },
  card: {
    borderRadius: 5,
    padding: 15,
    paddingVertical: 25,
    elevation: 5,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
  },
  quesContainer: {
    borderColor: Colors.primary,
    backgroundColor: "#fff",
    elevation: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 10,
  },
  quesText: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(23, 207, 227, 0.3)",
    marginTop: 10,
  },
  filledCircle: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  circle: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default RecentQuiz;