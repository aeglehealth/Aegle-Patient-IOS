/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {messages} from '../../Utils/mentalHealthQuestions/FullAssessment';
import {messages as ActivityMessages} from '../../Utils/mentalHealthQuestions/Activity';
import {messages as mentalMessages} from '../../Utils/mentalHealthQuestions/Mental';
import {messages as moodMessages} from '../../Utils/mentalHealthQuestions/Mood';
import {messages as nutritionMessages} from '../../Utils/mentalHealthQuestions/Nutrition';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bodyText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 15,
    marginStart: 15,
    marginEnd: 15,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  imageIcon: {
    width: 30,
    height: 30,
    marginVertical: 8,
    alignSelf: 'center',
  },
  textTitle: {
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  textDuration: {
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  textTap: {
    fontFamily: 'Muli-Regular',
    fontSize: 12,
    color: '#0066F5',
    textAlign: 'center',
  },
});

export default class MonitorHealthAssessmentPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      title: 'Monitor your health',
      headerTitleStyle: {
        fontFamily: 'Muli-ExtraBold',
        fontSize: 22,
        textAlign: 'center',
        flex: 1,
      },
      headerRight: <View />,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.bodyText}>
            Get a digital twin with a full assessment or select a section from
            the following listed to continue
          </Text>
          <ImageBackground
            source={require('../../assets/monitor-health-bg.jpg')}
            imageStyle={{resizeMode: 'stretch'}}
            style={{width: '100%', height: 600, justifyContent: 'flex-start'}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 30,
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.navigate('MonitorHealthChat', {
                    messages,
                    index: 0,
                  });
                }}>
                <View>
                  <Image
                    source={require('../../assets/monitor-folder.png')}
                    style={styles.imageIcon}
                  />
                  <Text style={styles.textTitle}>Full Assessment</Text>
                  <Text style={styles.textDuration}>Duration: 10 minutes</Text>
                  <Text style={styles.textTap}>Tap to start</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 50}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.props.navigation.navigate('MonitorHealthChat', {
                      messages: ActivityMessages,
                      index: 1,
                    });
                  }}>
                  <View>
                    <Image
                      source={require('../../assets/monitor-activity.png')}
                      style={styles.imageIcon}
                    />
                    <Text style={styles.textTitle}>Activity Assessment</Text>
                    <Text style={styles.textDuration}>Duration: 5 minutes</Text>
                    <Text style={styles.textTap}>Tap to start</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.props.navigation.navigate('MonitorHealthChat', {
                      messages: mentalMessages,
                      index: 2,
                    });
                  }}>
                  <View>
                    <Image
                      source={require('../../assets/monitor-mental-health.png')}
                      style={styles.imageIcon}
                    />
                    <Text style={styles.textTitle}>Mental Assessment</Text>
                    <Text style={styles.textDuration}>Duration: 5 minutes</Text>
                    <Text style={styles.textTap}>Tap to start</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 40}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  paddingRight: 35,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.props.navigation.navigate('MonitorHealthChat', {
                      messages: moodMessages,
                      index: 3,
                    });
                  }}>
                  <View>
                    <Image
                      source={require('../../assets/monitor-happy-face.png')}
                      style={styles.imageIcon}
                    />
                    <Text style={styles.textTitle}>Mood Assessment</Text>
                    <Text style={styles.textDuration}>Duration: 5 minutes</Text>
                    <Text style={styles.textTap}>Tap to start</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  paddingRight: 13,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.props.navigation.navigate('MonitorHealthChat', {
                      messages: nutritionMessages,
                      index: 4,
                    });
                  }}>
                  <View>
                    <Image
                      source={require('../../assets/monitor-baby-food.png')}
                      style={styles.imageIcon}
                    />
                    <Text style={styles.textTitle}>Nutrition Assessment</Text>
                    <Text style={styles.textDuration}>Duration: 5 minutes</Text>
                    <Text style={styles.textTap}>Tap to start</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </View>
    );
  }
}
