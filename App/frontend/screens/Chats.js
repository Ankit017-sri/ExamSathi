import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Linking,
} from 'react-native';
import {io} from 'socket.io-client';
import axios from 'axios';
import baseUrl from '../baseUrl';
import CustomHeader from '../components/CustomHeader';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import AuthContext from '../auth/context';
import {format} from 'timeago.js';
import Icon from 'react-native-vector-icons/Ionicons';
import CloudURL from '../CloudURL';
import FullscreenImage from '../components/ImageView';
import {BottomSheet} from 'react-native-btr';
import cache from '../utilities/cache';
import {useFocusEffect} from '@react-navigation/native';
import ChatContext from '../chat/context';
import SwipeableMessage from '../components/SwipeableMessage';
import Colors from '../constants/Colors';
import PDFViewer from '../components/PDFViewer';

const ChatsScreen = ({navigation, route}) => {
  const {group, fetchedData, title, imgUri} = route?.params;
  const {token, setTabBarVisible, Id, name: fullName} = useContext(AuthContext);

  const {
    memCount: counts,
    replyMessage,
    setReplyMessage,
  } = useContext(ChatContext);

  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiveMessage, setRecieveMessage] = useState(null);
  const [len, setLen] = useState(0);
  const [memCount, setMemCount] = useState();
  const [image, setImage] = useState();
  const [uploading, setUploading] = useState(false);
  const [visible, setVisible] = useState(false);
  const socket = useRef();
  const scrollRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    setTabBarVisible(false);
    setMessages(fetchedData);
    setMemCount(counts);
    scrollRef.current.scrollToEnd({animated: false});
    (async () => {
      const response = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
      });
    })();

    return async () => {
      await cache.store(`${group}`, fetchedData);
      await cache.store(`${group}latest`, fetchedData.slice(-1));
      setReplyMessage({});
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    socket.current = io(baseUrl);

    socket.current.emit('new-user-add', {Id, group});
    socket.current.on('get-active-users', data => {
      setLen(data);
    });
    socket.current.on('message-recieve', data => {
      setRecieveMessage(data);
    });
    return () => {
      socket.current.emit('leaveGroup', group);
    };
  }, [Id]);

  useEffect(() => {
    if (receiveMessage) {
      setMessages([...messages, receiveMessage]);
      fetchedData.push(receiveMessage);
      scrollRef.current.scrollToEnd({animated: false});
    }
  }, [receiveMessage?.createdAt]);

  const getBase64 = async uri => {
    try {
      const fileUri = uri;
      const base64 = await RNFS.readFile(fileUri, 'base64');
      return base64;
    } catch (error) {
      console.log('Error in getBase64:', error);
      return null;
    }
  };

  // const handleImageUpload = async () => {
  //   const options = {
  //     title: 'Select Image',
  //     mediaType: 'photo',
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };

  //   ImagePicker.launchImageLibrary(options, async response => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error:', response.error);
  //     } else {
  //       const base64 = await getBase64(response.uri);
  //       const imageData = {
  //         data: base64,
  //         filename:
  //           response.fileName ||
  //           response.uri.substr(response.uri.lastIndexOf('/') + 1),
  //       };

  //       setImage(imageData);
  //       handleUpload(imageData, 'image');
  //     }
  //   });
  // };

  const handleImageUpload = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
      });

      const imageData = {
        data: image.data,
        filename: image.path.substr(image.path.lastIndexOf('/') + 1),
      };

      setImage(imageData);
      handleUpload(imageData, 'image');
    } catch (error) {
      console.log('Error in picking image:', error);
    }
  };

  const handleDocumentUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const base64 = await RNFS.readFile(res.uri, 'base64');
      const documentData = {
        data: base64,
        filename: res.name,
      };

      handleUpload(documentData, 'document');
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled document picker');
      } else {
        console.log('DocumentPicker Error:', error);
      }
    }
  };

  const handleUpload = async (fileData, type) => {
    setUploading(true);

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const {data} = await axios.post(
        `${baseUrl}/group/upload`,
        {
          groupId: group,
          type,
          fileData,
        },
        {headers},
      );

      if (data.success) {
        const {message, createdAt, sender, _id} = data;
        const newMessage = {message, createdAt, sender, _id, type};

        setMessages([...messages, newMessage]);
        fetchedData.push(newMessage);
        scrollRef.current.scrollToEnd({animated: false});
        setMessage('');
        setImage(null);
      } else {
        console.log('Error in file upload:', data.error);
      }
    } catch (error) {
      console.log('Error in file upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === '' && !image && !uploading) {
      return;
    }

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const newMessage = {
      message: message.trim(),
      sender: Id,
      group,
    };

    try {
      const {data} = await axios.post(`${baseUrl}/group/message`, newMessage, {
        headers,
      });

      if (data.success) {
        const {message, createdAt, sender, _id} = data;
        const newMessage = {message, createdAt, sender, _id};

        setMessages([...messages, newMessage]);
        fetchedData.push(newMessage);
        scrollRef.current.scrollToEnd({animated: false});
        setMessage('');
      } else {
        console.log('Error in sending message:', data.error);
      }
    } catch (error) {
      console.log('Error in sending message:', error);
    }
  };

  const openFile = (url, fileName) => {
    const fileExtension = fileName.split('.').pop();
    const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];

    if (supportedExtensions.includes(fileExtension.toLowerCase())) {
      if (fileExtension.toLowerCase() === 'pdf') {
        navigation.navigate('PDFViewer', {url});
      } else {
        navigation.navigate('ImageViewer', {url});
      }
    } else {
      Linking.openURL(url);
    }
  };

  const handleReplyMessage = item => {
    setReplyMessage(item);
    inputRef.current.focus();
  };

  const deleteMessage = async messageId => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const {data} = await axios.delete(
        `${baseUrl}/group/message/${messageId}`,
        {headers},
      );

      if (data.success) {
        const updatedMessages = messages.filter(
          message => message._id !== messageId,
        );
        setMessages(updatedMessages);
      } else {
        console.log('Error in deleting message:', data.error);
      }
    } catch (error) {
      console.log('Error in deleting message:', error);
    }
  };

  const renderMessage = (item, index) => {
    return (
      <SwipeableMessage
        key={index}
        message={item}
        fullName={fullName}
        handleReplyMessage={handleReplyMessage}
        deleteMessage={deleteMessage}
        openFile={openFile}
      />
    );
  };

  const renderImage = () => {
    if (image) {
      return (
        <View style={styles.imageContainer}>
          <Image source={{uri: image.uri}} style={styles.image} />
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setImage(null)}>
            <Icon name="close" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <CustomHeader
          title={title}
          navigation={navigation}
          backButton={true}
          imageUri={imgUri}
          len={len}
        />
        <ScrollView ref={scrollRef} style={{flex: 1}}>
          <View style={styles.container}>{messages.map(renderMessage)}</View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => setVisible(true)}>
            <Icon name="attach" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            multiline
            ref={inputRef}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Icon name="send" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <BottomSheet
          visible={visible}
          onBackButtonPress={() => setVisible(false)}
          onBackdropPress={() => setVisible(false)}>
          <View style={styles.bottomSheetContainer}>
            <TouchableOpacity
              style={styles.bottomSheetButton}
              onPress={handleImageUpload}>
              <Icon name="image" size={25} color={Colors.primary} />
              <Text style={styles.bottomSheetText}>Choose Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomSheetButton}
              onPress={handleDocumentUpload}>
              <Icon name="document" size={25} color={Colors.primary} />
              <Text style={styles.bottomSheetText}>Choose Document</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
        {renderImage()}
        {replyMessage.message && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyText}>{replyMessage.message}</Text>
            <TouchableOpacity
              style={styles.cancelReplyButton}
              onPress={() => setReplyMessage({})}>
              <Icon name="close" size={15} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.white,
  },
  attachButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bottomSheetContainer: {
    backgroundColor: Colors.white,
    padding: 20,
  },
  bottomSheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  bottomSheetText: {
    marginLeft: 15,
    fontSize: 16,
  },
  imageContainer: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  replyContainer: {
    position: 'absolute',
    bottom: 110,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 10,
  },
  replyText: {
    flex: 1,
    color: Colors.white,
    marginRight: 10,
  },
  cancelReplyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default ChatsScreen;
