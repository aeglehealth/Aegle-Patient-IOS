/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {FloatingAction} from 'react-native-floating-action';
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

export default class QuestionPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerRight: <TtsToggleSwitch position={true} />,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    selected: 0,
    questions: [],
    question: null,
    answer: 0,
    index: 0,
    nextPage: () => {},
    // buttonSelected: () => {},
  };

  componentWillUnmount = () => {
    Tts.stop();
  };

  componentDidMount() {
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
        Tts.setDefaultPitch(1);
        Tts.setDefaultRate(0.4);
        Tts.setDucking(true);
        Tts.speak(`${questions[this.state.index].question}`);
      }, 1000);
  }

  nextPage = () => {
    // Make sure the user provides an answer
    Tts.stop();

    if (
      this.state.answer === 0 &&
      typeof this.state.question.options !== 'undefined'
    ) {
      return;
    }

    const {questions, index} = this.state;

    questions[index].answer = this.state.answer;
    console.log(questions[index].answer, 'answer');
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
      // answer,
    }));

    this.context.display &&
      setTimeout(() => {
        Tts.setDefaultPitch(1);
        Tts.setDefaultRate(0.4);
        Tts.setDucking(true);
        Tts.speak(`${questions[this.state.index].question}`);
      }, 1000);

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
