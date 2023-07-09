import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import Icon from "react-native-vector-icons/Ionicons";

const VideoMessage = ({
  setIsShowingMedia,
  setMediaDetails,
  setTabBarVisible,
  url,
}) => {
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    createThumbnail({ url }).then((res) => setThumbnail(res.path));
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        setIsShowingMedia(true);
        setMediaDetails({
          url,
          type: "video",
        });
        setTabBarVisible(false);
      }}
      style={styles.container}
      activeOpacity={0.7}
    >
      <ImageBackground
        source={{ uri: thumbnail }}
        resizeMode="cover"
        style={{
          width: "100%",
          height: 200,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(10,10,10,0.2)",
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          <Icon name="play-circle" size={44} color={"white"} />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 6,
  },
  //   backgroundImage: {
  //     flex: 1,
  //     resizeMode: "cover",
  //     width: "100%",
  //     height: "100%",
  //   },
  //   playButtonContainer: {
  //     ...StyleSheet.absoluteFillObject,
  //     alignItems: "center",
  //     justifyContent: "center",
  //   },
  playButton: {
    width: 50,
    height: 50,
  },
});

export default VideoMessage;
