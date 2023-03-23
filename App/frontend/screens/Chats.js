import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
  Image,
} from "react-native";
import { io } from "socket.io-client";
import axios from "axios";
import baseUrl from "../baseUrl";
import CustomHeader from "../components/CustomHeader";
import * as ImagePicker from "expo-image-picker";
import Loader from "../components/Loader";
import AuthContext from "../auth/context";
import { format } from "timeago.js";
import { Ionicons } from "@expo/vector-icons";

const ChatsScreen = () => {
  const authContext = useContext(AuthContext);

  const [user, setUser] = useState({});
  const [id, setId] = useState("");
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiveMessage, setRecieveMessage] = useState(null);
  const [len, setLen] = useState(0);
  const [memCount, setMemCount] = useState();
  const [image, setImage] = useState();

  const socket = useRef();
  const scrollRef = useRef();

  async function fetchCounts() {
    await axios
      .get(`${baseUrl}/auth/users/count`, {
        headers: { Authorization: `Bearer ${authContext.token}` },
      })
      .then((data) => {
        console.log(data.data[0].count);
        setMemCount(data.data[0].count);
      })
      .catch((e) => console.log(e));
  }
  async function fetchUser() {
    // const userData = await cache.get("user").catch((e) => console.log(e));
    // setUser(userData)
    await axios
      .get(`${baseUrl}/auth/user`, {
        headers: { Authorization: `Bearer ${authContext.token}` },
      })
      .then((data) => {
        // console.log(data);
        setUser(data.data);
      })
      .catch((e) => console.log(e));
  }
  async function fetchMessages() {
    await axios
      .get(`${baseUrl}/message`, {
        headers: { Authorization: `Bearer ${authContext.token}` },
      })
      .then((data) => {
        setMessages(data.data);
      })
      .catch((e) => console.log(e));
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);
    if (result.canceled) {
      // Handle cancellation...
      return;
    }
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setMessages([
        ...messages,
        { senderId: user._id, uri: result.assets[0].uri, name: user.fullName },
      ]);
    }
  };

  useLayoutEffect(() => {
    fetchUser();
    fetchCounts();
  }, []);
  useEffect(() => {
    setId(user._id);
    fetchMessages();
  }, [user]);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  useEffect(() => {
    socket.current = io(baseUrl);

    socket.current.emit("new-user-add", user?._id);
    console.log("connected...");
    socket.current.on("get-active-users", (data) => {
      setLen(data);
    });
    socket.current.on("message-recieve", (data) => {
      // console.log("recieved", data);
      setRecieveMessage(data);
      // console.log("recieve data", receiveMessage);
    });
  }, [user]);
  useEffect(() => {
    if (messages) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  useEffect(() => {
    if (receiveMessage) {
      setMessages([...messages, receiveMessage]);
      // console.log("messages : ", messages);
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [receiveMessage?.createdAt]);

  const sendMessage = () => {
    if (message) {
      handleSend(message);
      socket.current.emit("message", {
        text: message,
        senderId: user?._id,
        // senderId: "54187867143118",
        name: user?.fullName,
        createdAt: new Date(),
      });
      setMessage("");
    }

    // socket.current.disconnect();
  };
  const handleSend = async (message) => {
    if (message) {
      const res = await axios
        .post(
          `${baseUrl}/message`,
          { text: message },
          {
            headers: { Authorization: `Bearer ${authContext.token}` },
          }
        )
        .catch((e) => console.log(e));
    }
  };

  const MessageSent = ({ msg }) => {
    return (
      <View>
        <View
          style={{
            minWidth: "55%",
            maxWidth: "95%",
            backgroundColor: "#00ABB3",
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          {msg.uri ? (
            <Image
              source={{ uri: msg.uri }}
              style={{ width: 250, height: 200, borderRadius: 10 }}
              // resizeMode="cover"
            />
          ) : (
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                marginHorizontal: 6,
                marginVertical: 4,
              }}
            >
              {msg.text}
            </Text>
          )}
          <Text style={{ color: "#fff", textAlign: "right", fontSize: 10 }}>
            {format(msg.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const MessageRecieved = ({ msg }) => {
    return (
      <View>
        <View
          style={{
            minWidth: "60%",
            maxWidth: "85%",
            backgroundColor: "#EAEAEA",
            borderRadius: 12,
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.name}>{msg.name}</Text>

          {msg.uri ? (
            <Image
              source={{ uri: msg.uri }}
              style={{ width: 250, height: 200, borderRadius: 10 }}
              // resizeMode="cover"
            />
          ) : (
            <Text style={[styles.messageText, { color: "black" }]}>
              {msg.text}
            </Text>
          )}

          <Text style={{ color: "#3C4048", textAlign: "right", fontSize: 10 }}>
            {format(msg.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <CustomHeader
        title="ExamSathi"
        sub={`${memCount} members, ${len} online`}
      />
      {!user ? (
        <Loader />
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View>
            <ScrollView
              style={[styles.messages, { paddingBottom: 20 }]}
              ref={scrollRef}
            >
              {messages.length == 0 && (
                <Text style={{ alignSelf: "center", color: "black" }}>
                  No messages yet
                </Text>
              )}
              {messages.map((data, index) => (
                <View key={index} style={styles.message}>
                  {data.senderId === id ? (
                    <View style={styles.messageSent}>
                      <MessageSent msg={data} />
                    </View>
                  ) : (
                    <View style={styles.messageRecieved}>
                      <MessageRecieved msg={data} />
                    </View>
                  )}
                </View>
              ))}
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></View>
            </ScrollView>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={(text) => setMessage(text)}
                placeholder="Type your message here"
              />
              {message ? (
                <TouchableOpacity style={styles.button} onPress={sendMessage}>
                  {/* <Text style={styles.buttonText}>Send</Text> */}
                  <Ionicons name="send-sharp" color="#fff" size={20} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                  {/* <Text style={styles.buttonText}>Send</Text> */}
                  <Ionicons name="camera-outline" color="#fff" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messages: {
    paddingHorizontal: 20,
    height: "80%",
    // backgroundColor: "#fff",
    marginTop: 10,
  },
  message: {
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginBottom: 3,
    paddingHorizontal: 6,
  },
  messageText: {
    fontSize: 16,
    marginHorizontal: 6,
    marginVertical: 4,
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  messageSent: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 2,
  },
  messageRecieved: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  name: {
    color: "#00ABB3",
    borderRadius: 10,
  },
});

export default ChatsScreen;
