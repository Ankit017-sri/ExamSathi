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
  Modal,
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
import CloudURL from "../CloudURL";
import FullscreenImage from "../components/ImageView";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
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
      UploadImage(result.assets[0]);
    }
  };

  const UploadImage = async (data) => {
    setUploading(true);
    const source = data.base64;
    let base64Img = `data:image/jpg;base64,${source}`;
    let formdata = {
      file: base64Img,
      upload_preset: "lylmg545",
    };
    fetch(CloudURL, {
      body: JSON.stringify(formdata),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    })
      .then(async (response) => {
        let data = await response.json();
        if (data.secure_url) {
          console.log(data.secure_url);
          // setImage(data.secure_url);
          handleUpload({ uri: data.secure_url });
          // alert("Upload successful");
        }
      })
      .catch((err) => alert("something went wrong"));
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

  const handleUpload = async (data) => {
    if (data) {
      const res = await axios
        .post(`${baseUrl}/message`, data, {
          headers: { Authorization: `Bearer ${authContext.token}` },
        })
        .catch((e) => console.log(e));
      // console.log(res.data);
      if (!res.data.uri) {
        setUploading(false);
        return alert("something went wrong please try again !");
      } else {
        socket.current.emit("message", {
          senderId: res.data.senderId,
          uri: res.data.uri,
          name: res.data.name,
          createdAt: res.data.createdAt,
        });
        setUploading(false);
      }
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
            <FullscreenImage imageSource={msg.uri} />
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
            <FullscreenImage imageSource={msg.uri} />
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
    <View style={{ flex: 1 }}>
      <CustomHeader
        title="ExamSathi"
        sub={`${memCount} members, ${len} online`}
      />

      {!user ? (
        <Loader />
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flexGrow: 1 }}
        >
          {uploading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                zIndex: 40,
                width: "100%",
                backgroundColor: "#f1f1f1",
                paddingVertical: 4,
              }}
            >
              <Text style={{ textAlign: "center" }}>Sending media...</Text>
            </View>
          )}
          <View style={{ flex: 0.9 }}>
            <ScrollView style={[styles.messages]} ref={scrollRef}>
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
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              multiline={true}
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
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messages: {
    paddingHorizontal: 20,
    // height: "80%",
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
    position: "relative",
    top: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
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
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 20,
  },
});

export default ChatsScreen;
