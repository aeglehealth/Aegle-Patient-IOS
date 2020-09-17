/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React from 'react';
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

export default class MentalAssessmentPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    review: '',
    questions: [
      {
        id: 1,
        question: `Hey ${
          this.props.navigation.state.params.me.profile.firstName
        }, quick one.${'\n'}How is today going?`,
        options: [
          {
            text: 'Good',
            icon: require('../../assets/mental-good.png'),
            value: 1,
          },
          {
            text: 'Happy',
            icon: require('../../assets/mental-happy.png'),
            value: 1,
          },
          {
            text: 'Meh',
            icon: require('../../assets/mental-meh.png'),
            value: 2,
          },
          {
            text: 'Sad',
            icon: require('../../assets/mental-sad.png'),
            value: 2,
          },
          {
            text: 'Awful',
            icon: require('../../assets/mental-angry.png'),
            value: 2,
          },
        ],
      },
    ],
    answer: 0,
    index: 0,
  };

  nextPage = () => {
    const {questions, index} = this.state;

    if (questions[index].id === 1) {
      if (this.state.answer === 1) {
        this.props.navigation.navigate({
          routeName: 'Question',
          params: {
            questions: [
              {
                id: 2,
                question: `Keep it up ${this.props.navigation.state.params.me.profile.firstName}, feel free to talk to me if you notice a change in your mood or have anything bothering you. I’m always here for you.`,
                options: [
                  {
                    text: 'Ok',
                    value: 1,
                  },
                ],
              },
            ],
            nextPage: () => {
              this.props.navigation.navigate('Home');
            },
          },
        });
        return;
      }
      const YNMOptions = [
        {
          text: 'Yes',
          value: 1,
        },
        {
          text: 'No',
          value: 2,
        },
        {
          text: 'Not sure',
          value: 3,
        },
      ];
      this.props.navigation.navigate({
        routeName: 'Question',
        params: {
          questions: [
            {
              id: 1,
              question: `Hi ${this.props.navigation.state.params.me.profile.firstName}, I understand that you have been feeling down, depressed or hopeless, is that correct?`,
              options: YNMOptions,
            },
            {
              id: 2,
              question:
                'Since today, have you had little interest or pleasure in doing things?',
              options: YNMOptions,
            },
            {
              id: 3,
              question: 'Did you have trouble falling asleep last night?',
              options: YNMOptions,
            },
            {
              id: 4,
              question:
                'Since this week have you been bothered with poor appetite or overeating?',
              options: YNMOptions,
            },
            {
              id: 5,
              question:
                'Have you been feeling bad about yourself or that you are a failure, or have let yourself or your family down?',
              options: YNMOptions,
            },
            {
              id: 6,
              question: 'Have you been easily annoyed or irritable?',
              options: YNMOptions,
            },
            {
              id: 7,
              question: 'Have you been bothered about any of the following?',
              options: [
                {
                  text: 'Your health',
                  value: 1,
                },
                {
                  text: 'Your weight or how you look',
                  value: 2,
                },
                {
                  text: 'Little or no sexual desire or pleasure during sex',
                  value: 3,
                },
                {
                  text: 'Difficulties with your partner',
                  value: 4,
                },
                {
                  text: 'The stress of taking care of family members',
                  value: 5,
                },
                {
                  text: 'Stress at work, school or outside home',
                  value: 6,
                },
                {
                  text: 'By financial problems or worries',
                  value: 7,
                },
                {
                  text: 'Having no one to turn to',
                  value: 8,
                },
                {
                  text: 'Something bad that happened recently',
                  value: 9,
                },
              ],
            },
          ],
          nextPage: () => {
            this.props.navigation.navigate('MentalAssessmentBookOption');
          },
        },
      });
      return;
    }
    questions[index].answer = this.state.answer;
    const answer =
      typeof questions[index + 1].answer === 'undefined'
        ? 0
        : questions[index + 1].answer;
    this.setState(prevState => ({
      index: prevState.index + 1,
      answer,
    }));
  };

  render() {
    const question = this.state.questions[this.state.index];
    const optionButtons =
      question == null || typeof question.options === 'undefined'
        ? null
        : question.options.map(d => {
            return question.id === 1 ? (
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
                  <Image style={styles.optionIcon} source={d.icon} />
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
