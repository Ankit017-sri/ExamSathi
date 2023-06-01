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
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import CustomHeader from "../components/CustomHeader";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Constants from "expo-constants";
import QuesCard from "../components/QuesCard";
import CompletedQuesCard from "../components/CompletedQuesCard";
import Colors from "../constants/Colors";
import baseUrl from "../baseUrl";
import axios from "axios";
import AuthContext from "../auth/context";
import { useFocusEffect } from "@react-navigation/native";
import { io } from "socket.io-client";
import ChatContext from "../chat/context";
import { attempting, online } from "../utilities/getNumbers";

// const questions = [
//   {
//     qNo: 1,
//     ques: "Question 1",
//     op1: "Option 1",
//     op2: "Option 2",
//     op3: "Option 3",
//     op4: "Option 4",
//     correctOp: "2",
//   },
//   {
//     qNo: 2,
//     ques: "Question 2",
//     op1: "Option 1",
//     op2: "Option 2",
//     op3: "Option 3",
//     op4: "Option 4",
//     correctOp: "3",
//   },
//   {
//     qNo: 3,
//     ques: "Question 2",
//     op1: "Option 1",
//     op2: "Option 2",
//     op3: "Option 3",
//     op4: "Option 4",
//     correctOp: "3",
//   },
//   {
//     qNo: 4,
//     ques: "Question 2",
//     op1: "Option 1",
//     op2: "Option 2",
//     op3: "Option 3",
//     op4: "Option 4",
//     correctOp: "4",
//   },
// {
//   qNo: 5,
//   ques: "Question 2",
//   op1: "Option 1",
//   op2: "Option 2",
//   op3: "Option 3",
//   op4: "Option 4",
//   correctOp: "Option 3",
// },
// {
//   qNo: 6,
//   ques: "Question 2",
//   op1: "Option 1",
//   op2: "Option 2",
//   op3: "Option 3",
//   op4: "Option 4",
//   correctOp: "Option 3",
// },
// {
//   qNo: 7,
//   ques: "Question 2",
//   op1: "Option 1",
//   op2: "Option 2",
//   op3: "Option 3",
//   op4: "Option 4",
//   correctOp: "Option 3",
// },
// Add more questions here
// ];

const RevisionQuizScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions.length).fill(null)
  );
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [nextTime, setNextTime] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [isDiscuss, setIsDiscuss] = useState(false);
  const [memCount, setMemCount] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [randomNums, setRandomNums] = useState({ attempting: 0, online: 0 });

  const { token, Id } = useContext(AuthContext);

  // console.log(randomNums);

  const socket = useRef();
  // const ref = useRef();
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

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

  function fetchCounts() {
    axios
      .get(`${baseUrl}/auth/users/count`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        setMemCount(data.data[0].count);
      })
      .catch((e) => console.log(e));
  }

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
      fetchCounts();
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
    setShowCorrectAnswer(true);
    setTimeout(() => {
      if (shouldMove) {
        setShowCorrectAnswer(false);
        moveToNextQuestion();
      }
    }, 2000); // Wait for 2 seconds after showing correct answer
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsQuizStarted(false);
      setCurrentQuestionIndex(0);
      setIsSubmitted(true);
      setIsDiscuss(true);
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

  return (
    <>
      <CustomHeader
        title="Revision"
        share
        // sub={`${memCount} members, ${len} online`}
      />
      {!isQuizStarted && isDiscuss && (
        <View style={{ padding: 4, backgroundColor: "#fff" }}>
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
        <View style={{ padding: 4, backgroundColor: "#fff" }}>
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
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              पुढची revision{" "}
              {nextTime.split(" ")[1] !== "undefined"
                ? nextTime.split(" ")[1]
                : ""}{" "}
              संध्याकाळी {nextTime.split(" ")[0]} वाजता
            </Text>
          </View>
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
              <Text style={{}}>
                {questions[0]?.testName}
                तुमच्यासोबत{" "}
                <Text style={{ color: "red" }}>{randomNums?.online}</Text> लोकं
                सोडवत आहेत
              </Text>
            )}
          </View>
        </View>
      )}
      <ScrollView
        style={{
          marginBottom: 50,
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
    </>
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
