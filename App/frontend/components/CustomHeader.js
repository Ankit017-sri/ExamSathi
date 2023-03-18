import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Constants from "expo-constants";

import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const CustomHeader = ({ title, isBack, navigation }) => {
  return (
    <View style={styles.headerContainer}>
      {isBack && (
        <TouchableOpacity
          style={{
            left: 10,
            position: "absolute",
            alignSelf: "flex-end",
            bottom: 5,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={32}
            color={Colors.text}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: Colors.text,
  },
});

export default CustomHeader;
