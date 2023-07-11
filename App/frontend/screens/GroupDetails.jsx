import { CometChat } from "@cometchat-pro/react-native-chat";
import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  View,
  Alert,
  ActivityIndicator,
  ImageBackground,
  FlatList,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import { BottomSheet } from "react-native-btr";
import moment from "moment";

import AuthContext from "../auth/context";
import InputComponent from "../components/InputComponent";
import VideoMessage from "../components/VideoMessage";
import PdfMessage from "../components/PdfMessage";

const GroupDetails = ({
  guid,
  setIsShowingMedia,
  setMediaDetails,
  groupsJoined,
}) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [visible, setVisible] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [prevMsgLoading, setPrevMsgLoading] = useState(false);

  const scrollViewRef = useRef(null);
  const { setTabBarVisible, tabBarVisible } = useContext(AuthContext);

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  useEffect(() => {
    let listenerID = "ExamSathi232829";

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage) => {
          if (textMessage.conversationId === "group_" + guid) {
            setMessages((messages) => [...messages, textMessage]);
            scrollToBottom();
          }
        },
        onMediaMessageReceived: (mediaMessage) => {
          if (mediaMessage.conversationId === "group_" + guid) {
            setMessages((messages) => [...messages, mediaMessage]);
            scrollToBottom();
          }
        },
        onCustomMessageReceived: (customMessage) => {
          console.log("Custom message received successfully", customMessage);
          scrollToBottom();
        },
      })
    );

    return () => CometChat.removeMessageListener(listenerID);
  }, [guid]);

  // let messagesRequest;
  const limit = 100;
  let messagesRequest = useRef(null);

  useEffect(() => {
    // let limit = 30;
    messagesRequest.current = new CometChat.MessagesRequestBuilder()
      .setGUID(guid)
      .setLimit(limit)
      .build();

    setMessages([]);
  }, [guid]);

  const getMessages = async () => {
    setLoading(true);
    messagesRequest.current.fetchPrevious().then(
      (messages) => {
        setLoading(false);
        setMessages((msgs) => [...msgs, ...messages.reverse()]);
      },
      (error) => {
        console.log("Message fetching failed with error:", error);
      }
    );
  };

  const sendMessage = () => {
    let receiverType = "group";
    let textMessage = new CometChat.TextMessage(
      guid,
      messageText.trim(),
      receiverType
    );

    CometChat.sendMessage(textMessage).then(
      (message) => {
        console.log("Message sent successfully:", message);
        setMessages([...messages, message]);
        setMessageText("");
        scrollToBottom();
      },
      (error) => {
        console.log("Message sending failed with error:", error);
      }
    );
  };

  const deleteMessage = (msgId) => {
    console.log("print=-=");
    let messageId = msgId;

    CometChat.deleteMessage(messageId).then(
      (message) => {
        getMessages();
        console.log("Message deleted", message);
      },
      (error) => {
        console.log("Message delete failed with error:", error);
      }
    );
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "External Storage Write Permission",
            message: "App needs write permission",
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert("Write permission err", err);
      }
      return false;
    } else return true;
  };
  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
          }
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  useEffect(() => {
    getMessages();
  }, [guid, groupsJoined]);

  useEffect(() => {
    CometChat.getLoggedinUser().then((user) => {
      setUserDetail(user);
    });
  }, [guid]);

  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };

  const sendMediaMsg = (file) => {
    console.log(file.type.split("/")[0]);
    let receiverID = guid;
    let messageType;
    if (file.type.split("/")[0] === "video")
      messageType = CometChat.MESSAGE_TYPE.VIDEO;
    else if (file.type.split("/")[0] === "image")
      messageType = CometChat.MESSAGE_TYPE.IMAGE;
    else messageType = CometChat.MESSAGE_TYPE.FILE;

    let receiverType = CometChat.RECEIVER_TYPE.GROUP;
    let mediaMessage = new CometChat.MediaMessage(
      receiverID,
      file,
      messageType,
      receiverType
    );

    CometChat.sendMediaMessage(mediaMessage).then(
      (message) => {
        console.log("Media message sent successfully", message);
        setMessages([...messages, message]);
      },
      (error) => {
        console.log("Media message sending failed with error", error);
      }
    );
  };

  const openGallery = async () => {
    let result = await launchImageLibrary(
      {
        //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        // aspect: [4, 3],
        quality: 1,
      },
      (res) => console.log(res)
    );
    if (result?.canceled) {
      // Handle cancellation...
      setVisible(false);
      return;
    }
    if (!result.canceled) {
      setVisible(false);
      //   console.log(result);
      var file = {
        name: Platform.OS === "android" ? result.assets[0].fileName : name,
        type: Platform.OS === "android" ? result.assets[0].type : type,
        uri:
          Platform.OS === "android"
            ? result.assets[0].uri
            : result.assets[0].uri.replace("file://", ""),
      };
      //   setMediaMsg({file});
      sendMediaMsg(file);
      //   UploadImage(result.assets[0]);
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log("print document res", res);
      const file = {
        name: res[0].name,
        type: res[0].type,
        uri: res[0].uri,
      };
      setVisible(false);
      sendMediaMsg(file);
    } catch (error) {
      console.log(error);
    }
  };

  const pickVideo = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      console.log("print document res", res);
      const file = {
        name: res[0].name,
        type: res[0].type,
        uri: res[0].uri,
      };
      setVisible(false);
      sendMediaMsg(file);
    } catch (error) {
      console.log(error);
    }
  };

  const captureImage = async (type) => {
    console.log("call");
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: "low",
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    // console.log(isCameraPermitted);

    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        setVisible(false);
        if (response.didCancel) {
          return;
        } else if (response.errorCode == "camera_unavailable") {
          alert("Camera not available on device");
          return;
        } else if (response.errorCode == "permission") {
          alert("Permission not satisfied");
          return;
        } else if (response.errorCode == "others") {
          alert(response.errorMessage);
          return;
        }

        const file = {
          name: response?.assets[0]?.fileName,
          type: response?.assets[0]?.type,
          uri: response?.assets[0]?.uri,
        };
        setVisible(false);
        sendMediaMsg(file);
      });
    }
  };

  const openUrl = async ({ url }) => {
    console.log(url);
    const formattedURL = url.startsWith("http") ? url : `https://${url}`;
    await Linking.openURL(formattedURL);
  };

  const highlightURLs = (text) => {
    const urlRegex =
      /(?:^|\s)(?:(?:https?:\/\/)?(?:www\.)?|(?:www\.))([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}(?:\/[^\s]*)?)(?=$|\s)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <TouchableOpacity onPress={() => openUrl({ url: part })}>
            <Text key={index} style={{ color: "#039be5", marginBottom: 2 }}>
              {part}
            </Text>
          </TouchableOpacity>
        );
      } else if (part !== "")
        return <Text style={{ color: "black", marginBottom: 2 }}>{part}</Text>;
    });
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 7,
      }}
    >
      {loading && (
        <View style={{ marginVertical: 10 }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id + Math.random()}
        inverted
        onEndReached={getMessages}
        onEndReachedThreshold={1}
        renderItem={(itemData) => {
          const m = itemData.item;
          if (m.data.action === "joined")
            return (
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "#969696",
                  marginTop: 5,
                  padding: 5,
                  paddingHorizontal: 7,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#fff" }}>{m.message}</Text>
              </View>
            );

          return m.data.text ? (
            <View
              style={{
                alignSelf:
                  userDetail?.name == m?.sender.name
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  backgroundColor:
                    userDetail?.name == m?.sender.name ? "#e7f3fe" : "#fff",
                  marginTop: 5,
                  maxWidth: "80%",
                  minWidth: 80,
                  marginLeft: 10,
                  borderRadius: 10,
                  marginRight: 6,
                  elevation: 2,
                  alignSelf:
                    userDetail?.name == m?.sender.name
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <TouchableOpacity
                  onLongPress={() => {
                    Alert.alert(
                      "Delete Message",
                      "Are you sure you want to delete message?",
                      [
                        {
                          text: "Cancel",
                          onPress: () => {
                            return null;
                          },
                        },
                        {
                          text: "Confirm",
                          onPress: async () => {
                            deleteMessage(m?.id);
                          },
                        },
                      ],
                      { cancelable: false }
                    );
                  }}
                >
                  <Text
                    style={{
                      color: "#7f67fc",
                      fontSize: 14,
                      marginBottom: 2,
                      marginLeft: 0,
                      fontWeight: "400",
                    }}
                  >
                    {m.data.entities.sender.entity.name.split(" ")[0]}
                  </Text>
                  {highlightURLs(m.data.text)}
                </TouchableOpacity>
                <Text
                  style={{
                    padding: 1,
                    fontSize: 11,
                    color: "#8A8A8A",
                    alignSelf: "flex-end",
                  }}
                >
                  {moment.unix(m?.sentAt).format("h:mm a")}
                </Text>
              </View>
            </View>
          ) : (
            m.data.attachments && m.data.attachments[0].url !== "" && (
              <View
                style={{
                  backgroundColor:
                    userDetail?.name == m?.sender.name ? "#e7f3fe" : "#fff",
                  margin: 5,
                  width: 210,
                  borderRadius: 10,
                  alignSelf:
                    userDetail?.name == m?.sender.name
                      ? "flex-end"
                      : "flex-start",
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    marginBottom: 5,
                    fontSize: 14,
                    fontWeight: "400",
                    color: "#f57830",
                  }}
                >
                  {m.data.entities.sender.entity.name.split(" ")[0]}
                </Text>
                <View>
                  {m.data?.attachments[0].url.indexOf(".pdf") != -1 ? (
                    <PdfMessage
                      pdfDetails={m.data.attachments[0]}
                      isSent={userDetail?.name == m?.sender.name}
                    />
                  ) : m.data.type === "image" ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                      ) : (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setIsShowingMedia(true);
                            setMediaDetails({
                              url: m.data.attachments[0].url,
                              type: "image",
                            });
                            setTabBarVisible(false);
                          }}
                        >
                          <Image
                            source={{
                              uri:
                                m.data.attachments && m.data.attachments[0].url,
                              height: 180,
                              width: 200,
                            }}
                            style={{
                              resizeMode: "cover",
                              borderRadius: 7,
                              marginBottom: 5,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    m.data.type === "video" && (
                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        {loading ? (
                          <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                          <VideoMessage
                            setIsShowingMedia={setIsShowingMedia}
                            setMediaDetails={setMediaDetails}
                            setTabBarVisible={setTabBarVisible}
                            url={m.data.attachments[0].url}
                          />
                        )}
                      </View>
                    )
                  )}
                  <Text
                    style={{
                      marginRight: 6,
                      marginBottom: 6,
                      fontSize: 11,
                      alignSelf: "flex-end",
                      color: "#8A8A8A",
                    }}
                  >
                    {moment.unix(m?.sentAt).format("h:mm a")}
                  </Text>
                </View>
              </View>
            )
          );
        }}
      />

      <View
        style={{
          flexDirection: "row",
          marginBottom: 73,
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <InputComponent
          setTextInput={setMessageText}
          textInput={messageText}
          onPressAttach={toggleBottomNavigationView}
          onPressCamera={() => captureImage("photo")}
          onPressSend={sendMessage}
        />
      </View>
      <BottomSheet
        visible={visible}
        onBackButtonPress={toggleBottomNavigationView}
        onBackdropPress={toggleBottomNavigationView}
      >
        <View style={styles.bottomNavigationView}>
          <TouchableOpacity
            onPress={openGallery}
            style={{ alignItems: "center" }}
          >
            <View style={styles.button}>
              <Image
                style={{ width: 20, height: 20, color: "blue" }}
                source={require("../assets/images/image-gallery.png")}
              />
            </View>
            <Text style={{ color: "#fff" }}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickDocument}
            style={{ alignItems: "center" }}
          >
            <View style={styles.button}>
              <Image
                style={{ width: 20, height: 20, color: "blue" }}
                source={require("../assets/images/google-docs.png")}
              />
            </View>
            <Text style={{ color: "#fff" }}>Document</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickVideo}
            style={{ alignItems: "center" }}
          >
            <View style={styles.button}>
              <Image
                style={{ width: 20, height: 20, color: "blue" }}
                source={require("../assets/images/video.png")}
              />
            </View>
            <Text style={{ color: "#fff" }}>Video</Text>
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
    color: "#000",
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
    backgroundColor: "#fff",
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
    // backgroundColor: Colors.primary,
    width: "100%",
    height: 200,
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default GroupDetails;
