import { View } from "react-native";
import React, { useContext, useState } from "react";
import IconCamera from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native-gesture-handler";
import AuthContext from "../auth/context";

const InputComponent = ({
  onPressAttach,
  onPressCamera,
  onPressSend,
  setTextInput,
  textInput,
}) => {
  // const [textInput, setTextInput] = useState("");
  const [textInputHeight, setTextInputHeight] = useState(40);
  const MAX_NUMBER_OF_LINES = 3;

  const handleContentSizeChange = (event) => {
    const { contentSize } = event.nativeEvent;
    const calculatedHeight = Math.min(
      contentSize.height,
      MAX_NUMBER_OF_LINES * 20
    );
    setTextInputHeight(calculatedHeight);
  };

  // const { setTabBarVisible } = useContext(AuthContext);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#d2dddd",
        borderRadius: 25,
        padding: 3,
        width: "100%",
        elevation: 5,
      }}
    >
      <TextInput
        placeholder="Send message ..."
        placeholderTextColor={"gray"}
        onChangeText={setTextInput}
        value={textInput}
        multiline={true}
        numberOfLines={100}
        onContentSizeChange={handleContentSizeChange}
        style={[
          { height: Math.max(40, textInputHeight) },
          {
            fontSize: 14,
            color: "black",
            width: "63%",
            marginLeft: 10,
          },
        ]}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "#d2dddd",
          borderRadius: 12,
          padding: 3,
          // width: "30%",
        }}
      >
        <IconCamera
          name="camera"
          size={20}
          style={{ marginRight: 12 }}
          color={"#084347"}
          onPress={onPressCamera}
        />
        <Icon
          name="attach"
          size={26}
          style={{ marginRight: 14 }}
          color={"#084347"}
          onPress={onPressAttach}
        />
      </View>
      <View
        style={{
          backgroundColor: "#084347",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          padding: 8,
          paddingHorizontal: 9,
          borderRadius: 50,
        }}
      >
        <Icon
          name="send"
          size={26}
          disabled={textInput !== "" ? false : true}
          style={
            textInput !== ""
              ? { paddingRight: 0 }
              : { paddingRight: 0, opacity: 0.4, color: "white" }
          }
          color={"white"}
          onPress={onPressSend}
        />
      </View>
    </View>
  );
};

export default InputComponent;
