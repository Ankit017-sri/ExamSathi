import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import ChatContext from "../chat/context";
// import MessageSent from "./MessageSent";

const SwipeableMessage = ({
  data,
  Id,
  MessageRecieved,
  setMessage,
  socket,
  MessageSent,
  message,
  group,
  setSendMessage,
}) => {
  const { setReplyMessage } = useContext(ChatContext);
  const swipeableRef = useRef(null);
  // console.log("setSendMessage");
  // console.log(data);

  const closeSwipeable = () => {
    console.log("closed");
    // swipeableRef.current.close();
  };
  const swipeFromLeftOpen = (data) => {
    if (data.replyOn) {
      delete data.replyOn;
    }
    //console.log(data);
    setReplyMessage(data);
    swipeableRef.current.close();
  };

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    return (
      <TouchableOpacity
        style={{ padding: 4 }}
        onPress={() => {
          console.log("pressed");
          swipeableRef.current.close();
        }}
      >
        <Animated.View
          style={[styles.buttonText, { transform: [{ translateX: trans }] }]}
        >
          <Ionicons name="arrow-undo" size={20} color={"cyan"} />
        </Animated.View>
      </TouchableOpacity>
    );
  };
  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      // overshootRight={false}
      // overshootLeft={false}
      onSwipeableLeftOpen={() => swipeFromLeftOpen(data)}
      onSwipeableWillClose={closeSwipeable}
      style={styles.message}
      ref={swipeableRef}
    >
      {data.senderId == Id ? (
        <View style={styles.messageSent}>
          <MessageSent
            msg={data}
            setSendMessage={setSendMessage}
            message={message}
            group={group}
            socket={socket}
            setMessage={setMessage}
            setReplyMessage={setReplyMessage}
          />
        </View>
      ) : (
        <View style={styles.messageRecieved}>
          <MessageRecieved msg={data} />
        </View>
      )}
    </Swipeable>
  );
};

export default SwipeableMessage;

const styles = StyleSheet.create({
  message: {
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginBottom: 3,
    paddingHorizontal: 6,
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
});
