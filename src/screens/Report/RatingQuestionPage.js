/* eslint-disable react/prop-types */
import React from 'react';
import {StyleSheet, Text, View, TextInput, Platform} from 'react-native';
import {Button} from 'react-native-elements';
import shortid from 'shortid';

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
  input: {
    borderWidth: 1,
    textAlignVertical: 'top',
    borderColor: '#828282',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 15,
    fontSize: 17,
    fontFamily: 'Muli-Regular',
    height: 200,
  },
});

export default class RatingQuestionPage extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      review: '',
      questions: [
        {
          id: 1,
          question: 'Was this assessment helpful?',
          options: [
            {
              text: 'Yes',
              value: 1,
            },
            {
              text: 'No',
              value: 2,
            },
            {
              text: "I'm not sure",
              value: 3,
            },
          ],
        },
        {
          id: 2,
          question:
            'I would love to know how I could do even better. Please let me know what could be improved.',
        },
        {
          id: 3,
          question: `Thank you for your feedback Buhari. You can help me out by rating me or leaving a review on ${
            Platform.OS === 'ios' ? 'AppleStore' : 'PlayStore'
          }`,
          options: [
            {
              text: `Rate Aegle on ${
                Platform.OS === 'ios' ? 'AppleStore' : 'PlayStore'
              }`,
              value: 1,
            },
            {
              text: 'Not now',
              value: 2,
            },
          ],
        },
        {
          id: 4,
          question:
            'Would you like to track your symptoms and see how they change over time? If you choose to skip now, you can always find the symptom tracker under CARE menu',
          options: [
            {
              text: 'Track now',
              value: 1,
            },
            {
              text: 'Skip',
              value: 2,
            },
          ],
        },
        {
          id: 5,
          question:
            "Thank you, Buhari We're done for now. I saved the report to your Assessments in the care menu.",
          options: [
            {
              text: 'Done',
              value: 1,
            },
          ],
        },
      ],
      question: null,
      answer: 0,
      index: 0,
    };

    this.nextPage = this.nextPage.bind(this);
  }

  nextPage() {
    const {questions, index} = this.state;

    if (questions[index].id === 5) {
      this.props.navigation.navigate('Home');
      return;
    }

    questions[index].answer = this.state.answer;
    const answer =
      typeof questions[this.state.index + 1].answer === 'undefined'
        ? 0
        : questions[this.state.index + 1].answer;
    this.setState(prevState => ({
      index: prevState.index + 1,
      answer,
    }));
  }

  render() {
    const question = this.state.questions[this.state.index];
    const inputBox =
      question.id === 2 ? (
        <View>
          <TextInput
            style={styles.input}
            multiline
            value={this.state.review}
            placeholder="Type here"
            onChangeText={text => this.setState({review: text})}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Button
              type="outline"
              title={this.state.review === '' ? 'Skip' : 'Save & Next'}
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
              onPress={this.nextPage}
            />
          </View>
        </View>
      ) : null;

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
        <View>{inputBox}</View>
        <View>{optionButtons}</View>
      </View>
    );
  }
}
