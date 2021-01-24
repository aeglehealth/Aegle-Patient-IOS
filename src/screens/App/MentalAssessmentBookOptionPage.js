/* eslint-disable react/prop-types */
import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import shortid from 'shortid';
import {HeaderLeft} from '../../Components/HeaderLeft';
import Tts from 'react-native-tts';

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
    fontSize: 26,
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
    fontSize: 18,
    fontFamily: 'Muli-Regular',
  },
});

export default class MentalAssessmentBookOptionPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  componentDidMount() {
    setTimeout(() => {
      Tts.setDefaultPitch(1.35);
      Tts.setDefaultRate(0.4);
      Tts.setDucking(true);
      Tts.speak(`${this.state.questions[this.state.index].question}`);
    }, 1000);
  }

  componentWillUnmount() {
    Tts.stop();
  }

  constructor(props) {
    super(props);
    this.state = {
      review: '',
      questions: [
        {
          id: 1,
          question:
            "It can sometimes be hard to recognise or admit that we're not feeling fine. I totally understand and I'm here to help you. Would you like me to put you through to a therapist to help point you in the right direction for helpful advice and information?",
          options: [
            {
              text: 'Book now',
              value: 1,
            },
            {
              text: 'Skip',
              value: 2,
            },
          ],
        },
      ],
      answer: 0,
      index: 0,
    };

    this.nextPage = this.nextPage.bind(this);
  }

  nextPage() {
    const {answer} = this.state;

    if (answer === 1) {
      this.props.navigation.navigate('BookAppointment');
    } else {
      this.props.navigation.navigate('Home');
    }
  }

  render() {
    const question = this.state.questions[this.state.index];
    const optionButtons =
      question == null || typeof question.options === 'undefined'
        ? null
        : question.options.map(d => {
            return (
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
