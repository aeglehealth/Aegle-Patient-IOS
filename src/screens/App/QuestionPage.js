/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {FloatingAction} from 'react-native-floating-action';
import shortid from 'shortid';
import {searchResult} from '../../Utils/symptomQuestions/symptomFollowUpQuestions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Arrow from '../../assets/arrow.svg';
import {withApollo} from 'react-apollo';
import {MEPOST} from '../../QueryAndMutation';
import {SYMPTOMS, SYMPTOMS_QUESTIONS} from 'react-native-dotenv';
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
    fontFamily: 'Muli',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 30,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  buttonStyle: {
    borderColor: '#1B2CC1',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonTitleStyle: {
    fontSize: 16,
    textAlign: 'left',
    fontFamily: 'muli-regular',
  },
});

class QuestionPage extends React.Component {
  state = {
    selected: 0,
    questions: [],
    question: null,
    answer: 0,
    index: 0,
    nextPage: () => {},
    primaryQuestion: this.props.navigation.state.params.questionsArr,
    title: '',
    profile: this.props.navigation.state.params.profile,
    firstName: '',
    userId: '',
  };

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerRight: <TtsToggleSwitch position={true} />,
      headerLeft: (
        <TouchableWithoutFeedback
          onPress={async () => {
            await AsyncStorage.removeItem(SYMPTOMS);
            await AsyncStorage.removeItem(SYMPTOMS_QUESTIONS);
            navigation.goBack();
          }}>
          <View style={{padding: 20}}>
            <Arrow height={18} width={18} />
          </View>
        </TouchableWithoutFeedback>
      ),
    };
  };

  async UNSAFE_componentWillMount() {
    this.props.navigation.setParams({
      goBack: this.goBack,
    });
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const questions = navigation.getParam('questions', []);
    const nextPage = navigation.getParam('nextPage', () => {});
    const answer =
      typeof questions[0].answer === 'undefined' ? 0 : questions[0].answer;
    this.setState(prevState => ({
      nextPage,
      questions,
      question: questions[prevState.index],
      // answer,
    }));
    this.context.display &&
      setTimeout(() => {
        Tts.setDefaultPitch(1.35);
        Tts.setDefaultRate(0.41);
        Tts.setDucking(true);
        Tts.speak(`${questions[this.state.index].question}`, {
          iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
          quality: 500,
          latency: 300,
        });
      }, 500);

    //save all symptom questions to asyncStorage
    if (await AsyncStorage.getItem(SYMPTOMS_QUESTIONS)) {
      let sym = await AsyncStorage.getItem(SYMPTOMS_QUESTIONS);
      let symptomQuestions = JSON.parse(sym);
      symptomQuestions.push(questions);
      await AsyncStorage.setItem(
        SYMPTOMS_QUESTIONS,
        JSON.stringify(symptomQuestions),
      );
    } else {
      let symptomQuestions = [];
      symptomQuestions.push(questions);
      await AsyncStorage.setItem(
        SYMPTOMS_QUESTIONS,
        JSON.stringify(symptomQuestions),
      );
    }

    const data = await this.props.client.query({
      query: MEPOST,
      fetchPolicy: 'no-cache',
    });
    const {
      id,
      profile: {firstName},
    } = data.data.me;
    this.setState({firstName, userId: id});

    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  goBack = async () => {
    await AsyncStorage.removeItem(SYMPTOMS);
    await AsyncStorage.removeItem(SYMPTOMS_QUESTIONS);
    this.props.navigation.goBack();
  };

  componentWillUnmount = () => {
    Tts.stop();
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  };

  nextPage = () => {
    // Make sure the user provides an answer
    Tts.stop();

    if (
      this.state.answer === 0 &&
      typeof this.state.question.options !== 'undefined'
    ) {
      return;
    }

    if (this.state.answer == 'Yes') {
      this.props.navigation.navigate('SymptomSearch');
    }

    if (this.state.answer == 'No') {
      // const questionsArr = searchResult.filter(
      //   item => item.title == this.state.title,
      // );
      // const questions = questionsArr[0].questions;
      const questions = searchResult[0].questions;
      this.props.navigation.navigate({
        routeName: 'Question2',
        key: `Questions-${shortid.generate()}`,
        params: {
          questions,
          nextPage: () => {
            Tts.stop();
            this.props.navigation.navigate({
              routeName: 'Question2',
              key: `Questions-${shortid.generate()}`,
              params: {
                questions: [
                  {
                    id: 1,
                    question: `Thanks ${this.state.firstName}.\nFollowing your responses, I have listed the likely causes of your symptoms.`,
                  },
                  {
                    id: 2,
                    question: `${this.state.firstName}, keep in mind that this assessment only shows a list of possible conditions, not an actual diagnosis.\nTalk to a doctor if you are concerned.`,
                  },
                ],
                nextPage: () => {
                  this.props.navigation.navigate('AssessmentReport', {
                    questions,
                    primaryQuestion: this.state.primaryQuestion,
                    profile: this.state.profile,
                    id: this.state.userId,
                  });
                },
              },
            });
          },
        },
      });
      // const answer = 1
      //   typeof questions[index + 1].answer === 'undefined'
      //     ? 0
      //     : questions[index + 1].answer;
      // console.log(answer, 'newAnswer');
      // this.setState({
      //   question: questions[0],
      //   // answer,
      //   questions,
      // });
    }

    const {questions, index} = this.state;

    questions[index].answer = this.state.answer;
    if (index >= questions.length - 1) {
      this.state.nextPage();
      return;
    }
    const answer =
      typeof questions[index + 1].answer === 'undefined'
        ? 0
        : questions[index + 1].answer;

    this.setState(prevState => ({
      index: prevState.index + 1,
      question: questions[prevState.index + 1],
      questions,
      answer,
    }));

    this.context.display &&
      setTimeout(() => {
        Tts.setDefaultPitch(1.35);
        Tts.setDefaultRate(0.41);
        Tts.setDucking(true);
        Tts.speak(`${questions[this.state.index].question}`, {
          iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
          quality: 500,
          latency: 300,
        });
      }, 500);

    this.setState({answer: 0});
  };

  static contextType = Context;

  render() {
    const {question} = this.state;
    const optionButtons =
      question == null || typeof question.options === 'undefined'
        ? null
        : question.options.map(d => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:
                    this.state.answer === d.value ? 'flex-end' : 'flex-start',
                }}
                key={shortid.generate()}>
                <Button
                  type="outline"
                  title={d.text}
                  buttonStyle={[
                    styles.buttonStyle,
                    {
                      backgroundColor:
                        this.state.answer === d.value ? '#1B2CC1' : '#fff',
                    },
                  ]}
                  titleStyle={[
                    styles.buttonTitleStyle,
                    {
                      color: this.state.answer === d.value ? '#fff' : '#1B2CC1',
                    },
                  ]}
                  onPress={() => {
                    this.setState({answer: d.value});
                  }}
                />
              </View>
            );
          });

    const floatingButton =
      this.state.answer === 0 && optionButtons !== null ? null : (
        <FloatingAction
          color="#1B2CC1"
          onPressItem={this.nextPage}
          distanceToEdge={20}
          overrideWithAction
          actions={[
            {
              text: 'Next',
              name: 'bt_next',
              icon: (
                <Icon
                  type="font-awesome"
                  name="angle-right"
                  color="#fff"
                  size={40}
                />
              ),
              position: 1,
            },
          ]}
          floatingIcon={<Icon type="font-awesome" name="pencil" color="#fff" />}
        />
      );

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

        {floatingButton}
      </View>
    );
  }
}

export default withApollo(QuestionPage);
