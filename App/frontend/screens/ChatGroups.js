import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomHeader from "../components/CustomHeader";

import { Ionicons } from "@expo/vector-icons";

const ChatGroups = ({ navigation }) => {
  const newGroup = () => {
    navigation.navigate("New Group");
  };

  return (
    <View>
      <CustomHeader title={"Messages"} />
      <View style={styles.container}>
        <Pressable
          onPress={newGroup}
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Ionicons name="person-add" size={25} />
          <Text
            style={{
              textAlignVertical: "center",
              fontSize: 16,
              marginLeft: 10,
              fontWeight: "600",
            }}
          >
            Create New Group
          </Text>
        </Pressable>
        <View>
          <Pressable onPress={() => navigation.navigate("Chat")}>
            <Text>ExamSathi</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ChatGroups;

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
});
