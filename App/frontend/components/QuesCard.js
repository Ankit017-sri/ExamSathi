import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

import Colors from "../constants/Colors";
import OptionCircle from "./OptionCircle";
import { attempting } from "../utilities/getNumbers";

const QuesCard = React.memo(
  ({
    data,
    onSelect,
    selected,
    setSelected,
    isRevision,
    timeRemaining,
    quesNo,
  }) => {
    const handleChange = (i) => {
      Vibration.vibrate(70);
      let arr = selected;
      arr[(data.qNo ? data.qNo : quesNo) - 1] = i;
      setSelected(arr);
      onSelect((data.qNo ? data.qNo : quesNo) - 1, i);
    };

    return (
      <View style={styles.quesContainer}>
        {isRevision && (
          <Text
            style={{ alignSelf: "flex-end", color: "red", fontWeight: "bold" }}
          >
            {timeRemaining}
          </Text>
        )}
        <Text style={styles.quesText}>
          <Text style={{ fontWeight: "bold" }}>
            {data.qNo ? data.qNo : quesNo})
          </Text>{" "}
          {data.ques}
        </Text>
        <Text style={styles.quesText}>{data.hindiQues}</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionContainer,
              selected[(data.qNo ? data.qNo : quesNo) - 1] == 1 &&
                styles.selectedOption,
            ]}
            onPress={() => handleChange(1)}
          >
            <OptionCircle
              selectedOption={selected[(data.qNo ? data.qNo : quesNo) - 1]}
              num={1}
            />
            <Text style={styles.optionText}>{data.op1}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionContainer,
              selected[(data.qNo ? data.qNo : quesNo) - 1] === 2 &&
                styles.selectedOption,
            ]}
            onPress={() => handleChange(2)}
          >
            <OptionCircle
              selectedOption={selected[(data.qNo ? data.qNo : quesNo) - 1]}
              num={2}
            />

            <Text style={styles.optionText}>{data.op2}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionContainer,
              selected[(data.qNo ? data.qNo : quesNo) - 1] === 3 &&
                styles.selectedOption,
            ]}
            onPress={() => handleChange(3)}
          >
            <OptionCircle
              selectedOption={selected[(data.qNo ? data.qNo : quesNo) - 1]}
              num={3}
            />

            <Text style={styles.optionText}>{data.op3}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionContainer,
              selected[(data.qNo ? data.qNo : quesNo) - 1] === 4 &&
                styles.selectedOption,
            ]}
            onPress={() => handleChange(4)}
          >
            <OptionCircle
              selectedOption={selected[(data.qNo ? data.qNo : quesNo) - 1]}
              num={4}
            />
            <Text style={styles.optionText}>{data.op4}</Text>
          </TouchableOpacity>
        </View>
        {isRevision && (
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>
            {attempting} answers
          </Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    width: "100%",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
  },
  optionText: {
    width: "90%",
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
    elevation: 5,
    padding: 11,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  selectedOption: {
    borderWidth: 1,
    backgroundColor: "#a2ebfa",
    borderColor: "#61e0fa",
  },
});

export default QuesCard;
