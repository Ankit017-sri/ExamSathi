import React from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import VideoPlayer from 'react-native-video-player';

const MediaViewer = ({mediaDetails}) => {
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
        backgroundColor: 'black',
      }}>
      <Text>MediaViewer</Text>
      {mediaDetails.type === 'video' && (
        <VideoPlayer
          video={{
            uri: mediaDetails.url,
          }}
          showDuration
          // controlsTimeout={2000}
          videoWidth={Dimensions.get('screen').width}
          pauseOnPress
          autoplay
        />
      )}
      {mediaDetails.type === 'image' && (
        <Image
          source={{
            uri: mediaDetails.url,
          }}
          style={{height: Dimensions.get('screen').height}}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default MediaViewer;
