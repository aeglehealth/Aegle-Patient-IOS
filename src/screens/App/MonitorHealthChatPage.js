/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, Icon} from 'react-native-elements';
import {HeaderLeft} from '../../Components/HeaderLeft';
import Modal from 'react-native-modal';
import shortid from 'shortid';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from '../../Components/toster/Alert';
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

function backgroundColor() {
  if (Platform.OS === 'ios') {
    return {
      backgroundColor: '#E5E5E5',
    };
  } else {
    return {
      backgroundColor: '#fff',
    };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
  },
  container1: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImageIcon: {
    maxHeight: 30,
    maxWidth: 30,
    alignSelf: 'center',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  chatReceived: {
    padding: 10,
    ...backgroundColor(),
    borderTopStartRadius: 11,
    borderTopEndRadius: 11,
    borderBottomEndRadius: 11,
    marginVertical: 10,
    marginHorizontal: 10,
    ...elevationShadowStyle(5),
    backgroundColor: '#ECEFF0',
  },
  chatText: {
    fontSize: 15,
    fontFamily: 'Muli-Regular',
  },
  chatSent: {
    padding: 10,
    backgroundColor: '#1B2CC1',
    borderTopStartRadius: 11,
    borderTopEndRadius: 11,
    borderBottomStartRadius: 11,
    marginVertical: 10,
    marginHorizontal: 10,
    ...elevationShadowStyle(5),
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 10,
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
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Muli-Regular',
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
  inputDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#edeef2',
    width: '90%',
    marginLeft: 10,
    paddingLeft: 10,
  },
  inputIOS: {
    backgroundColor: '#edeef2',
    width: '90%',
    marginLeft: 10,
    paddingLeft: 10,
    height: 50,
  },
});

