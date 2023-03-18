import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import Colors from "../constants/Colors";

const Loader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {/* <Text>Loading...</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loader;
