import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import CustomHeader from "../components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import ChatContext from "../chat/context";
import axios from "axios";
import baseUrl from "../baseUrl";
import AuthContext from "../auth/context";

const ChatGroups = ({ navigation }) => {
  const { groups, messages, memCount } = useContext(ChatContext);
  const { token, setTabBarVisible } = useContext(AuthContext);

  const newGroup = () => {
    navigation.navigate("New Group");
  };

  const chats = async (groupData) => {
    const lastmessage = groupData.messages[groupData.messages.length - 1];
    if (lastmessage) {
      const messages = await axios.post(
        `${baseUrl}/group/${groupData.groupId}/latest-messages`,
        { date: lastmessage.createdAt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (messages.data) {
        groupData.messages.push(...messages.data);
      }
    }
    navigation.navigate("Group Chat", { groupData });
  };

  async function fetchMessages() {
    const lastmessage = messages[messages.length - 1];
    if (lastmessage) {
      await axios
        .post(
          `${baseUrl}/message/latest`,
          { date: lastmessage.createdAt },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((data) => {
          messages.push(...data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  useEffect(() => {
    setTabBarVisible(true);
  }, []);

  return (
    <View style={{ position: "relative", flex: 0.9 }}>
      <CustomHeader title={"Messages"} />
      <View style={styles.container}>
        <View>
          <ScrollView>
            <TouchableOpacity
              onPress={() => {
                fetchMessages();
                navigation.navigate("Chat", { messages, memCount });
              }}
              style={styles.group}
            >
              <View style={{ flexDirection: "row" }}>
                <Ionicons name="people" size={30} />
                <Text style={styles.groupName}>ExamSathi</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={30} />
            </TouchableOpacity>
            {groups
              .slice(0)
              .reverse()
              .map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.group}
                    onPress={() => chats(item)}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Ionicons name="people" size={30} />
                      <Text style={styles.groupName}>{item.name}</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={30} />
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity
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
      </TouchableOpacity>
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
