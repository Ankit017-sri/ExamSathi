import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomHeader from "../components/CustomHeader";
import YouTubePlayer from "../components/YoutubePlayer";
import Colors from "../constants/Colors";

const Solution = ({ navigation }) => {
  const data = navigation.getState().routes[2]?.params;

  // console.log(data);

  return (
    <View style={styles.container}>
      <View
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
          Solution
        </Text>
      </View>
      {/* <CustomHeader title="Explanation" isBack navigation={navigation} /> */}
      <View style={styles.solutionContainer}>
        <View style={styles.explanationContainer}>
          <Text style={styles.titleText}>Solution:</Text>
          <Text style={{ fontSize: 15 }}>{data.exp}</Text>
        </View>
        <View style={styles.explanationContainer}>
          <Text style={styles.titleText}>Explanation Video:</Text>
          <YouTubePlayer link={data.ytLink} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // padding: 20,
  },
  solutionContainer: {
    padding: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.text,
  },
  explanationContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 50,
    backgroundColor: "#fff",
    elevation: 5,
  },
});

export default Solution;
