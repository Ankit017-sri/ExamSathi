import { CometChat } from '@cometchat-pro/react-native-chat';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Image,
  KeyboardAvoidingView, Linking,
  Platform, StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,PermissionsAndroid,
  View,Alert,ActivityIndicator
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { BottomSheet } from 'react-native-btr';
import moment from 'moment';
const GroupDetails = ({ guid }) => {
  console.log('print group id---pass value', guid)
  const [groupDetails, setGroupDetails] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [visible, setVisible] = useState(false);
  const [mediaMsg, setMediaMsg] = useState();
  const[dateSave,setDateSave]=useState('')
  const [userDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let listenerID = 'ExamSathi232829';

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          setMessages([...messages, textMessage]);
        },
        onMediaMessageReceived: mediaMessage => {
          console.log('Media message received successfully', mediaMessage);
        },
        onCustomMessageReceived: customMessage => {
          console.log('Custom message received successfully', customMessage);
        },
      })
    );

    return () => CometChat.removeMessageListener(listenerID);
  }, []);

  const getMessages = async () => {
    let limit = 30;
    // let latestId = await CometChat.getLastDeliveredMessageId();
    var messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(guid)
      .setLimit(limit)
      // .setMessageId(latestId)
      .build();
    messagesRequest.fetchPrevious().then(
      messages => {
        // console.log('Message list fetched:', messages);
        setMessages(messages);
      },
      error => {
        console.log('Message fetching failed with error:', error);
      },
    );
  };

  const sendMessage = () => {
    let receiverType = 'group';
    let textMessage = new CometChat.TextMessage(
      guid,
      messageText,
      receiverType,
    );

    CometChat.sendMessage(textMessage).then(
      message => {
        console.log('Message sent successfully:', message);
        setMessages([...messages, message]);
        setMessageText('');
      },
      error => {
        console.log('Message sending failed with error:', error);
      },
    );
  };

  const deleteMessage = (msgId) => {
    console.log('print=-=')
    let messageId = msgId;

    CometChat.deleteMessage(messageId).then(
      message => {
        getMessages();
        console.log("Message deleted", message);
      }, error => {
        console.log("Message delete failed with error:", error);
      }
    );
  }


  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  useEffect(() => {
    CometChat.getGroup(guid).then(
      group => {
        // console.log('Group details fetched successfully:', group);
        setGroupDetails(group);
      },
      error => {
        // console.log('Group details fetching failed with exception:', error);
      },
    );
    setTimeout(() => {
      setLoading(false);
    }, 2500);
    getMessages();
  }, []);

  useEffect(() => {
    CometChat.getLoggedinUser().then(
      user => {
        setUserDetail(user)
      })
  }, [guid]);

  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };

  const sendMediaMsg = file => {
    let receiverID = guid;
    let messageType = CometChat.MESSAGE_TYPE.FILE;
    let receiverType = CometChat.RECEIVER_TYPE.GROUP;
    let mediaMessage = new CometChat.MediaMessage(
      receiverID,
      file,
      messageType,
      receiverType,
    );

    CometChat.sendMediaMessage(mediaMessage).then(
      message => {
        console.log('Media message sent successfully', message);
        setMessages([...messages, message]);
      },
      error => {
        console.log('Media message sending failed with error', error);
      },
    );
  };
  

  const openGallery = async () => {
    let result = await launchImageLibrary({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      // aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled) {
      // Handle cancellation...
      setVisible(false);
      return;
    }
    if (!result.canceled) {
      setVisible(false);
      //   console.log(result);
      var file = {
        name: Platform.OS === 'android' ? result.assets[0].fileName : name,
        type: Platform.OS === 'android' ? result.assets[0].type : type,
        uri:
          Platform.OS === 'android'
            ? result.assets[0].uri
            : result.assets[0].uri.replace('file://', ''),
      };
      //   setMediaMsg({file});
      sendMediaMsg(file);
      //   UploadImage(result.assets[0]);
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('print document res',res)
      const file = {
        name: res[0].name,
        type: res[0].type,
        uri: res[0].uri,
      };
      setVisible(false);
      sendMediaMsg(file);
    } catch (error) {
      console.log(error);
    }
  };
  const captureImage = async (type) => {
    console.log('call')
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
  
    if (isCameraPermitted && isStoragePermitted) {
      console.log('callper')
      launchCamera(options, (response) => {
        console.log('Response = ', response);
        setVisible(false);
        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        const file = {
          name: response?.assets[0]?.fileName,
          type: response?.assets[0]?.type,
          uri: response?.assets[0]?.uri,
        };
        setVisible(false);
        sendMediaMsg(file);
        console.log('width ->image ', response);
        console.log('width ->image ', response?.assets[0]?.uri);
        
      });
    }
  };

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
  };

  return (
    <View style={{ flex: 1 }}>

      <StatusBar barStyle={'dark-content'} backgroundColor='transparent' translucent />

      <ScrollView>
        {messages.map(m =>
          m.data.text ? (
            <View style={{
               alignSelf: userDetail?.name == m?.sender.name ? 'flex-end':'flex-start',
            }}>
            <View style={{
              padding: 10,
              backgroundColor: userDetail?.name == m?.sender.name ? '#3696FF':'#fff',
              marginVertical: 5,
              maxWidth: '72%',minWidth:80,
              marginLeft: 10,
              borderRadius: 10, marginRight: 6,
              elevation: 2, 
              alignSelf: userDetail?.name == m?.sender.name ? 'flex-end':'flex-start',
            }}>
                <TouchableOpacity onPress={() => {    Alert.alert(
              'Delete Message',
              'Are you sure you want to delete message?',
              [ { text: 'Cancel',
                  onPress: () => {   return null; },  },
                {  text: 'Confirm',
                  onPress: async () => { deleteMessage(m?.id)}, },  ],
              { cancelable: false },
            );  }}>
                <Text
                  style={{
                    color: '#ABAB96',
                    fontSize: 15, fontWeight: 'bold',
                    marginLeft: 0,
                  }}>{m.data.entities.sender.entity.name.split(' ')[0]}
                </Text>
                <Text style={{ fontSize: 15, color: userDetail?.name == m?.sender.name ? '#fff':'#000', marginTop: 5 }}>
                  {m.data.text}
                </Text>
                
              </TouchableOpacity>
            </View>
            <Text style={{padding: 1, marginLeft: 10,marginRight: 6,color:'#8A8A8A'}}>{moment.unix(m?.sentAt).format("h:mm a")}</Text>
            </View>) : ( m.data.attachments && m.data.attachments[0].url !== '' && (
              <View
                style={{ backgroundColor: userDetail?.name == m?.sender.name ? '#3696FF':'#fff', margin: 5,width:210,borderRadius:10, alignSelf: userDetail?.name == m?.sender.name ? 'flex-end':'flex-start',
                }}>
                <Text style={{ marginLeft: 10, marginBottom: 5, fontSize: 14, fontWeight: 'bold',color:'#ABAB96' }}>
                  {m.data.entities.sender.entity.name.split(' ')[0]}
                </Text>

<View> 
                {(m.data?.attachments[0].url.indexOf(".pdf") != -1) ?
                <TouchableOpacity  style={{width:200,height:90,backgroundColor:userDetail?.name == m?.sender.name ? '#3696FF':'#fff',borderRadius:10,alignItems:'center'}}
                 onPress={() => {
                  Linking.openURL(m.data?.attachments[0].url);
                }}> 
                   <Image style={{ width: 35, height: 35 }} source={require('../assets/images/download-pdf.png')} />
                   <Text style={{fontSize:13,fontWeight:'bold'}}>{m.data?.attachments[0]?.name} </Text>
        
                <Text style={{fontSize:13,fontWeight:'bold'}}> CLICK TO OPEN AND DOWNLOAD PDF FILE</Text>
                </TouchableOpacity>
                  :
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : ( <Image
                    source={{
                      uri: m.data.attachments && m.data.attachments[0].url,
                      height: 180,
                      width: 200, margin: 5
                    }}
                    style={{
                      // borderWidth: 2,
                      // borderColor: 'red',
                      marginLeft: 5,
                      marginBottom: 5,resizeMode:'cover'
                    }}  />
                    
                  )}
                </View>
              
                }
                            <Text style={{padding: 1, marginLeft: 10,marginRight: 6,color:'#8A8A8A'}}>{moment.unix(m?.sentAt).format("h:mm a")}</Text>
                </View>
              </View>
            )
          ),
        )}
      </ScrollView>
      <View style={{ flexDirection: 'row', marginBottom: 80, justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={toggleBottomNavigationView} style={{
          height: 35, width: 35, alignItems: 'center', justifyContent: 'center',
          marginHorizontal: 5,
          backgroundColor: '#ADD8E6',
          elevation: 5,
          borderRadius: 20,
        }}>
          <Image style={{ width: 20, height: 20 }} source={require('../assets/images/+.png')} />
        </TouchableOpacity>
        <TextInput
          style={{
            height: 40,
            marginHorizontal: 5,
            backgroundColor: '#ADD8E6',
            elevation: 5,
            borderRadius: 25,
            padding: 10,
            width: '68%',
          }}
          placeholder='Type a Message...'
          value={messageText}
          onChangeText={text => setMessageText(text)}
        />
        {messageText ? (
          <Button title="Send" onPress={sendMessage} />
        ) : (
          <View style={{ backgroundColor: '#ccc', width: 48, height: 38, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFF' }}>SEND</Text>
          </View>
     
        )}
      </View>
      <BottomSheet
        visible={visible}
        onBackButtonPress={toggleBottomNavigationView}
        onBackdropPress={toggleBottomNavigationView}
      >
        <View style={styles.bottomNavigationView}>
          
            <TouchableOpacity
            onPress={() => captureImage('photo')}
            style={{ alignItems: 'center' }}>
            <View style={styles.button}>
              <Image style={{ width: 20, height: 20, color: 'blue' }} source={require('../assets/images/image-gallery.png')} />
            </View>
            <Text style={{ color: '#fff' }}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openGallery}
            style={{ alignItems: 'center' }}>
            <View style={styles.button}>
              <Image style={{ width: 20, height: 20, color: 'blue' }} source={require('../assets/images/image-gallery.png')} />
            </View>
            <Text style={{ color: '#fff' }}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickDocument}
            style={{ alignItems: 'center' }}>
            <View style={styles.button}>
              <Image style={{ width: 20, height: 20, color: 'blue' }} source={require('../assets/images/google-docs.png')} />

            </View>
            <Text style={{ color: '#fff' }}>Document</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  messages: {
    paddingHorizontal: 20,
    // height: "80%",
    // backgroundColor: "#fff",
    // marginTop: 10,
    paddingVertical: 10,
  },
  message: {
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginBottom: 4,
    paddingHorizontal: 6,
  },
  messageText: {
    fontSize: 16,
    marginHorizontal: 6,
    marginVertical: 4,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    top: 8,
    bottom: 8,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    padding: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  messageSent: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  messageRecieved: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    color: '#00ABB3',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
  },
  bottomNavigationView: {
    // backgroundColor: "#17cfe3",
    // backgroundColor: Colors.primary,
    width: '100%',
    height: 200,
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default GroupDetails;
