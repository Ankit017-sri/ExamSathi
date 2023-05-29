import React from "react";
import { View } from "react-native";
import Colors from "../constants/Colors";

const CompletedTestOptionCircle = ({ selectedOption, num, attempted }) => {
  let backgroundColor = "#fff";
  if (attempted && selectedOption == num && attempted == num) {
    backgroundColor = Colors.correctAns;
  } else if (
    (attempted && selectedOption == num && attempted !== num) ||
    selectedOption == num
  ) {
    backgroundColor = Colors.correctAns;
  } else if (attempted && attempted == num) backgroundColor = "red";
  return (
    <View
      style={{
        borderWidth: 1,
        height: 20,
        width: 20,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderColor: Colors.primary,
        backgroundColor: "#fff",
        marginRight: 10,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: 15,
          width: 15,
          borderWidth: 1,
          borderRadius: 30,
          borderColor: backgroundColor,
          backgroundColor,
        }}
      />
    </View>
  );
};

export default CompletedTestOptionCircle;
