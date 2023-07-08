import { View, Text } from "react-native";
import React, { useState } from "react";
import IconCamera from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native-gesture-handler";
const InputComponent = () => {
  const [textInput, setTextInput] = useState("");
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

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#084347",
        borderRadius: 20,
        padding: 3,
        margin: 2,
        //you can change position option!
        position: "absolute",
        bottom: 0,
      }}
    >
      <TextInput
        placeholder="  send message"
        placeholderTextColor={"gray"}
        onChangeText={setTextInput}
        multiline={true}
        numberOfLines={100}
        onContentSizeChange={handleContentSizeChange}
        style={[
          { height: Math.max(40, textInputHeight) },
          { fontSize: 14, color: "white", paddingLeft: 16, width: "70%" },
        ]}
      />

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "#084347",
          borderRadius: 12,
          padding: 3,
        }}
      >
        <IconCamera
          name="camera"
          size={20}
          style={{ paddingRight: 9 }}
          color={"white"}
        />
        <Icon
          name="attach"
          size={24}
          style={{ paddingRight: 9 }}
          color={"white"}
        />
        <Icon
          name="send"
          size={20}
          disabled={textInput !== "" ? false : true}
          style={
            textInput !== ""
              ? { paddingRight: 9 }
              : { paddingRight: 9, opacity: 0.4, color: "white" }
          }
          color={"white"}
        />
      </View>
    </View>
  );
};

export default InputComponent;
