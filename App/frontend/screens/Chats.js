import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
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
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { io } from "socket.io-client";
import axios from "axios";
import baseUrl from "../baseUrl";
import CustomHeader from "../components/CustomHeader";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
// import * as Linking from "expo-linking";
import AuthContext from "../auth/context";
import { format } from "timeago.js";
import { Ionicons } from "@expo/vector-icons";
import CloudURL from "../CloudURL";
import FullscreenImage from "../components/ImageView";
import { BottomSheet } from "react-native-btr";
import cache from "../utilities/cache";
import { useFocusEffect } from "@react-navigation/native";
import ChatContext from "../chat/context";
import SwipeableMessage from "../components/SwipeableMessage";
import Colors from "../constants/Colors";
import PDFViewer from "../components/PDFViewer";

const ChatsScreen = ({ navigation, route }) => {
  const { group, fetchedData, title, imgUri } = route.params;
  const {
    token,
    setTabBarVisible,
    Id,
    name: fullName,
  } = useContext(AuthContext);
  const {
    // messages: fetchedData,
    memCount: counts,
    replyMessage,
    setReplyMessage,
  } = useContext(ChatContext);

  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiveMessage, setRecieveMessage] = useState(null);
  const [len, setLen] = useState(0);
  const [memCount, setMemCount] = useState();
  const [image, setImage] = useState();
  const [uploading, setUploading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sendMessage, setSendMessage] = useState();

  const socket = useRef();
  const scrollRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    setTabBarVisible(false);
    setMessages(fetchedData);
    setMemCount(counts);
    scrollRef.current.scrollToEnd({ animated: false });
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();

    return async () => {
      await cache.store(`${group}`, fetchedData);
      await cache.store(`${group}latest`, fetchedData.slice(-1));
      setReplyMessage({});
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    socket.current = io(baseUrl);

    socket.current.emit("new-user-add", { Id, group });
    socket.current.on("get-active-users", (data) => {
      setLen(data);
    });
    socket.current.on("message-recieve", (data) => {
      // console.log("recieved", data);
      setRecieveMessage(data);
      // console.log("recieve data", receiveMessage);
    });
    return () => {
      socket.current.emit("leaveGroup", group);
    };
  }, [Id]);
  useEffect(() => {
    if (receiveMessage) {
      setMessages([...messages, receiveMessage]);
      fetchedData.push(receiveMessage);
      // console.log("messages : ", messages);
      scrollRef.current.scrollToEnd({ animated: false });
    }
  }, [receiveMessage?.createdAt]);

  async function fetchMessages() {
    const lastmessage = fetchedData[fetchedData.length - 1];
    if (lastmessage) {
      await axios
        .post(
          `${baseUrl}/message/latest`,
          { date: lastmessage.createdAt, group },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((data) => {
          fetchedData.push(...data.data);
          setMessages(fetchedData);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, [])
  );

  useEffect(() => {
    if (replyMessage.name) {
      inputRef.current.focus();
    }
  }, [replyMessage]);

  const getBase64 = async (uri) => {
    try {
      const fileUri = uri; // Replace with your file URI
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return base64;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      // aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled) {
      setVisible(false);
      // Handle cancellation...
      return;
    }
    if (!result.canceled) {
      setVisible(false);
      setImage(result.assets[0].uri);
      UploadImage(result.assets[0]);
    }
  };
  const openGallery = async () => {
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
      setVisible(false);
      return;
    }
    if (!result.canceled) {
      setVisible(false);
      setImage(result.assets[0].uri);
      UploadImage(result.assets[0]);
    }
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        file: 1,
      });
      setVisible(false);
      if (result.type == "success") {
        console.log(result);
        const base64 = await getBase64(result.uri);

        if (base64 !== "") {
          let base64PDF = `data:application/pdf;base64,${base64}`;
          let formdata = {
            file: base64PDF,
            public_id: result.name,
            upload_preset: "lylmg545",
          };
          const response = await axios.post(CloudURL, formdata);
          console.log(response.data);
          if (response.data.secure_url) {
            console.log(response.data.secure_url);
            // setImage(data.secure_url);
            setVisible(false);
            setUploading(true);
            handleUpload({
              uri: response.data.secure_url,
              pdfName: response.data.public_id.split("/")[1],
            });
            // alert("Upload successful");
          }
        }
      }
    } catch (error) {
      console.log(error);
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

  const handleUpload = async ({ uri, pdfName }) => {
    if (uri) {
      const res = await axios
        .post(
          `${baseUrl}/message`,
          { uri, group, pdfName },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .catch((e) => console.log(e));
      // console.log(res.data);
      if (!res.data.uri) {
        setUploading(false);
        return alert("something went wrong please try again !");
      } else {
        socket.current.emit("message", { message: res.data, group });
        setUploading(false);
      }
    }
  };

  const MessageRecieved = ({ msg }) => {
    return (
      <View
        style={{
          backgroundColor: "#F5F7F6",
          marginBottom: 6,
          borderRadius: 10,
        }}
      >
        <Text style={styles.name}>{msg.name}</Text>
        {msg.replyOn?.name && (
          <View
            style={{
              minWidth: "55%",
              maxWidth: "95%",
              backgroundColor: "#EAEAEA",
              borderRadius: 12,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              marginHorizontal: 8,
            }}
          >
            <View
              style={{
                borderLeftColor: "cyan",
                borderLeftWidth: 4,
                // backgroundColor: "#D6E4E5",
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View>
                <Text style={{ color: "#5837D0", fontWeight: "600" }}>
                  {msg.replyOn.name}
                </Text>
              </View>
              {msg.replyOn.uri ? (
                <>
                  {msg.replyOn.uri.split(".").slice(-1)[0] == "pdf" ? (
                    <PDFViewer url={msg.replyOn.uri} name={msg.pdfName} />
                  ) : (
                    <FullscreenImage imageSource={msg.replyOn.uri} />
                  )}
                </>
              ) : (
                <Text style={{ fontSize: 16 }}>{msg.replyOn.text}</Text>
              )}
            </View>
          </View>
        )}
        <View
          style={{
            minWidth: "60%",
            maxWidth: "85%",

            borderRadius: 12,
            paddingHorizontal: 10,
          }}
        >
          {msg.uri ? (
            <>
              {msg.uri.split(".").slice(-1)[0] == "pdf" ? (
                <PDFViewer url={msg.uri} name={msg.pdfName} />
              ) : (
                <FullscreenImage imageSource={msg.uri} />
              )}
            </>
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

  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#E5DDD5" }}>
      <CustomHeader
        title={title.split(":")[0]}
        sub={`${memCount} members, ${len} online`}
        isBack={true}
        imgUri={imgUri}
        navigation={navigation}
        setTabBarVisible={setTabBarVisible}
      />
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

        <View style={{ flex: 0.95 }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView
              style={[styles.messages]}
              ref={scrollRef}
              onContentSizeChange={() =>
                scrollRef.current.scrollToEnd({ animated: false })
              }
            >
              {messages.length == 0 && (
                <Text style={{ alignSelf: "center", color: "black" }}>
                  No messages yet
                </Text>
              )}
              {messages.map((data, index) => (
                <SwipeableMessage
                  key={index}
                  data={data}
                  Id={Id}
                  MessageRecieved={MessageRecieved}
                  // MessageSent={MessageSent}
                  message={message}
                  group={group}
                  setSendMessage={setSendMessage}
                  setMessage={setMessage}
                  socket={socket}
                />
              ))}
              <View></View>
            </ScrollView>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            onPress={() => scrollRef.current.scrollToEnd({ animated: false })}
            style={{
              position: "absolute",
              bottom: 10,
              right: 16,
              backgroundColor: "black",
              borderRadius: 15,
              width: 30,
              height: 30,
              opacity: 0.4,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 30,
            }}
          >
            <Ionicons name="arrow-down" size={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          {replyMessage.name && (
            <View
              style={{
                position: "absolute",
                top: -68,
                marginHorizontal: 16,
                backgroundColor: "white",
                width: "87%",
                paddingHorizontal: 4,
                paddingVertical: 4,
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: "#ccc",
              }}
            >
              <View
                style={{
                  borderLeftColor: "cyan",
                  borderLeftWidth: 4,
                  height: 60,
                  backgroundColor: "#D6E4E5",
                  borderRadius: 8,
                  padding: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#5837D0" }}>{replyMessage.name}</Text>
                  <TouchableOpacity onPress={() => setReplyMessage({})}>
                    <Ionicons name="close" size={20} />
                  </TouchableOpacity>
                </View>
                {replyMessage.uri && (
                  <>
                    {replyMessage.uri.split(".").slice(-1)[0] == "pdf" ? (
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: "#EFF5F5",
                          padding: 4,
                          borderRadius: 4,
                        }}
                      >
                        <View>
                          <Ionicons
                            name="document-outline"
                            size={16}
                            color={"red"}
                          />
                          <Text
                            style={{
                              fontSize: 10,
                              textTransform: "uppercase",
                              alignSelf: "center",
                            }}
                          >
                            {replyMessage.uri.split(".").slice(-1)[0]}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 14 }}>
                          {replyMessage.pdfName?.length > 0
                            ? replyMessage.pdfName
                            : replyMessage.uri.split("/").pop()}
                        </Text>
                      </View>
                    ) : (
                      <Image
                        source={{ uri: replyMessage.uri }}
                        style={{ width: 40, height: 40 }}
                      />
                    )}
                  </>
                )}
                <Text style={{ fontSize: 12 }}>{replyMessage.text}</Text>
              </View>
            </View>
          )}
          <TextInput
            style={[
              styles.input,
              {
                borderTopWidth: replyMessage.name ? 0 : 1,
                borderTopLeftRadius: replyMessage.name ? 0 : 16,
                borderTopRightRadius: replyMessage.name ? 0 : 16,
              },
            ]}
            value={message}
            multiline={true}
            onChangeText={(text) => setMessage(text)}
            placeholder="Message "
            ref={inputRef}
          />
          {message ? (
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                await sendMessage();
              }}
            >
              {/* <Text style={styles.buttonText}>Send</Text> */}
              <Ionicons name="send-sharp" color="#fff" size={20} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              // style={styles.button}
              onPress={toggleBottomNavigationView}
            >
              {/* <Text style={styles.buttonText}>Send</Text> */}
              <Ionicons name="attach" color="black" size={30} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
      <BottomSheet
        visible={visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
        //Toggling the visibility state on the clicking out side of the sheet
      >
        <View style={styles.bottomNavigationView}>
          <TouchableOpacity
            onPress={pickImage}
            style={{ alignItems: "center" }}
          >
            <View style={styles.button}>
              <Ionicons name="camera-outline" color="#fff" size={20} />
            </View>
            <Text style={{ color: "#fff" }}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openGallery}
            style={{ alignItems: "center" }}
          >
            <View style={styles.button}>
              <Ionicons name="images-outline" color="#fff" size={20} />
            </View>
            <Text style={{ color: "#fff" }}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickDocument}
            style={{ alignItems: "center" }}
          >
            <View style={styles.button}>
              <Ionicons name="document-attach-outline" color="#fff" size={20} />
            </View>
            <Text style={{ color: "#fff" }}>Document</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  messages: {
    paddingHorizontal: 20,
    // height: "80%",
    // backgroundColor: "#fff",
    // marginTop: 10,
    paddingVertical: 10,
  },
  message: {
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginBottom: 4,
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
    bottom: 8,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    padding: 8,
    marginRight: 8,
    backgroundColor: "#fff",
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
    marginBottom: 4,
  },
  messageRecieved: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  name: {
    color: "#00ABB3",
    borderRadius: 10,
    marginHorizontal: 10,
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
  bottomNavigationView: {
    // backgroundColor: "#17cfe3",
    backgroundColor: Colors.primary,
    width: "100%",
    height: 200,
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ChatsScreen;
