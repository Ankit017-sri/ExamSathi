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
        backgroundColor: "#084347",
        borderRadius: 20,
        padding: 3,
      }}
    >
      <TextInput
        placeholder="  send message"
        placeholderTextColor={"gray"}
        onChangeText={setTextInput}
        value={textInput}
        multiline={true}
        numberOfLines={100}
        onContentSizeChange={handleContentSizeChange}
        style={[
          { height: Math.max(40, textInputHeight) },
          { fontSize: 14, color: "white", paddingLeft: 16, width: "70%" },
        ]}
        // onFocus={() => setTabBarVisible(false)}
        // onBlur={() => setTabBarVisible(true)}
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
          style={{ paddingRight: 12 }}
          color={"white"}
          onPress={onPressCamera}
        />
        <Icon
          name="attach"
          size={24}
          style={{ marginRight: 14 }}
          color={"white"}
          onPress={onPressAttach}
        />
        <Icon
          name="send"
          size={26}
          disabled={textInput !== "" ? false : true}
          style={
            textInput !== ""
              ? { paddingRight: 9 }
              : { paddingRight: 9, opacity: 0.4, color: "white" }
          }
          color={"white"}
          onPress={onPressSend}
        />
      </View>
    </View>
  );
};

export default InputComponent;
