import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import CustomHeader from "../components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import ChatContext from "../chat/context";
import axios from "axios";
import baseUrl from "../baseUrl";
import AuthContext from "../auth/context";
import { useFocusEffect } from "@react-navigation/native";
import cache from "../utilities/cache";

const ChatGroups = ({ navigation }) => {
  const { groups, setGroups } = useContext(ChatContext);
  const { token, setTabBarVisible } = useContext(AuthContext);

  const newGroup = () => {
    navigation.navigate("New Group");
  };

  const chats = async (groupData) => {
    let messages = await cache.get(`${groupData._id}`);
    if (messages !== null) {
      console.log("passing...");
      const lastmessage = messages[messages.length - 1];
      const res = await axios.post(
        `${baseUrl}/group/${groupData._id}/latest-messages`,
        { date: lastmessage.createdAt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data) {
        messages.push(...res.data);
        return navigation.navigate("Group Chat", {
          groupData: { ...groupData, messages: messages },
        });
      } else {
        navigation.navigate("Group Chat", {
          groupData: { ...groupData, messages: messages },
        });
      }
    } else {
      console.log("fetching....");
      const res = await axios.get(
        `${baseUrl}/group/${groupData._id}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data) {
        messages = res.data.messages;
        await cache.store(`${groupData._id}`, res.data.messages);
        navigation.navigate("Group Chat", {
          groupData: { ...groupData, messages: messages },
        });
      }
    }
  };

  const fetchGroups = async () => {
    const res = await axios.get(`${baseUrl}/group/names`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGroups(res.data);
    await cache.store("groups", groups);
  };

  useEffect(() => {
    setTabBarVisible(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <View style={{ position: "relative", flex: 0.9 }}>
      <CustomHeader title={"Messages"} />
      <View style={styles.container}>
        <View>
          <ScrollView>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Chat");
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
