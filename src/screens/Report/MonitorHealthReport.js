import React, {Component} from 'react';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  BackHandler,
} from 'react-native';
import Modal from 'react-native-modal';
import Arrow from '../../assets/arrow.svg';
import FA from '../../assets/fa_icon.svg';
import FAT from '../../assets/fa_text.svg';
import MA from '../../assets/ma_icon.svg';
import MAT from '../../assets/ma_text.svg';
import NA from '../../assets/na_icon.svg';
import NAT from '../../assets/na_text.svg';
import AA from '../../assets/aa_icon.svg';
import AAT from '../../assets/aa_text.svg';
import ME from '../../assets/mental_icon.svg';
import MET from '../../assets/mental_text.svg';
import {messages as mentalMessages} from '../../Utils/mentalHealthQuestions/Mental';
import {messages as moodMessages} from '../../Utils/mentalHealthQuestions/Mood';
import {messages as nutritionMessages} from '../../Utils/mentalHealthQuestions/Nutrition';
import Tts from 'react-native-tts';
import TtsToggleSwitch from '../../Components/TtsToggleSwitch';
import Context from '../../../Context/Context';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'rgba(196, 196, 196, 0.4)',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 1.1,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'Muli',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginHorizontal: 40,
    marginBottom: 20,
    paddingVertical: 13,
    marginTop: 40,
    borderRadius: 5,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    alignSelf: 'center',
  },
  buttonSolidTitleStyle1: {
    color: '#1B2CC1',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    alignSelf: 'center',
    marginVertical: 25,
  },
  buttonModalSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 15,
    alignSelf: 'stretch',
    ...elevationShadowStyle(5),
  },
  buttonModalSolidTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'muli-bold',
    alignSelf: 'center',
  },
  modalView: {
    marginTop: 22,
    maxHeight: 340,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontFamily: 'muli-bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  modalBody: {
    fontSize: 2,
    fontFamily: 'Muli-Regular',
    textAlign: 'center',
    marginBottom: 10,
    paddingBottom: 10,
  },
  modalIconContainer: {
    justifyContent: 'center',
    backgroundColor: '#1B2CC1',
    width: 70,
    height: 70,
    borderRadius: 40,
    marginTop: 30,
    alignSelf: 'center',
  },
  modalIcon: {
    maxHeight: 40,
    maxWidth: 40,
    alignSelf: 'center',
  },
});

