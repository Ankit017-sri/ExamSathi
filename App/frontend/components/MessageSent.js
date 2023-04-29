import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import FullscreenImage from "./ImageView";
import PDFViewer from "./PDFViewer";
import { format } from "timeago.js";
import AuthContext from "../auth/context";
import axios from "axios";
import baseUrl from "../baseUrl";
import ChatContext from "../chat/context";

const MessageSent = ({
  msg,
  setSendMessage,
  message,
  group,
  setReplyMessage,
  setMessage,
  socket,
}) => {
  const { Id, token } = useContext(AuthContext);
  const { replyMessage } = useContext(ChatContext);

  // socket.current.disconnect();
  useEffect(() => {
    console.log("above...");
    // console.log(sendMessage);
    setSendMessage(() => {
      async () => {
        if (message) {
          const res = await axios
            .post(
              `${baseUrl}/message`,
              {
                text: message,
                replyOn: replyMessage._id ? replyMessage : {},
                group,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .catch((e) => console.log(e));
          if (!res.data.text) {
            return alert("something went wrong please try again !");
          } else {
            console.log(res.data);
            setReplyMessage({});
            socket.current.emit("message", { message: res.data, group });
            setMessage("");
          }
        }
      };
    });
    console.log("send....");
  }, []);
  return (
    <View style={{ marginBottom: 6, borderRadius: 10 }}>
      {msg.replyOn?.name && (
        <View
          style={{
            minWidth: "55%",
            maxWidth: "95%",
            backgroundColor: "#DEF6D4",
            borderRadius: 12,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
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
                {msg.replyOn.senderId == Id ? "you" : msg.replyOn.name}
              </Text>
            </View>
            {msg.replyOn.uri ? (
              <>
                {msg.replyOn.uri.split(".").slice(-1)[0] == "pdf" ? (
                  <PDFViewer url={msg.replyOn.uri} name={msg.replyOn.pdfName} />
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
          minWidth: "55%",
          maxWidth: "95%",
          backgroundColor: "#E7FFDD",
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderTopRightRadius: msg.replyOn?.name ? 0 : 12,
          borderTopLeftRadius: msg.replyOn?.name ? 0 : 12,
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
          <Text
            style={{
              color: "#000",
              fontSize: 16,
              marginHorizontal: 6,
              marginVertical: 4,
            }}
          >
            {msg.text}
          </Text>
        )}
        <Text style={{ color: "#000", textAlign: "right", fontSize: 10 }}>
          {format(msg.createdAt)}
        </Text>
      </View>
    </View>
  );
};

export default MessageSent;

const styles = StyleSheet.create({});