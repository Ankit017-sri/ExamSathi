import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedbackBase,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Constants from "../constants/index";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { io } from "socket.io-client";

import CustomHeader from "../components/CustomHeader";
import QuesCard from "../components/QuesCard";
import CompletedQuesCard from "../components/CompletedQuesCard";
import Colors from "../constants/Colors";
import baseUrl from "../baseUrl";
import AuthContext from "../auth/context";
import cache from "../utilities/cache";

const RevisionQuizScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions.length).fill(null)
  );
  const [quizFinished, setQuizFinished] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [nextTime, setNextTime] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [isDiscuss, setIsDiscuss] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [randomNums, setRandomNums] = useState({ attempting: 0, online: 0 });
  const [score, setScore] = useState(0);
  const customNavigation=useNavigation();

  const { token, Id } = useContext(AuthContext);

  const socket = useRef();
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const shareMessage = `मित्रा, हे app डाउनलोड कर आणि ग्रुप मध्ये जॉईन हो! तलाठी, दारूबंदी पोलिस, वनरक्षक आणि इतर भरतीच्या तयारी साठी खूप उपयुक्त आहे. ह्यात दररोज Live revision टेस्ट, भरपूर free टेस्ट सिरीज आणि discussion ग्रुप आहेत. 
  Exam Sathi app
https://bit.ly/exam-sathi-app-playstore`;
  const whatsappUrl = `whatsapp://send?text=${shareMessage}`;

  const appShareCount = () => {
    try {
      axios.put(
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
    let url = `whatsapp://send?text=" + ${shareMessage}`;
    Linking.openURL(url)
      .then((data) => {
        console.log("WhatsApp Opened successfully " + data); //<---Success
      })
      .catch(() => {
        alert("Make sure WhatsApp installed on your device"); //<---Error
      });
    // try {
    //   Linking.openURL(whatsappUrl)
    //     .then((data) => {
    //       console.log("WhatsApp Opened successfully " + data); //<---Success
    //     })
    //     .catch(() => {
    //       alert("Make sure WhatsApp installed on your device"); //<---Error
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const getNumbers = async () => {
    const nums = await axios.get(`${baseUrl}/revision/numbers`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setRandomNums(nums.data);
  };

  const getCurrQueIndex = async () => {
    const res = await axios
      .get(`${baseUrl}/revision/liveQue`, {
        headers: { Authorization: "Bearer " + token },
      })
      .catch((e) => console.log(e));
    // console.log(res.data);
    if (res?.data.indexOfQue) {
      setCurrentQuestionIndex(res.data.indexOfQue);
      setQuizFinished(false);
      setIsQuizStarted(true);
      setIsSubmitted(false);
    } else {
      setIsQuizStarted(false);
      setQuizFinished(true);
    }
  };

  const fetchQues = async () => {
    await axios
      .get(`${baseUrl}/revision/ques`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // console.log(res.data.length);
        setSelectedOptions(Array(res.data.length).fill(null));
        setQuestions(res.data);
      })
      .catch((e) => console.log(e));
  };

  const joinWpGrp = async () => {
    try {
      const supported = await Linking.canOpenURL("https://bit.ly/wa-group-app");

      if (supported) {
        await Linking.openURL("https://bit.ly/wa-group-app");
      } else {
        console.log(
          `Unable to open WhatsApp URL: ${"https://bit.ly/wa-group-app"}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQues();
      getCurrQueIndex();
    }, [])
  );

  useEffect(() => {
    if (currentQuestionIndex === questions.length && questions.length > 0) {
      setQuizFinished(true);
    } else if (isQuizStarted) {
      startTimer();
      getNumbers();
      return () => {
        clearInterval(interval);
      };
    }
  }, [currentQuestionIndex, isQuizStarted]);

  useEffect(() => {
    const timesOfDay = ["18:00:00", "19:00:00", "20:00:00", "21:00:00"];
    const timesForRemovingDiscuss = [
      "18:35:00",
      "19:35:00",
      "20:35:00",
      "21:35:00",
    ];

    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const nextNearestTime =
        timesOfDay.find((time) => time > currentTime) ||
        timesOfDay[0] + " उद्या";

      setNextTime(
        nextNearestTime.split(":")[0] -
          12 +
          " " +
          nextNearestTime.split(":")[2].split(" ")[1]
      );

      if (timesOfDay.includes(currentTime)) {
        setIsQuizStarted(true);
        setQuizFinished(false);
        setIsSubmitted(false);
        console.log("Performing action at", currentTime);
      }

      if (timesForRemovingDiscuss.includes(currentTime)) {
        setIsDiscuss(false);
        console.log("Removing button at", currentTime);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleOptionPress = (_, optionIndex) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[currentQuestionIndex] = optionIndex;
    setSelectedOptions(updatedSelectedOptions);
    showCorrectAnswerAndMoveToNextQuestion();
  };

  const showCorrectAnswerAndMoveToNextQuestion = (shouldMove) => {
    setTimeout(() => {
      if (shouldMove) {
        moveToNextQuestion();
      }
    }, 2000); // Wait for 2 seconds after showing correct answer
  };

  const moveToNextQuestion = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsQuizStarted(false);
      setCurrentQuestionIndex(0);
      setIsSubmitted(true);
      setIsDiscuss(true);
      await cache.store("questions", questions);
      await cache.store("selectedOptions", selectedOptions);
      return setQuizFinished(true);
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  let interval;

  const startTimer = () => {
    var countDownDate = new Date().getTime() + 20 * 1000;

    interval = setInterval(() => {
      var now = new Date().getTime();
      const distance = countDownDate - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval);
        showCorrectAnswerAndMoveToNextQuestion(true);
      } else {
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
  };

  const sendFeedBack = async () => {
    const message = feedback.trimStart();
    const arr = message.split(" ");

    setFeedbacks([...feedbacks, message]);
    if (arr[0] === "") {
      return Alert.alert(
        "Feedback is Empty!",
        "please enter your feedback message!"
      );
    }
    Keyboard.dismiss();
    await axios
      .post(
        `${baseUrl}/feedback`,
        { feedback: message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .catch((e) => console.log(e));
    console.log("message");
    socket.current.emit("send-feedback", { feedback: message });
    setFeedback("");
    setIsFeedbackSent(true);
  };

  useEffect(() => {
    socket.current = io(baseUrl);
    socket.current.emit("new-user-add", { Id });
    // socket.current.on("get-active-users", (data) => {
    //   setLen(data);
    // });
    socket.current.on("receive-feedback", (data) => {
      setFeedbacks([...feedbacks, data]);
    });
  }, []);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  //console.log(score);

  console.log(isDiscuss);
  return (
    <View
      style={{
        backgroundColor: "white",
        // borderWidth: 2,
        flex: 1,
        height: Dimensions.get("window").height - 100,
        // alignItems: "center",
        // alignSelf: "center",
      }}
    >
      {/* <CustomHeader
        title="Revision"
        share
        // sub={`${memCount} members, ${len} online`}
      /> */}
      {!isQuizStarted && isDiscuss && (
        <View style={{ padding: 4, backgroundColor: "white" }}>
          <TouchableOpacity
            style={{
              borderRadius: 4,
              padding: 10,
              backgroundColor: "#acfabf",
              elevation: 5,
              borderColor: "#51f577",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
            activeOpacity={0.6}
            onPress={joinWpGrp}
          >
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              Discussion साठी जॉईन करा Whatsapp Group
            </Text>
            <Image
              source={require("../assets/WhatsApp.svg.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
      )}
      {!isQuizStarted && (
        <View
          style={{
            padding: 12,
            flex: 4,
            top: 250,
          }}
        >
          <View
            style={{
              borderRadius: 4,
              padding: 10,
              backgroundColor: "#a2ebfa",
              elevation: 5,
              borderColor: "#51f577",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{ textAlign: "center", fontWeight: "bold", color: "#000" }}
            >
              पुढची revision{" "}
              {nextTime.split(" ")[1] !== "undefined"
                ? nextTime.split(" ")[1]
                : ""}{" "}
              संध्याकाळी {nextTime.split(" ")[0]} वाजता आहे.
            </Text>
          </View>
          <TouchableOpacity
            style={{
              borderRadius: 4,
              padding: 10,
              marginTop: 10,
              backgroundColor: "#acfabf",
              elevation: 10,
              borderColor: "#51f577",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
            activeOpacity={0.6}
            onPress={Share}
          >
            <Image
              source={require("../assets/WhatsApp.svg.png")}
              style={{ width: 40, height: 40, marginRight: 5 }}
            />
            <Text
              style={{ textAlign: "center", fontWeight: "bold", color: "#000" }}
            >
              आता revision तुमच्या मित्रांबरोबर द्या.{"\n"} मित्रांसोबत
              देण्यासाठी Share करा
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 40,
              padding: 12,
              backgroundColor: "#1F6E8C",
              elevation: 5,
              marginTop: 20,
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={() => {
              customNavigation.navigate("Feedback");
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "white",
                paddingHorizontal: 25,
                color: "#fff",
              }}
            >
              आता तुमचे प्रश्न पण revision मध्ये येईल 😃 तुमचे प्रश्न, 4 options
              आणि बरोबर उत्तर पाठवा
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {!quizFinished && isQuizStarted && (
        <View style={{ backgroundColor: "#fff" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              padding: 10,
              backgroundColor: "#a2ebfa",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}
          >
            {timerMinutes === 0 && timerSeconds === 0 ? (
              <Text
                style={{ color: "#fc6d6d", fontSize: 15, fontWeight: "bold" }}
              >
                Next Question in 2 seconds
              </Text>
            ) : (
              <Text style={{ color: "#000" }}>
                {questions[0]?.testName}
                {"\n"}
                तुमच्यासोबत{" "}
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  {randomNums?.online}
                </Text>{" "}
                लोकं सोडवत आहेत
              </Text>
            )}
          </View>
        </View>
      )}
      <ScrollView
        style={{
          // marginBottom: 50,
          backgroundColor: "#fff",
        }}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {!quizFinished &&
          isQuizStarted &&
          questions.map(
            (que, index) =>
              index <= currentQuestionIndex && (
                <View>
                  {index === currentQuestionIndex ? (
                    <QuesCard
                      data={questions[currentQuestionIndex]}
                      quesNo={currentQuestionIndex + 1}
                      selected={selectedOptions}
                      setSelected={setSelectedOptions}
                      onSelect={handleOptionPress}
                      attempting={randomNums?.attempting}
                      isRevision
                      timeRemaining={
                        timerMinutes +
                        ":" +
                        (timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds)
                      }
                    />
                  ) : (
                    <CompletedQuesCard
                      quesData={que}
                      quesNo={index + 1}
                      selectedOp={selectedOptions[index]}
                      setScore={setScore}
                      score={score}
                    />
                  )}
                </View>
              )
          )}
        {quizFinished && isSubmitted && (
          <View>
            {questions.map((question, index) => (
              <CompletedQuesCard
                quesData={question}
                selectedOp={selectedOptions[index]}
                quesNo={index + 1}
              />
            ))}
            {/* <View>
              <Text>Result</Text>
            </View> */}
            <FlatList
              style={{
                marginBottom: 20,
                marginTop: 10,
                paddingVertical: 10,
                marginHorizontal: 20,
              }}
              data={feedbacks}
              // ref={ref}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    ...styles.card,
                    marginBottom: 10,
                    paddingHorizontal: 6,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 6,

                      flex: 1,
                      // paddingVertical: 1,

                      fontSize: 16,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              )}
            />

            {!isFeedbackSent && (
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                  >
                    <View>
                      <Text style={{ marginHorizontal: 20 }}>
                        Send us your feedback
                      </Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          value={feedback}
                          multiline={true}
                          numberOfLines={3}
                          onChangeText={(text) => setFeedback(text)}
                          placeholder=" Type your feedback here..."
                        />
                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: Colors.primary,
                            borderRadius: 5,
                            height: 40,
                            width: "100%",
                            backgroundColor: "#90AAD5",
                            marginTop: 10,
                            marginBottom: 20,
                          }}
                          activeOpacity={0.6}
                          onPress={() => sendFeedBack()}
                        >
                          <Text
                            style={{
                              fontSize: 17,
                              color: Colors.primary,
                            }}
                          >
                            Send
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.93,
  },
  headerContainer: {
    width: "100%",
    height: 45 + Constants.statusBarHeight,
    backgroundColor: Colors.primary,
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
    color: "#fff",
    alignSelf: "center",
  },
  inputContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#17cfe3",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 5,
    padding: 15,
    // paddingVertical: 25,
    elevation: 5,
    backgroundColor: "#BCCCE5",
    justifyContent: "space-evenly",
  },
});

export default RevisionQuizScreen;
