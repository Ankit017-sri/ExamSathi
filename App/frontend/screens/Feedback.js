import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import axios from "axios";
import baseUrl from "../baseUrl";
import AuthContext from "../auth/context";

const Feedback = ({ setIsFeedBack }) => {
  const authContext = useContext(AuthContext);

  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const ref = useRef();

  useEffect(() => {
    getFeedbacks();
  }, []);
  useEffect(() => {
    ref?.current.scrollToEnd({ animated: true });
  }, [feedbacks]);

  const getFeedbacks = async () => {
    const feedbackArr = await axios.get(`${baseUrl}/feedback`, {
      headers: { Authorization: `Bearer ${authContext.token}` },
    });
    console.log(feedbackArr.data);
    setFeedbacks(feedbackArr.data);
  };

  const sendFeedBack = async () => {
    const message = feedback.trimStart();
    const arr = message.split(" ");

    if (arr[0] === "") {
      return Alert.alert(
        "Feedback is Empty!",
        "please enter your feedback message!"
      );
    }
    Keyboard.dismiss();
    const res = await axios
      .post(
        `${baseUrl}/feedback`,
        { feedback: message },
        {
          headers: { Authorization: `Bearer ${authContext.token}` },
        }
      )
      .catch((e) => console.log(e));
    setFeedbacks([...feedbacks, res.data]);
    setFeedback("");
    Alert.alert(
      "feedback sent successfully!",
      "Thank you again! We’re looking forward to making your experience even better in the future!"
    );
  };

  const Header = ({ title }) => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{
            left: 10,
            position: "absolute",
            alignSelf: "flex-end",
            bottom: 5,
          }}
          onPress={() => setIsFeedBack(false)}
        >
          <Ionicons name="arrow-back-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Header title="Feedback" />
      <FlatList
        style={{
          marginBottom: 20,
          marginTop: 10,
          paddingVertical: 10,
          marginHorizontal: 20,
        }}
        data={feedbacks}
        ref={ref}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View
            style={{
              ...styles.card,
              marginBottom: 10,
              paddingHorizontal: 6,
            }}
          >
            <Text
              style={{
                marginLeft: 6,

                flex: 1,
                paddingVertical: 10,

                fontSize: 16,
              }}
            >
              {item.message}
            </Text>
          </View>
        )}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View>
              <Text style={{ marginHorizontal: 20 }}>
                Send us your feedback
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={feedback}
                  multiline={true}
                  numberOfLines={6}
                  onChangeText={(text) => setFeedback(text)}
                  placeholder=" Type your feedback here..."
                />
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    borderRadius: 5,
                    height: 40,
                    width: "100%",
                    backgroundColor: "#90AAD5",
                    marginTop: 10,
                    marginBottom: 20,
                    // marginRight: 40,
                  }}
                  activeOpacity={0.6}
                  onPress={() => sendFeedBack()}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: Colors.primary,
                    }}
                  >
                    Send feedback
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 0.93,
  },
  headerContainer: {
    width: "100%",
    height: 45 + Constants.statusBarHeight,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "flex-end",
    elevation: 5,
    marginBottom: 5,
    paddingBottom: 10,
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
  },
  inputContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#17cfe3",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 5,
    padding: 15,
    paddingVertical: 25,
    elevation: 5,
    backgroundColor: "#BCCCE5",
    justifyContent: "space-evenly",
  },
});
