import React from "react";
import { View, Image, TouchableOpacity, Linking } from "react-native";

function YouTubePlayer({ link }) {
  const handlePress = () => {
    Linking.openURL(link);
  };

  if (!link || link === "") return;

  return (
    <View>
      {
        <TouchableOpacity onPress={handlePress}>
          <Image
            style={{ width: "100%", height: 200 }}
            source={{
              uri: `https://img.youtube.com/vi/${link
                .split("/")
                .slice(-1)}/0.jpg`,
            }}
          />
          <View
            style={{
              position: "absolute",
              alignSelf: "center",
              top: 70,
              // justifyContent: "center",
              // alignItems: "center",
            }}
          >
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../assets/playButton.png")}
            />
          </View>
        </TouchableOpacity>
      }
    </View>
  );
}

export default YouTubePlayer;
