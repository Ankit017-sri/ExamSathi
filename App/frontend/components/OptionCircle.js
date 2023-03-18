import React from "react";
import { View } from "react-native";
import Colors from "../constants/Colors";

const OptionCircle = ({ selectedOption, num }) => {
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
      }}
    >
      <View
        style={{
          height: 15,
          width: 15,
          borderRadius: 20,
          backgroundColor: selectedOption === num ? Colors.primary : "white",
        }}
      />
    </View>
  );
};

export default OptionCircle;
