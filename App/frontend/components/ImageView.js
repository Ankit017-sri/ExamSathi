import React, {useState} from 'react';
import {View, Modal, Image, TouchableOpacity} from 'react-native';
import {Ionicons} from 'react-native-vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';

const FullscreenImage = ({imageSource}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const images = [
    {
      url: imageSource,
      // width: 1000,
      // height: 1000,
    },
  ];
  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{uri: imageSource}}
          style={{maxwidth: 300, minHeight: 250}}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={false}
        style={{backgroundColor: 'black'}}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{
            position: 'absolute',
            bottom: 40,
            alignSelf: 'center',
            zIndex: 40,
          }}>
          <Ionicons name="close" color="black" size={40} />
        </TouchableOpacity>
        {/* <Image
          source={{ uri: imageSource }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        /> */}
        <ImageViewer
          imageUrls={images}
          backgroundColor={'#fff'}
          renderIndicator={() => null}
        />
      </Modal>
    </View>
  );
};

export default FullscreenImage;
