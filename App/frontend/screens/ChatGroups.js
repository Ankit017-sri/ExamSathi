import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import CustomHeader from "../components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import ChatContext from "../chat/context";

const ChatGroups = ({ navigation }) => {
  const { groups } = useContext(ChatContext);

  const newGroup = () => {
    navigation.navigate("New Group");
  };

  return (
    <View style={{ position: "relative", flex: 0.9 }}>
      <CustomHeader title={"Messages"} />
      <View style={styles.container}>
        <View>
          <ScrollView>
            <Pressable
              onPress={() => navigation.navigate("Chat")}
              style={styles.group}
            >
              <View style={{ flexDirection: "row" }}>
                <Ionicons name="people" size={30} />
                <Text style={styles.groupName}>ExamSathi</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={30} />
            </Pressable>
            {groups
              .slice(0)
              .reverse()
              .map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    style={styles.group}
                    onPress={() => console.log("pressed")}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Ionicons name="people" size={30} />
                      <Text style={styles.groupName}>{item}</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={30} />
                  </Pressable>
                );
              })}
          </ScrollView>
        </View>
      </View>
      <Pressable
        onPress={newGroup}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: "#17cfe3",
          alignItems: "center",
          alignSelf: "center",
          paddingVertical: 8,
          borderRadius: 40,
          position: "absolute",
          bottom: 0,
          zIndex: 30,
          borderColor: "black",
          borderWidth: 1,
          paddingHorizontal: 20,
          elevation: 5,
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
    </View>
  );
};

export default ChatGroups;

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  group: {
    marginBottom: 10,
    elevation: 10,
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "space-between",
    backgroundColor: "#17cfe3",
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 20,
    textAlignVertical: "center",
    maxWidth: 200,
    maxHeight: 40,
  },
});