export default class MonitorHealthReport extends Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('MonitorHealthAssessment');
          }}>
          <View style={{padding: 20}}>
            <Arrow height={18} width={18} />
          </View>
        </TouchableWithoutFeedback>
      ),
      headerTitle: (
        <View style={styles.headerTitle}>
          <Text style={[styles.headerText, {textAlign: 'center'}]}>
            Your report
          </Text>
        </View>
      ),
      headerRight: <TtsToggleSwitch position={true} />,
      headerRightContainerStyle: {
        paddingRight: 10,
        justifyContent: 'center',
      },
      headerLeftContainerStyle: {
        justifyContent: 'center',
      },
    };
  };

  state = {
    partsMessage: [
      {
        title: "Don't stop",
        description: 'Keep going.',
        icon: require('../../assets/chat-mental-health.png'),
      },
      {
        title: 'You got this',
        description: "Don't stop now.",
        icon: require('../../assets/chat-happy-face.png'),
      },
      {
        title: 'Almost There!',
        description: 'You are almost there.',
        icon: require('../../assets/chat-baby-food.png'),
      },
    ],
    modalVisible: false,
    partsIndex: 0,
  };

  goBack = async () => {
    this.props.navigation.navigate('MonitorHealthAssessment');
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
    this.context.display &&
      setTimeout(() => {
        Tts.setDefaultPitch(1.35);
        Tts.setDefaultRate(0.41);
        Tts.setDucking(true);
        if (this.props.navigation.state.params.position === 0) {
          Tts.speak(
            `Based on your responses, here is something to keep in mind. The key to maintaining good health is the combination of many factors like regular exercise, good diet, stress management, work-life balance, healthy relationships, high self-esteem and more. Majority of health complications and deaths are related to poor healthy living. You've told me a bit about your health - what you eat and drink, whether you smoke and how much exercise you take. These are all things that have a big impact on your health. Regular check-ups can also help find potential health issues before they become a problem. When you see your doctor regularly, they are able to detect health conditions or diseases early. Early detection gives you the best chance for getting the right treatment quickly, avoiding any complications.`,
            {
              iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
              quality: 500,
              latency: 300,
            },
          );
        } else if (this.props.navigation.state.params.position === 1) {
          Tts.speak(
            `Based on your responses, aim to be physically active every day. Any activity is better than none, and more is better still. Do strengthening activities that work all the major muscles (legs, hips, back, abdomen, chest, shoulders and arms) on at least 2 days a week. Engage in at least 150 minutes of moderate intensity activity a week or 75 minutes of vigorous intensity activity a week. Also reduce time spent sitting or lying down and break up long periods of not moving with some activity`,
            {
              iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
              quality: 500,
              latency: 300,
            },
          );
        } else if (this.props.navigation.state.params.position === 2) {
          Tts.speak(
            `show symptoms of certain mental disorders. For the most part, the criteria used to determine whether you might be diagnosed with a disorder are taken from the Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition (DSM-5), which is the standard text used by mental health professionals. From your responses, It is highly advisable that you seek professional help, even for any areas where you are symptomatic. It is important to remember, however, that this test only assesses whether you show signs of the most common mental disorders. If you are experiencing problems in your life that are not covered in this test, seeking help could assist you in overcoming these issues.`,
            {
              iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
              quality: 500,
              latency: 300,
            },
          );
        } else if (this.props.navigation.state.params.position === 3) {
          Tts.speak(
            `Based on your responses, you are experiencing some symptoms seen in depression and anxiety. This might be having a big impact on your daily life and you may also be experiencing physical symptoms, but only an experienced health professional can tell for sure. You should see a therapist or make an appointment to see a doctor for a review. Both can help you and assess whether you might benefit from extra support or treatment.`,
            {
              iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
              quality: 500,
              latency: 300,
            },
          );
        } else if (this.props.navigation.state.params.position === 4) {
          Tts.speak(
            `
          Based on your responses, here is something to keep in mind. he key to maintaining good health is the combination of many factors like regular exercise, good diet, stress management, work-life balance, healthy relationships, high self-esteem and more. Majority of health complications and deaths are related to poor healthy living. You've told me a bit about your health - what you eat and drink, whether you smoke and how much exercise you take. These are all things that have a big impact on your health. Regular check-ups can also help find potential health issues before they become a problem. When you see your doctor regularly, they are able to detect health conditions or diseases early. Early detection gives you the best chance for getting the right treatment quickly, avoiding any complications.
          `,
            {
              iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
              quality: 500,
              latency: 300,
            },
          );
        }
      }, 1000);
  }

  componentWillUnmount = () => {
    Tts.stop();
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  };

  static contextType = Context;

  render() {
    const {position, pass} = this.props.navigation.state.params;
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1, width: '100%'}}>
          {position === 0 ? (
            <>
              <FA style={{alignSelf: 'center', marginVertical: 20}} />
              <FAT style={{alignSelf: 'center'}} width="100%" />
            </>
          ) : position === 1 ? (
            <>
              <AA style={{alignSelf: 'center', marginVertical: 20}} />
              <AAT style={{alignSelf: 'center'}} width="100%" />
            </>
          ) : position === 2 ? (
            <>
              <ME style={{alignSelf: 'center', marginVertical: 20}} />
              <MET style={{alignSelf: 'center'}} width="100%" />
            </>
          ) : position === 3 ? (
            <>
              <MA style={{alignSelf: 'center', marginVertical: 20}} />
              <MAT style={{alignSelf: 'center'}} width="100%" />
            </>
          ) : position === 4 ? (
            <>
              <NA style={{alignSelf: 'center', marginVertical: 20}} />
              <NAT style={{alignSelf: 'center'}} width="100%" />
            </>
          ) : (
            ''
          )}
          <TouchableOpacity
            onPress={() => {
              Tts.stop();
              this.props.navigation.navigate('TalkToDoctor');
            }}>
            <View style={styles.buttonSolidStyle}>
              <Text style={styles.buttonSolidTitleStyle}>Talk to a doctor</Text>
            </View>
          </TouchableOpacity>

          {(position === 1 || position === 2 || position === 3) && (
            <TouchableOpacity
              onPress={() => {
                Tts.stop();
                let index = position;
                index--;
                this.setState({modalVisible: true, partsIndex: index});
              }}>
              <Text style={styles.buttonSolidTitleStyle1}>Continue</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <Modal
          isVisible={this.state.modalVisible}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          onBackdropPress={() => {
            this.setState({
              modalVisible: false,
            });
          }}>
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Image
                source={this.state.partsMessage[this.state.partsIndex].icon}
                style={styles.modalIcon}
              />
            </View>
            <Text style={styles.modalHeader}>
              {this.state.partsMessage[this.state.partsIndex].title}
            </Text>
            <Text style={styles.modalBody}>
              {this.state.partsMessage[this.state.partsIndex].description}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Tts.stop();
                let index = position;
                index++;
                this.setState({
                  modalVisible: false,
                });

                if (position === 1) {
                  this.props.navigation.navigate('MonitorHealthChat2', {
                    index: 2,
                    messages: mentalMessages,
                    pass: 1,
                  });
                  return;
                }

                if (pass === 1) {
                  this.props.navigation.navigate('MonitorHealthChat2', {
                    index: 3,
                    messages: moodMessages,
                    pass: 2,
                  });
                  return;
                }

                if (pass === 2) {
                  this.props.navigation.navigate('MonitorHealthChat2', {
                    index: 4,
                    messages: nutritionMessages,
                    pass: 0,
                  });
                  return;
                }

                this.props.navigation.navigate('MonitorHealthAssessment');
              }}>
              <View style={styles.buttonModalSolidStyle}>
                <Text style={styles.buttonModalSolidTitleStyle}>CONTINUE</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </>
    );
  }
}
