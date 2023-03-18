import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import AuthContext from "../auth/context";
import baseUrl from "../baseUrl";
import CompletedQuesCard from "../components/CompletedQuesCard";
import CustomHeader from "../components/CustomHeader";
import Loader from "../components/Loader";
import Colors from "../constants/Colors";

const QuizDetails = ({ navigation }) => {
  const data = navigation.getState().routes[1].params.quiz;

  console.log(navigation.getState().routes[1].params.quiz._id);

  const [loading, setLoading] = useState(false);
  const [submittedQuizData, setSubmittedQuizData] = useState([]);

  const { token } = useContext(AuthContext);

  const getData = async () => {
    setLoading(true);

    const res = await axios.get(`${baseUrl}/submitQuiz/get/${data._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.length === 0) setSubmittedQuizData([]);
    else setSubmittedQuizData(res.data[0].submittedQuizDetails);

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const getScore = () => {
    let score = 0;

    data.quizDetails.map((data) => {
      const foundObject = submittedQuizData.find(
        (e) => e.quesIndex === data.qNo - 1
      );

      if (foundObject?.value === data.correctOp) score++;
    });

    return score;
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Details" isBack navigation={navigation} />
      {loading ? (
        <Loader />
      ) : (
        <ScrollView style={{ marginBottom: 35 }}>
          <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "#26b1bf",
              }}
            >
              Score: {getScore()} / {data.quizDetails.length}
            </Text>
          </View>
          {data.quizDetails.map((data, index) => {
            return (
              <CompletedQuesCard
                quesData={data}
                submittedQuizData={submittedQuizData}
                navigation={navigation}
                key={index}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  quesContainer: {
    // borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: "#fff",
    elevation: 5,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 10,
  },
  quesText: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(23, 207, 227, 0.3)",
    marginTop: 10,
  },
});

export default QuizDetails;
