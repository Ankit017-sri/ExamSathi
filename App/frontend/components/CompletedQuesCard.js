import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../constants/Colors";
import CompletedTestOptionCircle from "./CompletedTestOptionCircle";

const CompletedQuesCard = ({ quesData, submittedQuizData, navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const foundObject = submittedQuizData.find(
    (e) => e.quesIndex === quesData.qNo - 1
  );

  useEffect(() => {
    setSelectedOption(quesData.correctOp);
  });

  return (
    <View style={styles.quesContainer}>
      <Text style={styles.quesText}>
        <Text style={{ fontWeight: "bold" }}>{quesData.qNo})</Text>{" "}
        {quesData.ques}
      </Text>
      <Text style={styles.quesText}>{quesData.hindiQues}</Text>

      {!foundObject ? (
        <Text style={{ color: "red", fontWeight: "bold" }}>Not Attempted</Text>
      ) : foundObject.value == quesData.correctOp ? (
        <Text style={{ color: Colors.correctAns, fontWeight: "bold" }}>
          Attempted and Correct answer
        </Text>
      ) : (
        <Text style={{ color: "red", fontWeight: "bold" }}>
          Attempted and wrong answer
        </Text>
      )}
      <View style={styles.optionsContainer}>
        <View style={[styles.optionContainer]}>
          <CompletedTestOptionCircle
            selectedOption={selectedOption}
            num={1}
            attempted={foundObject?.value}
          />
          <Text style={styles.optionText}>{quesData.op1}</Text>
        </View>
        <View style={[styles.optionContainer]}>
          <CompletedTestOptionCircle
            selectedOption={selectedOption}
            num={2}
            attempted={foundObject?.value}
          />
          <Text style={styles.optionText}>{quesData.op2}</Text>
        </View>
        <View style={[styles.optionContainer]}>
          <CompletedTestOptionCircle
            selectedOption={selectedOption}
            num={3}
            attempted={foundObject?.value}
          />
          <Text style={styles.optionText}>{quesData.op3}</Text>
        </View>
        <View style={[styles.optionContainer]}>
          <CompletedTestOptionCircle
            selectedOption={selectedOption}
            num={4}
            attempted={foundObject?.value}
          />
          <Text style={styles.optionText}>{quesData.op4}</Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate("SolutionScreen", {
            exp: quesData.exp,
            ytLink: quesData.ytLink,
          })
        }
        style={{
          backgroundColor: Colors.primary,
          elevation: 5,
          alignSelf: "flex-end",
          marginTop: 10,
          borderRadius: 4,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "white",
            textAlign: "right",
            fontWeight: "bold",
            padding: 8,
          }}
        >
          उत्तर पहा / See Solution {">"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  quesContainer: {
    // borderWidth: 1,
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
    height: 15,
    width: 15,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },

  circle: {
    borderWidth: 1,
    height: 20,
    width: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.primary,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default CompletedQuesCard;
