import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet,Alert } from 'react-native';
import QuizData from '../data/Quizdata';
import Icon from 'react-native-vector-icons/FontAwesome';  

const QuizScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3); 

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * QuizData.length);
    setCurrentQuestion(QuizData[randomIndex]);
  };

  const handleOptionPress = (selectedOption) => {
    if (selectedOption === currentQuestion.answer) {
      // 정답일 경우 점수 증가
      Alert.alert('정답입니다!', '다음 문제로 넘어갑니다.');
      setScore((prevScore) => prevScore + 1);
    } else {
      // 오답일 경우 하트 감소
      Alert.alert('오답입니다', `기회 한 번이 차감됩니다`);
      setLives((prevLives) => prevLives - 1);
    }

    if (lives - 1 === 0) {
      // 하트가 0개가 되면
      Alert.alert('퀴즈 종료!', '다시 도전해보세요.', [
        {
          text: 'OK',
          onPress: () => setTimeout(() => navigation.goBack(), 1000),
        },
      ]);
    } else {
      // 다음 질문 로드
      loadNewQuestion();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion?.question}</Text>

      {currentQuestion?.options.map((option, index) => (
        <Button
          key={index}
          title={option}
          onPress={() => handleOptionPress(option)}
        />
      ))}
      
      <Text style={styles.score}>Score: {score}</Text>
      <View style={styles.livesContainer}>
        {Array.from({ length: lives }, (_, index) => (
          <Icon key={index} name="heart" size={30} color="red" />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  livesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default QuizScreen;
