import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
} from 'react-native';
import {Button} from 'react-native-elements';
import shortid from 'shortid';
import {HeaderLeft} from '../../Components/HeaderLeft';
import Tts from 'react-native-tts';
import TtsToggleSwitch from '../../Components/TtsToggleSwitch';
import Context from '../../../Context/Context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  headerView: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 24,
    lineHeight: 35,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  buttonStyle: {
    borderColor: '#1B2CC1',
    marginHorizontal: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonTitleStyle: {
    fontSize: 16,
    fontFamily: 'Muli-Regular',
  },
  optionIcon: {
    maxHeight: 50,
    maxWidth: 50,
    marginTop: 10,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    marginTop: 5,
    marginBottom: 20,
  },
});

export default class AssessmentFollowUp extends Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerRight: <TtsToggleSwitch position={true} />,
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    questions: [
      {
        id: 1,
        question: `Hi ${this.props.navigation.state.params.name}, I will ask you questions to understand the symptoms you are having, carry out an assessment, and help you sort out your health. Are you happy to proceed?`,
        options: [
          {
            text: `Let’s do it`,
            value: 1,
          },
          {
            text: 'Exit',
            value: 2,
          },
        ],
      },
    ],
    answer: 0,
    index: 0,
  };

  componentWillUnmount = () => {
    Tts.stop();
  };

  componentDidMount() {
    this.context.display &&
      setTimeout(() => {
        Tts.setDefaultPitch(1.1);
        Tts.setDefaultRate(0.4);
        Tts.setDucking(true);
        Tts.speak(
          `Hi ${this.props.navigation.state.params.name}, I will ask you questions to understand the symptoms you are having, carry out an assessment, and help you sort out your health. Are you happy to proceed?`,
        );
      }, 1000);
  }

  nextPage = () => {
    const {questions, index} = this.state;
    Tts.stop();
    if (questions[index].id === 1) {
      if (this.state.answer === 1) {
        this.props.navigation.navigate('Question2', {
          questions: [
            {
              id: 1,
              question: `Who is this for?`,
              options: [
                {
                  text: 'Myself',
                  value: 1,
                },
                {
                  text: 'Someone else',
                  value: 2,
                },
              ],
            },
          ],
          nextPage: () => {
            this.props.navigation.navigate('SymptomSearch', {
              me: this.props.navigation.state.params.me,
            });
          },
        });
        return;
      } else {
        this.props.navigation.navigate('Home');
        return;
      }
    }
    questions[index].answer = this.state.answer;
    const answer =
      typeof questions[index].answer === 'undefined'
        ? 0
        : questions[index].answer;
    this.setState(prevState => ({
      index: prevState.index + 1,
      answer,
    }));
  };

  static contextType = Context;

  render() {
    const question = this.state.questions[this.state.index];
    const optionButtons =
      question == null || typeof question.options === 'undefined'
        ? null
        : question.options.map(d => {
            return question.id === 0 ? (
              <TouchableHighlight
                underlayColor="rgba(0, 0, 0, 0.01)"
                onPress={() => {
                  this.setState({answer: d.value}, () => {
                    this.nextPage();
                  });
                }}
                key={shortid.generate()}>
                <View
                  style={{
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxHeight: 100,
                  }}>
                  <Text style={styles.optionText}>{d.text}</Text>
                </View>
              </TouchableHighlight>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}
                key={shortid.generate()}>
                <Button
                  type="outline"
                  title={d.text}
                  buttonStyle={[
                    styles.buttonStyle,
                    {
                      backgroundColor: '#fff',
                    },
                  ]}
                  titleStyle={[
                    styles.buttonTitleStyle,
                    {
                      color: '#1B2CC1',
                    },
                  ]}
                  onPress={() => {
                    this.setState({answer: d.value}, () => {
                      this.nextPage();
                    });
                  }}
                />
              </View>
            );
          });

    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>
            {question !== null ? question.question : ''}
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {optionButtons}
        </ScrollView>
      </View>
    );
  }
}
