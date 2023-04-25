import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
// import { FlashList } from "@shopify/flash-list";
import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  BackHandler,
  Alert,
  ScrollView,
} from "react-native";

import AuthContext from "../auth/context";
import baseUrl from "../baseUrl";
import CustomHeader from "../components/CustomHeader";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
// import QuesCard from "../components/QuesCard";
import Colors from "../constants/Colors";

const RecentQuiz = ({ navigation }) => {
  const [response, setResponse] = useState([]);
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizData, setQuizData] = useState([]);
  // const [data15, setData15] = useState([]);
  // const [data100, setData100] = useState([]);
  // const [dataCurrAffair, setDataCurrAffair] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  // const [is15Submitted, setIs15Submitted] = useState(false);
  // const [is100Submitted, setIs100Submitted] = useState(false);
  // const [isCurrAffairSubmitted, setIsCurrAffairSubmitted] = useState(false);
  const [quizType, setQuizType] = useState(0);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [selected, setSelected] = useState([]);
  // const [dataPyq, setDataPyq] = useState([]);
  // const [isPyqSubmitted, setIsPyqSubmitted] = useState(false);
  // const [lastAttempted, setLastAttempted] = useState(-1);
  const [viewAll, setViewAll] = useState(false);
  const [title, setTitle] = useState("");
  const SampleArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [allQuiz, setAllQuiz] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  // const [latest15All, setLatest15All] = useState([]);
  // const [latest15Feed, setLatest15Feed] = useState([]);
  // const [currentAffairsAll, setCurrentAffairsAll] = useState([]);
  // const [currentAffairsFeed, setCurrentAffairsFeed] = useState([]);
  // const [PYQAll, setPYQAll] = useState([]);
  // const [PYQFeed, setPYQFeed] = useState([]);
  // const [latest100All, setLatest100All] = useState([]);
  // const [latest100Feed, setLatest100Feed] = useState([]);

  const [allQuizData, setAllQuizdata] = useState([]);
  const [activeTag, setActiveTag] = useState("");
  const [tagDetails, setTagDetails] = useState([]);
  const [allCategoryData, setAllCategoryData] = useState([]);

  const scrollList = useRef();

  const handleNext = () => {
    scrollList.current.scrollToOffset({ animated: false, offset: 0 });
    setPage(page + 1);
  };
  const handlePrev = () => {
    scrollList.current.scrollToOffset({ animated: false, offset: 0 });
    setPage(page - 1);
  };

  const { token, setTabBarVisible } = useContext(AuthContext);
  const scrollRef = useRef();

  // const getPyq = async () => {
  //   setLoading(true);
  //   const resultPyq = await axios.get(
  //     `${baseUrl}/quizData/pyq`,

  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   setIsPyqSubmitted(false);
  //   if (resultPyq.data.length === 0) {
  //     setIsPyqSubmitted(true);
  //     setLoading(false);
  //   }
  //   setDataPyq(...resultPyq.data);
  //   if (resultPyq.data.length !== 0) {
  //     setLoading(false);
  //     setQuizData(...resultPyq.data);
  //     setLastPage(resultPyq.data[0].quizDetails.length / 2);
  //     var arr = Array(resultPyq.data[0].quizDetails.length).fill(-1);
  //     setSelected(arr);
  //     setTabBarVisible(false);
  //     setQuizStarted(true);
  //   }
  //   setLoading(false);
  // };

  // const getData15 = async () => {
  //   setLoading(true);
  //   const result15 = await axios.get(
  //     `${baseUrl}/quizData/latest`,

  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   setIs15Submitted(false);
  //   if (result15.data.length === 0) {
  //     setIs15Submitted(true);
  //     setLoading(false);
  //   }
  //   setData15(...result15.data);
  //   if (result15.data.length !== 0) {
  //     setLoading(false);
  //     setLastAttempted(2);
  //     setQuizData(...result15.data);
  //     setLastPage(result15.data[0].quizDetails.length / 2);
  //     var arr = Array(result15.data[0].quizDetails.length).fill(-1);
  //     setSelected(arr);
  //     setTabBarVisible(false);
  //     setQuizStarted(true);
  //   }
  //   setLoading(false);
  // };

  // const getData15All = async () => {
  //   setLoading(true);
  //   const result15All = await axios.get(
  //     `${baseUrl}/quizData/latest/all`,

  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   if (result15All.data) {
  //     console.log(result15All.data.length);
  //     setLatest15All(result15All.data);
  //     setLatest15Feed(result15All.data.slice(0, 10));
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //   }
  // };

  // const getData100All = async () => {
  //   setLoading(true);
  //   const result100All = await axios.get(
  //     `${baseUrl}/quizData/latest/long/all`,

  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   if (result100All.data) {
  //     console.log(result100All.data.length);
  //     setLatest100All(result100All.data);
  //     setLatest100Feed(result100All.data.slice(0, 10));
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //   }
  // };
  // const getDataCurrAfAll = async () => {
  //   setLoading(true);
  //   const resultCurrAfAll = await axios.get(
  //     `${baseUrl}/quizData/latest/current-affairs/all`,

  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   if (resultCurrAfAll.data) {
  //     console.log(resultCurrAfAll.data.length);
  //     setCurrentAffairsAll(resultCurrAfAll.data);
  //     setCurrentAffairsFeed(resultCurrAfAll.data.slice(0, 10));
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //   }
  // };
  // const getDataPyqAll = async () => {
  //   setLoading(true);
  //   const resultPyqAll = await axios.get(
  //     `${baseUrl}/quizData//pyq/all`,

  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   if (resultPyqAll.data) {
  //     console.log(resultPyqAll.data.length);
  //     setPYQAll(resultPyqAll.data);
  //     setPYQFeed(resultPyqAll.data.slice(0, 10));
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //   }
  // };
  const appShareCount = async () => {
    try {
      const res = await axios.put(
        `${baseUrl}/auth/app/share`,
        { screen: 2 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const startQuiz = async (quizId) => {
    setLoading(true);
    const quizDetails = await axios.get(
      `${baseUrl}/quizData/quiz/${quizId}`,

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(quizDetails.data);
    setLoading(false);
    setQuizData(quizDetails.data);
    setLastPage(quizDetails.data.quizDetails.length / 2);
    var arr = Array(quizDetails.data.quizDetails.length).fill(-1);
    setSelected(arr);
    setTabBarVisible(false);
    setQuizStarted(true);
  };

  // const getData100 = async () => {
  //   setLoading(true);
  //   const result100 = await axios.get(
  //     `${baseUrl}/quizData/latest/long`,

  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   if (result100.data.length === 0) {
  //     setIs100Submitted(true);
  //     setLoading(false);
  //   }
  //   setData100(...result100.data);
  //   if (result100.data.length !== 0) {
  //     setLoading(false);
  //     setQuizData(...result100.data);
  //     setLastPage(result100.data[0].quizDetails.length / 2);
  //     var arr = Array(result100.data[0].quizDetails.length).fill(-1);
  //     setSelected(arr);
  //     setTabBarVisible(false);
  //     setQuizStarted(true);
  //   }
  //   setLoading(false);
  // };

  // const getDataCurr = async () => {
  //   setLoading(true);
  //   const resultcurrAffairs = await axios.get(
  //     `${baseUrl}/quizData/latest/current-affairs`,

  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   if (resultcurrAffairs.data.length === 0) {
  //     setIsCurrAffairSubmitted(true);
  //     setLoading(false);
  //   }
  //   setDataCurrAffair(...resultcurrAffairs.data);
  //   if (resultcurrAffairs.data.length !== 0) {
  //     setLoading(false);
  //     setQuizData(...resultcurrAffairs.data);
  //     setLastPage(resultcurrAffairs.data[0].quizDetails.length / 2);
  //     var arr = Array(resultcurrAffairs.data[0].quizDetails.length).fill(-1);
  //     setSelected(arr);
  //     setTabBarVisible(false);
  //     setQuizStarted(true);
  //   }
  //   setLoading(false);
  // };

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
    // console.log("-------------------------------------------------");
    // console.log("response......", response);
    // console.log(quizData.quizDetails);
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
        setResponse([]);
        setPage(0);
        // let newAll;
        // switch (title) {
        //   case "नवीन मागील वर्षाची टेस्ट!":
        //     newAll = PYQAll.filter((data) => data._id !== quizData._id);
        //     setPYQAll(newAll);
        //     setPYQFeed(newAll.slice(0, 10));
        //     break;
        //   case "नवीन १५ मार्क्स टेस्ट!":
        //     newAll = latest15All.filter((data) => data._id !== quizData._id);
        //     setLatest15All(newAll);
        //     setLatest15Feed(newAll.slice(0, 10));
        //     break;
        //   case "नवीन १०० मार्क्स टेस्ट!":
        //     newAll = latest100All.filter((data) => data._id !== quizData._id);
        //     setLatest100All(newAll);
        //     setLatest100Feed(newAll.slice(0, 10));

        //     break;
        //   case "Latest चालू घडामोडी टेस्ट!":
        //     newAll = currentAffairsAll.filter(
        //       (data) => data._id !== quizData._id
        //     );
        //     setCurrentAffairsAll(newAll);
        //     setCurrentAffairsFeed(newAll.slice(0, 10));
        //     break;
        // default:
        //   break;
        // }

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
  // useEffect(() => {
  //   getDataPyqAll();
  //   getData15All();
  //   getData100All();
  //   getDataCurrAfAll();
  // }, []);

  const getAllQuiz = async () => {
    try {
      const data = await axios.get(
        `${baseUrl}/quizData/all`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("data ......", data.data);
      setAllQuizdata(data.data);
      const all = [];
      data.data.forEach((element) => {
        all.push(...element.categories);
      });
      setAllCategoryData(all);
      setActiveTag("all");
      setTagDetails(all);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllQuiz();
    }, [])
  );

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

  // const TriangleCorner = () => {
  //   return <View style={[styles.triangleCorner]} />;
  // };
  const Card = ({ item, title }) => {
    return (
      <View style={{ flexDirection: "row", marginLeft: 10, marginVertical: 4 }}>
        <View
          style={{
            ...styles.card,
            // width: "45%",
            width: viewAll ? 180 : 210,
            alignItems: "center",
          }}
        >
          <>
            {/* {!viewAll && (
              <>
                <TriangleCorner />
                <Text
                  style={{
                    textAlign: "left",
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#990011FF",
                    position: "absolute",
                    width: 120,
                    top: 6,
                    left: 4,
                    zIndex: 30,
                  }}
                >
                  New
                </Text>
              </>
            )} */}
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: Colors.text,
                marginBottom: 20,
                marginTop: 10,
                // transform: [{ rotateZ: "45deg" }]
              }}
            >
              {/* नवीन मागील वर्षाची टेस्ट! */}
              {item.quizTitle}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text>Time: {item.maxMarks == 100 ? 90 : item.maxMarks} min</Text>
              <Text style={{ marginLeft: 16 }}>Marks: {item.maxMarks}</Text>
            </View>
            <TouchableOpacity
              style={{ ...styles.button, width: "100%" }}
              activeOpacity={0.6}
              onPress={() => {
                setTitle(title);
                startQuiz(item._id);
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Start Test</Text>
            </TouchableOpacity>
          </>
        </View>
      </View>
    );
  };

  const TestLists = ({ data, title }) => {
    return (
      <View
        style={{
          padding: 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10,
          }}
        >
          <Text style={styles.title}>{title}</Text>
          {data?.length > 1 && (
            <TouchableOpacity
              onPress={() => {
                setAllQuiz(data);
                setTitle(title);
                scrollRef.current.scrollTo({ y: 0, animated: false });
                setViewAll(true);
              }}
              style={{ flexDirection: "row" }}
            >
              <Text style={{ marginRight: 4 }}>View All</Text>
              <Ionicons
                name="chevron-forward-circle-outline"
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
        {data && (
          <FlatList
            renderItem={({ item }) => <Card item={item} title={title} />}
            data={data.slice(0, 10)}
            keyExtractor={(item) => item._id}
            horizontal
          />
        )}
        {data?.length == 0 && (
          <View
            style={{
              flexDirection: "row",
              marginBottom: 20,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                ...styles.card,
                width: "80%",
                alignItems: "center",
                // marginRight: 15,
                // marginTop: -10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: Colors.text,
                }}
              >
                {title}
              </Text>

              <Ionicons
                name="checkmark-circle-outline"
                size={50}
                color={"#26b1bf"}
              />
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
            </View>
          </View>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <CustomHeader
        title="New Quiz"
        share={true}
        appShareCount={appShareCount}
      />
      {loading || isloading ? (
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
            {/* <FlashList
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
            /> */}

            <Pagination
              data={quizData.quizDetails}
              onSelect={onSelect}
              page={page}
              selected={selected}
              setSelected={setSelected}
              scrollList={scrollList}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                ...styles.button,
                paddingHorizontal: 30,
                alignSelf: "center",
                height: 40,
                backgroundColor: isSubmitting ? "#aaa" : Colors.primary,
                marginHorizontal: 10,
              }}
              activeOpacity={0.6}
              onPress={() => submitHandler()}
              disabled={isSubmitting}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                Submit
              </Text>
            </TouchableOpacity>
            {page < lastPage - 1 ? (
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                {page !== 0 && (
                  <TouchableOpacity
                    onPress={handlePrev}
                    disabled={isSubmitting}
                    style={{ marginRight: 20 }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="chevron-back-outline"
                        size={25}
                        color={Colors.primary}
                      />{" "}
                      Prev
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={handleNext} disabled={isSubmitting}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      justifyContent: "center",
                    }}
                  >
                    Next
                    <Ionicons
                      name="chevron-forward-outline"
                      size={25}
                      color={Colors.primary}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 6,
                }}
              >
                <TouchableOpacity
                  onPress={handlePrev}
                  disabled={isSubmitting}
                  // style={{ marginBottom: 6 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      justifyContent: "center",
                      marginRight: 20,
                    }}
                  >
                    <Ionicons
                      name="chevron-back-outline"
                      size={25}
                      color={Colors.primary}
                    />{" "}
                    Prev
                  </Text>
                </TouchableOpacity>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      justifyContent: "center",
                    }}
                  >
                    Next
                    <Ionicons
                      name="chevron-forward-outline"
                      size={25}
                      color="grey"
                    />
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={{ flex: 0.9 }}>
          {viewAll ? (
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "space-between",
                paddingVertical: 4,
                paddingHorizontal: 6,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setViewAll(false);
                  scrollRef.current.scrollTo({ y: 0, animated: false });
                }}
              >
                <Ionicons name="arrow-back" size={25} />
              </TouchableOpacity>
              <Text style={[styles.title, { marginLeft: 20 }]}>
                {title} Tests
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              style={{ maxHeight: 60, minHeight: 60, paddingHorizontal: 12 }}
              contentContainerStyle={{ alignItems: "center" }}
            >
              <TouchableOpacity
                onPress={() => {
                  setActiveTag("all");
                  setTagDetails(allCategoryData);
                }}
                style={[
                  styles.tag,
                  { backgroundColor: activeTag == "all" ? "#90AAD5" : "white" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    alignSelf: "center",
                    verticalAlign: "middle",
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>
              {allQuizData.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.tag,
                      {
                        backgroundColor:
                          activeTag == item.tag ? "#90AAD5" : "white",
                      },
                    ]}
                    onPress={() => {
                      setActiveTag(item.tag);
                      setTagDetails(item.categories);
                    }}
                    key={index}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        alignSelf: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
          <ScrollView style={{ paddingTop: 8 }} ref={scrollRef}>
            {viewAll ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                {allQuiz.map((item, index) => {
                  return <Card item={item} key={index} />;
                })}
                {allQuiz.length == 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 20,
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        ...styles.card,
                        width: "90%",
                        alignItems: "center",
                        // marginRight: 15,
                        marginHorizontal: 20,
                        // marginTop: -10,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: "bold",
                          color: Colors.text,
                        }}
                      >
                        {title}
                      </Text>

                      <Ionicons
                        name="checkmark-circle-outline"
                        size={50}
                        color={"#26b1bf"}
                      />
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
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <>
                {/* <TestLists data={PYQFeed} title={"नवीन मागील वर्षाची टेस्ट!"} />
                <TestLists
                  data={latest15Feed}
                  title={"नवीन १५ मार्क्स टेस्ट!"}
                />
                <TestLists
                  data={latest100Feed}
                  title={"नवीन १०० मार्क्स टेस्ट!"}
                />
                <TestLists
                  data={currentAffairsFeed}
                  title={"Latest चालू घडामोडी टेस्ट!"}
                /> */}

                {tagDetails.map((quiz, index) => {
                  return (
                    <TestLists
                      data={quiz.quizzes}
                      title={quiz.category}
                      key={index}
                    />
                  );
                })}
                {tagDetails?.length == 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 20,
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        ...styles.card,
                        width: "80%",
                        alignItems: "center",
                        // marginRight: 15,
                        // marginTop: -10,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: "bold",
                          color: Colors.text,
                        }}
                      >
                        {title}
                      </Text>

                      <Ionicons
                        name="checkmark-circle-outline"
                        size={50}
                        color={"#26b1bf"}
                      />
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 20,
                          fontWeight: "bold",
                          color: Colors.text,
                        }}
                      >
                        Submitted All Quizzes
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}

            {/* <View style={styles.cardContainer}> */}
            {/* previous year test card  */}
            {/* {isPyqSubmitted ? (
                <View style={{ flexDirection: "row", marginBottom: 20 }}>
                  <View
                    style={{
                      ...styles.card,
                      width: "45%",
                      alignItems: "center",
                      // marginRight: 15,
                      marginTop: -10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 18,
                        fontWeight: "bold",
                        color: Colors.text,
                      }}
                    >
                      नवीन मागील वर्षाची टेस्ट!
                    </Text>

                    <Ionicons
                      name="checkmark-circle-outline"
                      size={50}
                      color={"#26b1bf"}
                    />
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
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: "row", marginBottom: 20 }}>
                  <View
                    style={{
                      ...styles.card,
                      width: "45%",
                      alignItems: "center",
                      marginRight: 15,
                    }}
                  >
                    <>
                      <TriangleCorner />
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#990011FF",
                          position: "absolute",
                          width: 120,
                          top: 6,
                          left: 4,
                          zIndex: 30,
                        }}
                      >
                        New
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: "bold",
                          color: Colors.text,
                          marginBottom: 20,
                          marginTop: 20,
                          // transform: [{ rotateZ: "45deg" }]
                        }}
                      >
                        नवीन मागील वर्षाची टेस्ट!
                      </Text>
                      <TouchableOpacity
                        style={{ ...styles.button, width: "100%" }}
                        activeOpacity={0.6}
                        onPress={() => {
                          getPyq();
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 16 }}>
                          Start Now
                        </Text>
                      </TouchableOpacity>
                    </>
                  </View>
                </View>
              )} */}
            {/* ----------------------------------------- */}
            {/* <View style={{ flexDirection: "row", marginBottom: 20 }}> */}
            {/* <View
                  style={{
                    ...styles.card,
                    width: "45%",
                    alignItems: "center",
                    marginRight: 15,
                  }}
                >
                  {is100Submitted ? (
                    <>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: "bold",
                          color: Colors.text,
                        }}
                      >
                        नवीन १०० मार्क्स टेस्ट!
                      </Text>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={50}
                        color={"#26b1bf"}
                      />
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
                          getData100();
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 16 }}>
                          Start Now
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View> */}
            {/* <View
                  style={{
                    ...styles.card,
                    width: "45%",
                    alignItems: "center",
                  }}
                >
                  {isCurrAffairSubmitted ? (
                    <>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: "bold",
                          color: Colors.text,
                        }}
                      >
                        Latest चालू घडामोडी टेस्ट!
                      </Text>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={50}
                        color={"#26b1bf"}
                      />
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
                          getDataCurr();
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 16 }}>
                          Start Now
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View> */}
            {/* <View
                style={{ ...styles.card, width: "45%", alignItems: "center" }}
              >
                {is15Submitted ? (
                  <>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 18,
                        fontWeight: "bold",
                        color: Colors.text,
                      }}
                    >
                      नवीन १५ मार्क्स टेस्ट!
                    </Text>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={50}
                      color={"#26b1bf"}
                    />
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
                        getData15();
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 16 }}>
                        Start Now
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View> */}
            {/* </View> */}
          </ScrollView>
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
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
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
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 90,
    borderTopWidth: 60,
    borderRightColor: "transparent",
    borderTopColor: "#FCF6F5FF",
    zIndex: 20,
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
  },
  listContainer: {
    elevation: 10,
  },
  tag: {
    marginHorizontal: 4,
    elevation: 5,
    borderRadius: 12,
    paddingTop: 4,
    height: 30,
    minWidth: 80,
    maxWidth: 120,
  },
});

export default RecentQuiz;
