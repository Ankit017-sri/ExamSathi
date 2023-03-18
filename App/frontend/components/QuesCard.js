import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../constants/Colors";
import OptionCircle from "./OptionCircle";

const QuesCard = React.memo(({ data, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (i) => {
    setSelectedOption(i);
    onSelect(data.qNo - 1, i);
  };

  return (
    <View style={styles.quesContainer}>
      <Text style={styles.quesText}>
        <Text style={{ fontWeight: "bold" }}>{data.qNo})</Text> {data.ques}
      </Text>
      <Text style={styles.quesText}>{data.hindiQues}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionContainer,
            selectedOption === 1 && styles.selectedOption,
          ]}
          onPress={() => handleChange(1)}
        >
          <OptionCircle selectedOption={selectedOption} num={1} />
          <Text style={styles.optionText}>{data.op1}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionContainer,
            selectedOption === 2 && styles.selectedOption,
          ]}
          onPress={() => handleChange(2)}
        >
          <OptionCircle selectedOption={selectedOption} num={2} />

          <Text style={styles.optionText}>{data.op2}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionContainer,
            selectedOption === 3 && styles.selectedOption,
          ]}
          onPress={() => handleChange(3)}
        >
          <OptionCircle selectedOption={selectedOption} num={3} />

          <Text style={styles.optionText}>{data.op3}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionContainer,
            selectedOption === 4 && styles.selectedOption,
          ]}
          onPress={() => handleChange(4)}
        >
          <OptionCircle selectedOption={selectedOption} num={4} />
          <Text style={styles.optionText}>{data.op4}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

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

export default QuesCard;
