import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import CustomHeader from "../components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
// import ChatContext from "../chat/context";
import axios from "axios";
import baseUrl from "../baseUrl";
import AuthContext from "../auth/context";
// import { useFocusEffect } from "@react-navigation/native";
import cache from "../utilities/cache";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";

const ChatGroups = ({ navigation }) => {
  // const { groups, setGroups } = useContext(ChatContext);
  const { token, setTabBarVisible, Id } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [newMessages1, setNewMessages1] = useState([]);
  const [newMessages2, setNewMessages2] = useState([]);
  const [newMessages3, setNewMessages3] = useState([]);
  const [newMessages4, setNewMessages4] = useState([]);
  const [newMessages5, setNewMessages5] = useState([]);

  const [lastmessage1, setLastMessage1] = useState({});
  const [lastmessage2, setLastMessage2] = useState({});
  const [lastmessage3, setLastMessage3] = useState({});
  const [lastmessage4, setLastMessage4] = useState({});
  const [lastmessage5, setLastMessage5] = useState({});

  // const newGroup = () => {
  //   navigation.navigate("New Group");
  // };
  const appOpenCount = async () => {
    try {
      const res = await axios.put(
        `${baseUrl}/auth/app/openCount`,
        { data: "count" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log("error 0 ", error);
    }
  };
  const appShareCount = async () => {
    try {
      const res = await axios.put(
        `${baseUrl}/auth/app/share`,
        { screen: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    appOpenCount();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(true);
      fetchLatestMessageAll();
    }, [])
  );
  const fetchLatestMessageAll = async () => {
    try {
      const lastest1 = await cache.get("group1latest");
      const lastest2 = await cache.get("group2latest");
      const lastest3 = await cache.get("group3latest");
      const lastest4 = await cache.get("group4latest");
      const lastest5 = await cache.get("group5latest");
      if (lastest1) {
        setLastMessage1(lastest1);
        // console.log(lastmessage1);
      }
      if (lastest2) {
        setLastMessage2(lastest2);
      }
      if (lastest3) {
        setLastMessage3(lastest3);
      }
      if (lastest4) {
        setLastMessage4(lastest4);
      }
      if (lastest5) {
        setLastMessage5(lastest5);
      }

      const group1NewMessages = await fetchLatestMessage({ group: "group1" });
      const group2NewMessages = await fetchLatestMessage({ group: "group2" });
      const group3NewMessages = await fetchLatestMessage({ group: "group3" });
      const group4NewMessages = await fetchLatestMessage({ group: "group4" });
      const group5NewMessages = await fetchLatestMessage({ group: "group5" });
      setNewMessages1(group1NewMessages);
      setNewMessages2(group2NewMessages);
      setNewMessages3(group3NewMessages);
      setNewMessages4(group4NewMessages);
      setNewMessages5(group5NewMessages);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const fetchLatestMessage = async ({ group }) => {
    let data = await cache.get(`${group}`);
    if (data !== null) {
      const lastmessage = data[data.length - 1];
      if (lastmessage) {
        const messages = await axios
          .post(
            `${baseUrl}/message/latest`,
            { date: lastmessage.createdAt, group },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .catch((e) => {
            console.log(e);
          });
        return messages.data;
      } else {
        console.log("fetching");
        const messages = await axios
          .get(`${baseUrl}/message/${group}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch((e) => {
            console.log(e);
          });

        // setMessages(data.data);
        // console.log(messages.data);
        return messages.data;
      }
    } else {
      console.log("fetching");
      const messages = await axios
        .get(`${baseUrl}/message/${group}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((e) => {
          console.log(e);
        });

      // setMessages(data.data);
      // console.log(messages.data);
      return messages.data;
    }
  };

  const fetchMessages = async ({ group, name, imgUri }) => {
    let data = await cache.get(`${group}`);
    // console.log("cache ");
    // let data = [];
    // await cache.clear(`${group}`);
    if (data !== null) {
      // setMessages(data);
      console.log("passing");
      const lastmessage = data[data.length - 1];
      if (lastmessage) {
        const messages = await axios
          .post(
            `${baseUrl}/message/latest`,
            { date: lastmessage.createdAt, group },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .catch((e) => {
            console.log(e);
          });
        if (messages) {
          // console.log("messages ", messages.data);
          data.push(...messages.data);
        }
        return navigation.navigate("Chat", {
          group: group,
          fetchedData: data,
          title: name,
          imgUri,
        });
      } else {
        console.log("fetching");
        const date = new Date(Date.now() - 1.814e9);
        const messages = await axios
          .get(`${baseUrl}/message/${group}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch((e) => {
            console.log("error 1 ", e);
          });

        // setMessages(data.data);
        // console.log(messages.data);
        const cacheMessage = messages.data.filter(
          (message) => new Date(message.createdAt) >= date
        );
        // console.log("cacheMessage ", cacheMessage);
        await cache.store(`${group}`, cacheMessage);
        return navigation.navigate("Chat", {
          group: group,
          fetchedData: cacheMessage,
          title: name,
          imgUri,
        });
      }
    } else {
      console.log("fetching");
      const date = new Date(Date.now() - 1.814e9);
      const messages = await axios
        .get(`${baseUrl}/message/${group}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((e) => {
          console.log("error", e);
        });

      // setMessages(data.data);
      // console.log(messages.data);
      const cacheMessage = messages.data.filter(
        (message) => new Date(message.createdAt) >= date
      );
      // console.log("cacheMessage ", cacheMessage);
      await cache.store(`${group}`, cacheMessage);
      return navigation.navigate("Chat", {
        group: group,
        fetchedData: cacheMessage,
        title: name,
        imgUri,
      });
    }
  };

  // const chats = async (groupData) => {
  //   let messages = await cache.get(`${groupData._id}`);
  //   if (messages !== null) {
  //     console.log("passing...");
  //     const lastmessage = messages[messages.length - 1];
  //     const res = await axios.post(
  //       `${baseUrl}/group/${groupData._id}/latest-messages`,
  //       { date: lastmessage.createdAt },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     if (res.data) {
  //       messages.push(...res.data);
  //       return navigation.navigate("Group Chat", {
  //         groupData: { ...groupData, messages: messages },
  //       });
  //     } else {
  //       navigation.navigate("Group Chat", {
  //         groupData: { ...groupData, messages: messages },
  //       });
  //     }
  //   } else {
  //     console.log("fetching....");
  //     const res = await axios.get(
  //       `${baseUrl}/group/${groupData._id}/messages`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     if (res.data) {
  //       messages = res.data.messages;
  //       await cache.store(`${groupData._id}`, res.data.messages);
  //       navigation.navigate("Group Chat", {
  //         groupData: { ...groupData, messages: messages },
  //       });
  //     }
  //   }
  // };

  // const fetchGroups = async () => {
  //   const res = await axios.get(`${baseUrl}/group/names`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   setGroups(res.data);
  //   await cache.store("groups", groups);
  // };

  useEffect(() => {
    setTabBarVisible(true);
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchGroups();
  //   }, [])
  // );

  const Group = ({ name, imgUri, group, newMessages, lastmessage }) => {
    const unreads = newMessages.length;
    const createdAt = newMessages[unreads - 1]?.createdAt;
    // console.log(lastmessage);
    var hours;
    var minutes;
    var ampm;
    var formatTime;
    if (createdAt) {
      const date = new Date(createdAt);
      hours = date.getHours();
      minutes = date.getMinutes();
      ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      formatTime = hours + ":" + minutes + " " + ampm;
    } else if (lastmessage?.length > 0) {
      const createdAt = lastmessage[0]?.createdAt;
      const date = new Date(createdAt);
      hours = date.getHours();
      minutes = date.getMinutes();
      ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      formatTime = hours + ":" + minutes + " " + ampm;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          fetchMessages({ group, name, imgUri });
        }}
        style={styles.group}
      >
        <View
          style={{ flexDirection: "row", width: "100%", paddingBottom: 10 }}
        >
          {imgUri !== undefined ? (
            <Image source={imgUri} style={styles.avatar} />
          ) : (
            <Ionicons name="people" size={30} />
          )}
          <View
            style={{
              borderBottomWidth: 1,
              flex: 1,
              borderColor: "grey",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 6,
            }}
          >
            <View>
              <Text style={styles.groupName}>{name}</Text>
              <Text
                style={{
                  maxWidth: 180,
                  fontSize: 14,
                  color: "grey",
                  overflow: "hidden",
                  marginLeft: 20,
                }}
                numberOfLines={1}
              >
                {unreads == 0 &&
                  lastmessage?.length > 0 &&
                  `${
                    lastmessage[0]?.senderId !== Id
                      ? lastmessage[0]?.name
                      : "you"
                  } : ${
                    lastmessage[0]?.uri
                      ? lastmessage[0].uri.split(".").slice(-1) == "pdf"
                        ? lastmessage[0].pdfName + " PDF"
                        : "Image"
                      : lastmessage[0]?.text
                  }`}
                {newMessages[unreads - 1]?.senderId !== Id
                  ? newMessages[unreads - 1]?.name
                  : "you"}{" "}
                {unreads !== 0 && ":"}{" "}
                {newMessages[unreads - 1]?.text &&
                  newMessages[unreads - 1]?.text}
                {newMessages[unreads - 1]?.uri?.split(".").slice(-1) == "pdf" &&
                  `${newMessages[unreads - 1]?.pdfName} PDF`}
                {newMessages[unreads - 1]?.uri?.split(".").slice(-1) == "jpg" &&
                  "Image"}
                {/* {newMessages[unreads - 1]?.pdfName
                ? newMessages[unreads - 1]?.pdfName
                : "Image"} */}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12 }}>{formatTime && formatTime}</Text>
              {unreads != 0 && newMessages[unreads - 1]?.senderId !== Id && (
                <Text
                  style={{
                    alignSelf: "flex-end",
                    backgroundColor: "#16FF00",
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    textAlign: "center",
                    color: "#000000",
                    marginTop: 4,
                  }}
                >
                  {unreads}
                </Text>
              )}
            </View>
          </View>
        </View>
        {/* <Ionicons name="chevron-forward-outline" size={30} /> */}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ position: "relative", flex: 0.9 }}>
      <CustomHeader
        title={"Study Groups"}
        share={true}
        appShareCount={appShareCount}
      />
      {loading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          <View>
            <ScrollView>
              {/* <Group name="ExamSathi" group={"group0"} /> */}
              <Group
                name="महाराष्ट्र पोलीस भरती : Discussion group"
                imgUri={require("../assets/Maharashtra-Police-bharti-2022.jpg")}
                group={"group1"}
                newMessages={newMessages1}
                lastmessage={lastmessage1}
              />
              <Group
                name="महाराष्ट्र तलाठी भरती : Discussion Group"
                imgUri={require("../assets/maha-govt.png")}
                group={"group2"}
                newMessages={newMessages2}
                lastmessage={lastmessage2}
              />
              <Group
                name="महाराष्ट्र वनरक्षक भरती : Discussion Group"
                imgUri={require("../assets/Maharashtra-Forest-Department-Logo.jpg")}
                group={"group3"}
                newMessages={newMessages3}
                lastmessage={lastmessage3}
              />
              <Group
                name="बुद्धिमत्ता आणि गणित Doubts"
                imgUri={require("../assets/बुद्धिमत्ता.png")}
                group={"group4"}
                newMessages={newMessages4}
                lastmessage={lastmessage4}
              />
              <Group
                name="Daily Motivation"
                imgUri={require("../assets/motivation.jpg")}
                group={"group5"}
                newMessages={newMessages5}
                lastmessage={lastmessage5}
              />
              {/* {groups
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
              })} */}
            </ScrollView>
          </View>
        </View>
      )}
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
    </View>
  );
};

export default ChatGroups;

const styles = StyleSheet.create({
  container: {
    // margin: 8,
    marginVertical: 16,
    justifyContent: "center",
  },
  group: {
    // marginBottom: 10,
    // elevation: 10,
    // borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 10,
    // paddingVertical: 4,
    justifyContent: "space-between",
    // backgroundColor: "#17cfe3",
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 20,
    textAlignVertical: "center",
    maxWidth: 160,
    // maxHeight: 40,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: 4,
    backgroundColor: "#17cfe3",
    justifyContent: "center",
  },
});
