import React from "react";
import { Dimensions, Text, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import VideoPlayer from "react-native-video-player";

const MediaViewer = ({ mediaDetails }) => {
  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width,
        backgroundColor: "black",
      }}
    >
      {mediaDetails.type === "video" && (
        <VideoPlayer
          video={{
            uri: mediaDetails.url,
          }}
          showDuration
          videoWidth={Dimensions.get("screen").width}
          pauseOnPress
          autoplay
        />
      )}
      {mediaDetails.type === "image" && (
        <ImageViewer
          imageUrls={[
            {
              url: mediaDetails.url,
            },
          ]}
          style={{ height: Dimensions.get("screen").height }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default MediaViewer;