export default class MonitorHealthChatPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerBackImage: <Icon type="material-community" name="close" />,
      headerLeftContainerStyle: {
        paddingLeft: 10,
      },
      headerTitle: (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
          }}>
          <Image
            source={require('../../assets/logo-black.png')}
            style={styles.headerImageIcon}
          />
        </View>
      ),
      headerRight: <TtsToggleSwitch position={true} />,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      prevChat: [],
      messages: this.props.navigation.state.params.messages,
      position: this.props.navigation.state.params.index,
      partsMessage: [
        {
          title: "Don't stop",
          description: 'Part 1 of 4 completed. \nKeep going.',
          icon: require('../../assets/chat-mental-health.png'),
        },
        {
          title: 'Mood Updated',
          description: "Part 2 of 4 completed. Don't stop now.",
          icon: require('../../assets/chat-happy-face.png'),
        },
        {
          title: 'Almost There!',
          description: 'Part 3 of 4 completed. You are almost there.',
          icon: require('../../assets/chat-baby-food.png'),
        },
      ],
      replyOptions: [
        {
          id: 1,
          reply: 'Hi, its nice to meet you too',
        },
      ],
      partsIndex: 0,
      index: 0,
      typing: false,
      modalVisible: false,
      inputVisible: false,
      inputValue: '',
    };
    this.scrollView = null;
  }

  componentDidMount() {
    const {prevChat, index} = this.state;
    if (this.state.messages.length > index) {
      prevChat.push({
        sender: 1,
        message: this.state.messages[index].chat,
      });

      this.context.display &&
        setTimeout(() => {
          Tts.setDefaultPitch(1.35);
          Tts.setDefaultRate(0.41);
          Tts.setDucking(true);
          Tts.speak(this.state.messages[this.state.index].chat, {
            iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
            quality: 500,
            latency: 300,
          });
        }, 1000);

      this.setState(prevState => ({
        replyOptions: prevState.messages[index].responses,
      }));
    }
  }

  progressBar = position => {
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: true});
      this.props.navigation.navigate('MonitorHealthReport', {position});
    }, 3000);
  };

  selectedOption = obj => {
    Tts.stop();
    const {prevChat, position} = this.state;
    let {index} = this.state;
    prevChat.push({
      sender: 2,
      message: obj.reply,
    });

    this.setState({prevChat});

    if (index === 57 && position === 0) {
      this.progressBar(position);
      return;
    }

    if (index === 8 && position === 1) {
      this.progressBar(position);
      return;
    }

    if (index === 62 && position === 2) {
      this.progressBar(position);
      return;
    }

    if (index === 37 && position === 3) {
      this.progressBar(position);
      return;
    }

    if (index === 21 && position === 4) {
      this.progressBar(position);
      return;
    }

    this.timeout = setTimeout(() => {
      if (this.state.messages.length > index + 1) {
        index += 1;
        prevChat.push({
          sender: 1,
          message: this.state.messages[index].chat,
        });

        this.setState(prevState => ({
          typing: false,
          replyMessage: prevState.messages[index].chat,
          replyOptions: prevState.messages[index].responses,
          index,
        }));

        if (
          (index === 9 && position === 0) ||
          (index === 16 && position === 0) ||
          (index === 17 && position === 0)
        ) {
          this.setState({
            inputVisible: true,
          });
        }

        //   if (index === 7) {
        //     this.setState(prevState => ({
        //       modalVisible: true,
        //       partsIndex: prevState.partsIndex + 1,
        //     }));
        //   }

        //   if (index === 9) {
        //     this.setState(prevState => ({
        //       modalVisible: true,
        //       partsIndex: prevState.partsIndex + 1,
        //     }));
        //   }
        // } else {
        //   this.setState({
        //     typing: false,
        //     replyOptions: [],
        //   });
      }

      this.context.display &&
        setTimeout(() => {
          Tts.setDefaultPitch(1.35);
          Tts.setDefaultRate(0.41);
          Tts.setDucking(true);
          Tts.speak(this.state.messages[this.state.index].chat, {
            iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
            quality: 500,
            latency: 300,
          });
        }, 1000);

      this.setState({prevChat, typing: false});
    }, 2000);
  };

  componentWillUnmount = () => {
    clearTimeout(this.timeout);
    Tts.stop();
  };

  handleInput = () => {
    const {prevChat, position} = this.state;
    if (!this.state.inputValue) {
      return;
    }
    if (isNaN(this.state.inputValue)) {
      Toast(`I don't understand this`);
      return;
    }
    let {index} = this.state;

    index += 1;
    prevChat.push({
      sender: 1,
      message: this.state.messages[index].chat,
    });

    this.setState({prevChat});

    if (this.state.messages.length > index + 1) {
      this.setState(prevState => ({
        typing: false,
        index,
        inputVisible: false,
        inputValue: '',
      }));
    }

    if (
      (index === 9 && position === 0) ||
      (index === 16 && position === 0) ||
      (index === 17 && position === 0)
    ) {
      this.setState({inputVisible: true});
    }

    this.setState({prevChat, typing: false});
  };

  onToggleSwitch = () => {
    this.context.toggleDisplay();
    Tts.stop();
  };

  static contextType = Context;

  render() {
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    const chatBubbles = this.state.prevChat.map(d => {
      return (
        <View
          style={{
            justifyContent: d.sender === 1 ? 'flex-start' : 'flex-end',
            flexDirection: 'row',
          }}
          key={shortid.generate()}>
          <View style={d.sender === 1 ? styles.chatReceived : styles.chatSent}>
            <Text
              style={[
                styles.chatText,
                {color: d.sender === 1 ? '#000' : '#fff'},
              ]}>
              {d.message}
            </Text>
          </View>
        </View>
      );
    });

    const replyOptions = this.state.replyOptions.map(d => {
      return (
        <Button
          key={shortid.generate()}
          type="solid"
          title={d.reply}
          buttonStyle={styles.buttonSolidStyle}
          titleStyle={styles.buttonSolidTitleStyle}
          disabled={this.state.typing}
          onPress={() => {
            this.setState({typing: true});
            this.selectedOption(d);
          }}
        />
      );
    });

    return (
      <View style={this.state.loading ? styles.container1 : styles.container}>
        {!this.state.loading ? (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={ref => {
                this.scrollView = ref;
              }}
              // eslint-disable-next-line no-unused-vars
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.scrollView.scrollToEnd({animated: true});
              }}>
              {chatBubbles}
              {/* {this.state.typing ? <View style={{padding: 10}} /> : null} */}
            </ScrollView>
            <View style={{marginVertical: 10}}>
              {this.state.inputVisible ? (
                <View style={styles.inputDiv}>
                  <TextInput
                    placeholder={
                      this.state.index === 16 && this.state.position === 0
                        ? ' (in ft)'
                        : this.state.index === 17 && this.state.position === 0
                        ? ' (in kg)'
                        : ' Enter your age'
                    }
                    style={
                      Platform.OS === 'ios' ? styles.inputIOS : styles.input
                    }
                    value={this.state.inputValue}
                    onChangeText={data => this.setState({inputValue: data})}
                  />
                  <TouchableOpacity onPress={this.handleInput}>
                    <FontAwesome
                      name="angle-double-up"
                      color="#1B2CC1"
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                replyOptions
              )}
            </View>
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
                <Button
                  type="solid"
                  title="OK"
                  buttonStyle={styles.buttonModalSolidStyle}
                  titleStyle={styles.buttonModalSolidTitleStyle}
                  onPress={() => {
                    this.setState({
                      modalVisible: false,
                    });
                  }}
                />
              </View>
            </Modal>
          </>
        ) : (
          <ActivityIndicator
            size={'large'}
            color="#1B2CC1"
            style={{alignSelf: 'center'}}
          />
        )}
      </View>
    );
  }
}
