import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Colors from '../constants/Colors';
import Constants from '../constants/index';
import axios from 'axios';
import baseUrl from '../baseUrl';
import AuthContext from '../auth/context';
import CustomHeader from '../components/CustomHeader';

const Feedback = ({navigation}) => {
  const authContext = useContext(AuthContext);

  const [feedback, setFeedback] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const ref = useRef();

  useEffect(() => {
    getFeedbacks();
  }, []);
  useEffect(() => {
    ref?.current.scrollToEnd({animated: true});
  }, [feedbacks]);

  const getFeedbacks = async () => {
    const feedbackArr = await axios.get(`${baseUrl}/feedback`, {
      headers: {Authorization: `Bearer ${authContext.token}`},
    });
    //console.log(feedbackArr.data);
    setFeedbacks(feedbackArr.data);
  };

  const sendFeedBack = async () => {
    const message = feedback.trimStart();
    const arr = message.split(' ');

    if (arr[0] === '') {
      return Alert.alert(
        'Feedback is Empty!',
        'please enter your feedback message!',
      );
    }
    Keyboard.dismiss();
    const res = await axios
      .post(
        `${baseUrl}/feedback`,
        {feedback: message},
        {
          headers: {Authorization: `Bearer ${authContext.token}`},
        },
      )
      .catch(e => console.log(e));
    setFeedbacks([...feedbacks, res.data]);
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'👑 तुमचे प्रश्नमंजुषा 🌟'}
        isBack={true}
        navigation={navigation}
      />
      <FlatList
        style={{
          marginBottom: 20,
          marginTop: 10,
          paddingVertical: 10,
          marginHorizontal: 20,
        }}
        data={feedbacks}
        ref={ref}
        keyExtractor={item => item._id}
        renderItem={({item, index}) => (
          <View
            style={{
              ...styles.card,
              marginBottom: 10,
              paddingHorizontal: 6,
            }}>
            <Text
              style={{
                marginLeft: 6,

                flex: 1,
                paddingVertical: 10,

                fontSize: 16,
              }}>
              {item.message}
            </Text>
          </View>
        )}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View>
              <Text
                style={{
                  marginHorizontal: 20,
                  marginBottom: 5,
                  fontSize: 16,
                  color: '#23395d',
                }}>
                आता तुमचे प्रश्न पण revision मध्ये येईल 😃
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={feedback}
                  multiline={true}
                  numberOfLines={6}
                  onChangeText={text => setFeedback(text)}
                  placeholder="आपले प्रश्न इथे टाका...."
                />
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    borderRadius: 20,
                    height: 40,
                    width: '100%',
                    backgroundColor: '#1F6E8C',
                    marginTop: 10,
                    marginBottom: 20,
                  }}
                  activeOpacity={0.6}
                  onPress={() => sendFeedBack()}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: 'white',
                    }}>
                    पाठवा
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 0.93,
  },
  headerContainer: {
    width: '100%',
    height: 45 + Constants.statusBarHeight,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'flex-end',
    elevation: 5,
    marginBottom: 5,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
  },
  inputContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#17cfe3',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 5,
    padding: 15,
    paddingVertical: 25,
    elevation: 5,
    backgroundColor: '#a2ebfa',
    justifyContent: 'space-evenly',
  },
});
