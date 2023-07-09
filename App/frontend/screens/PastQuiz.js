import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  BackHandler,
} from "react-native";
import axios from "axios";
import AuthContext from "../auth/context";
import Colors from "../constants/Colors";
import CustomHeader from "../components/CustomHeader";
import Loader from "../components/Loader";
import baseUrl from "../baseUrl";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const PastQuiz = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [allQuizData, setAllQuizdata] = useState([]);
  const [activeTag, setActiveTag] = useState("");
  const [tagDetails, setTagDetails] = useState([]);
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [allQuiz, setAllQuiz] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [title, setTitle] = useState("");
  const customNavigation = useNavigation();
  const { token } = useContext(AuthContext);
  const scrollRef = useRef();

  // function handleBackButtonClick() {
  //   customNavigation.goBack();
  //   return true;
  // }

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener(
  //       "hardwareBackPress",
  //       handleBackButtonClick
  //     );
  //   };
  // }, []);

  useFocusEffect(
    useCallback(() => {
      // fetchData();
      fetchAllData();
    }, [])
  );
  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/quizData`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     console.log(response.data);
  //     setData(response.data);
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //     setIsLoading(false);
  //   }
  // };

  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/quizData/submitted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data);
      setAllQuizdata(response.data);
      const all = [];
      response.data.forEach((element) => {
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

  const Card = ({ item, title }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginLeft: 10,
          marginVertical: 4,
          width: viewAll ? "45%" : 210,
        }}
      >
        <View
          style={{
            ...styles.card,
            width: "100%",
            alignItems: "center",
          }}
        >
          <>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                color: Colors.text,
                marginBottom: 20,
                marginTop: 10,
                color: "#000",
              }}
            >
              {item.quizTitle}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 12, color: "#000" }}>
                Time: {item.maxMarks == 100 ? 90 : item.maxMarks} min
              </Text>
              <Text style={{ marginLeft: 16, fontSize: 12, color: "#000" }}>
                Marks: {item.maxMarks}
              </Text>
            </View>
            <TouchableOpacity
              style={{ ...styles.button, width: "100%", elevation: 9 }}
              activeOpacity={0.6}
              onPress={() => {
                customNavigation.navigate("QuizDetails", { quiz: item });
              }}
            >
              <Text style={{ color: "#fff", fontSize: 14 }}>View details</Text>
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
              <Text style={{ marginRight: 4, color: "#000" }}>View All</Text>
              <Icon
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
      </View>
    );
  };
  return (
    <>
      <View style={styles.container}>
        {/* <CustomHeader title="Details" isBack navigation={navigation} /> */}
        {/* <View
          style={{
            width: "100%",
            backgroundColor: "#084347",
            paddingVertical: 14,
            paddingLeft: 12,
            paddingTop: 30,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              paddingHorizontal: 12,
              alignSelf: "flex-start",
            }}
          >
            Past Quiz
          </Text>
        </View> */}
        {isLoading ? (
          <Loader />
        ) : (
          // <ScrollView
          //   style={{ width: "100%", marginBottom: 50 }}
          //   contentContainerStyle={{
          //     alignItems: "center",
          //   }}
          // >
          //   {/* {data.map((item, index) => (
          //     <TouchableOpacity
          //       key={index}
          //       style={styles.cardContainer}
          //       activeOpacity={0.7}
          //       onPress={() =>
          //         navigation.navigate("QuizDetailScreen", { quiz: item })
          //       }
          //     >
          //       <View style={styles.cardHeader}>
          //         <Text style={styles.cardTitle}>{item.quizTitle}</Text>
          //         <Text style={styles.cardText}>
          //           {new Date(item.createdAt).toLocaleString()}
          //         </Text>
          //       </View>
          //     </TouchableOpacity>
          //   ))} */}
          // </ScrollView>
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
                  <Icon name="arrow-back" size={25} />
                </TouchableOpacity>
                <Text style={[styles.title, { marginLeft: 20, color: "#000" }]}>
                  {title} Tests
                </Text>
              </View>
            ) : (
              false && (
                <ScrollView
                  horizontal
                  style={{
                    maxHeight: 60,
                    minHeight: 60,
                    paddingHorizontal: 12,
                  }}
                  contentContainerStyle={{ alignItems: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setActiveTag("all");
                      setTagDetails(allCategoryData);
                    }}
                    style={[
                      styles.tag,
                      {
                        backgroundColor:
                          activeTag == "all" ? "#90AAD5" : "white",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        alignSelf: "center",
                        verticalAlign: "middle",
                        color: "#000",
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
                            color: "#000",
                          }}
                        >
                          {item.tag}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )
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

                        <Icon
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

                        <Icon
                          name="search-circle-outline"
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
                          No Quizzes Submitted yet
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // paddingBottom: 100,
    // backgroundColor: "#fff",
  },

  // cardContainer: {
  //   backgroundColor: "#fff",
  //   width: "90%",
  //   marginVertical: 10,
  //   borderRadius: 10,
  //   shadowColor: "#000",
  //   shadowOpacity: 0.2,
  //   shadowRadius: 10,
  //   shadowOffset: { width: 0, height: 2 },
  //   borderWidth: 1,
  //   borderColor: Colors.primary,
  //   elevation: 5,
  // },
  cardHeader: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  cardBody: {
    padding: 20,
  },
  cardText: {
    fontSize: 16,
    marginTop: 10,
    color: "gray",
  },
  cardFooter: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
    color: "#000",
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
    backgroundColor: "#777777",
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
});

export default PastQuiz;
