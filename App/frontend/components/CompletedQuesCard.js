import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Colors from '../constants/Colors';
import CompletedTestOptionCircle from './CompletedTestOptionCircle';

const CompletedQuesCard = ({
  quesData,
  submittedQuizData,
  navigation,
  selectedOp,
  quesNo,
  setScore,
  score,
}) => {
  const [selectedOption, setSelectedOption] = useState();

  const foundObject = submittedQuizData?.find(
    e => e.quesIndex === (quesData.qNo ? quesData.qNo : quesNo) - 1,
  );

  useEffect(() => {
    setSelectedOption(quesData.correctOp);
  });

  let bgColor = '';

  if ((foundObject?.value || selectedOp) == quesData.correctOp) {
    bgColor = 'green';
    if (score) setScore(score + 1);
  } else if ((foundObject?.value || selectedOp) !== quesData.correctOp) {
    bgColor = 'red';
  }

  const [selOp, setSelOp] = useState(foundObject?.value || selectedOp);
  const correctOption = quesData.correctOp;

  return (
    <View style={styles.quesContainer}>
      <Text style={styles.quesText}>
        <Text style={{fontWeight: 'bold'}}>
          {quesData.qNo ? quesData.qNo : quesNo})
        </Text>{' '}
        {quesData.ques}
      </Text>
      <Text style={styles.quesText}>{quesData.hindiQues}</Text>

      {!foundObject && !selectedOp ? (
        <Text style={{color: 'red', fontWeight: 'bold'}}>Not Attempted</Text>
      ) : (foundObject?.value || selectedOp) == quesData.correctOp ? (
        <Text style={{color: Colors.correctAns, fontWeight: 'bold'}}>
          Attempted and Correct answer
        </Text>
      ) : (
        <Text style={{color: 'red', fontWeight: 'bold'}}>
          Attempted and wrong answer
        </Text>
      )}
      <View style={styles.optionsContainer}>
        <View
          style={[
            styles.optionContainer,
            selOp == 1 && {
              backgroundColor: '#f7a1a1',
              borderColor: '#f55151',
              borderWidth: 1,
            },
            correctOption == 1 && {
              backgroundColor: '#acfabf',
              borderColor: '#51f577',
              borderWidth: 1,
            },
          ]}>
          <CompletedTestOptionCircle
            selectedOption={selectedOption}
            num={1}
            attempted={foundObject?.value || selectedOp}
          />
          <Text style={styles.optionText}>{quesData.op1}</Text>
        </View>
        <View
          style={[
            styles.optionContainer,
            selOp == 2 && {
              backgroundColor: '#f7a1a1',
              borderColor: '#f55151',
              borderWidth: 1,
            },
            correctOption == 2 && {
              backgroundColor: '#acfabf',
              borderColor: '#51f577',
              borderWidth: 1,
            },
          ]}>
          <CompletedTestOptionCircle
            selectedOption={selectedOption}
            num={2}
            attempted={foundObject?.value || selectedOp}
          />
          <Text style={styles.optionText}>{quesData.op2}</Text>
        </View>
        <View
          style={[
            styles.optionContainer,
            selOp == 3 && {
              backgroundColor: '#f7a1a1',
              borderColor: '#f55151',
              borderWidth: 1,
            },
            correctOption == 3 && {
              backgroundColor: '#acfabf',
              borderColor: '#51f577',
              borderWidth: 1,
            },
          ]}>
          <CompletedTestOptionCircle
            selectedOption={selectedOption}
            num={3}
            attempted={foundObject?.value || selectedOp}
          />
          <Text style={styles.optionText}>{quesData.op3}</Text>
        </View>
        <View
          style={[
            styles.optionContainer,
            selOp == 4 && {
              backgroundColor: '#f7a1a1',
              borderColor: '#f55151',
              borderWidth: 1,
            },
            correctOption == 4 && {
              backgroundColor: '#acfabf',
              borderColor: '#51f577',
              borderWidth: 1,
            },
          ]}>
          <CompletedTestOptionCircle
            selectedOption={selectedOption}
            num={4}
            attempted={foundObject?.value || selectedOp}
          />
          <Text style={styles.optionText}>{quesData.op4}</Text>
        </View>
      </View>
      {quesData.exp && (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            navigation.navigate('SolutionScreen', {
              exp: quesData.exp,
              ytLink: quesData.ytLink,
            })
          }
          style={{
            backgroundColor: Colors.primary,
            elevation: 5,
            alignSelf: 'flex-end',
            marginTop: 10,
            borderRadius: 4,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              textAlign: 'right',
              fontWeight: 'bold',
              padding: 8,
            }}>
            उत्तर पहा / See Solution {'>'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  quesContainer: {
    borderColor: Colors.primary,
    backgroundColor: '#fff',
    elevation: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 10,
  },
  quesText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  optionsContainer: {
    width: '100%',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  optionText: {
    width: '90%',
    color: '#000',
  },
  filledCircle: {
    height: 15,
    width: 15,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },

  circle: {
    borderWidth: 1,
    height: 20,
    width: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.primary,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    padding: 11,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default CompletedQuesCard;
