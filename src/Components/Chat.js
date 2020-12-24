import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import {withApollo, Query} from 'react-apollo';
import {Icon} from 'react-native-elements';
import {
  MEPOST,
  COMPLETE_APPOINTMENT,
  GetAppointmentById,
} from '../QueryAndMutation';
import Client from 'twilio-chat';
import shortid from 'shortid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ActivityIndicatorPage from '../screens/App/ActivityIndicatorPage';
import Toast from '../Components/toster/Alert';

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
  headerImageIcon: {
    maxHeight: 30,
    maxWidth: 30,
    alignSelf: 'center',
  },
  headerStyle: {
    backgroundColor: '#fff',
    ...elevationShadowStyle(3),
  },
  chatReceived: {
    padding: 10,
    ...backgroundColor(),
    borderTopStartRadius: 11,
    borderTopEndRadius: 11,
    borderBottomEndRadius: 11,
    marginVertical: 10,
    marginHorizontal: 10,
    marginRight: 50,
    ...elevationShadowStyle(5),
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
    marginLeft: 50,
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
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Muli-Regular',
  },
  buttonModalSolidTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'muli-bold',
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
    fontSize: 17,
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

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      messages: [],
      channel: null,
      loadingMessages: true,
      message: '',
      roomId: '',
      appointmentId: this.props.navigation.state.params.appointmentId,
      id: this.props.navigation.state.params.patientId,
      roomId: this.props.navigation.state.params.roomId,
      token: this.props.navigation.state.params.token,
    };
    this.scrollView = null;
  }

  static navigationOptions = {headerShown: false};

  joinChannel = async channel => {
    if (channel.status !== 'joined') {
      await channel.join();
    }

    Toast('Joining chat room!');

    this.setState({
      channel,
    });

    channel.on('messageAdded', this.handleMessageAdded);
    // this.scrollToBottom();
  };

  handleMessageAdded = message => {
    const {messages} = this.state;
    this.setState(
      {
        messages: [...messages, message],
      },
      // this.scrollToBottom,
    );
  };

  joinChat = async () => {
    const {token, roomId} = this.state;

    const client = await Client.create(token);
    this.setState({client});

    client.on('tokenAboutToExpire', async () => {
      client.updateToken(token);
    });

    try {
      Toast('Please wait!');
      const channel = await client.getChannelByUniqueName(roomId);
      await this.joinChannel(channel);
      Toast('Fetching messages!');
      const messages = await channel.getMessages();
      this.setState({loadingMessages: false, messages: messages.items || []});
    } catch (err) {
      console.log(err, 'err');
      try {
        const channel = await client.getChannelBySid(roomId);
        this.joinChannel(channel);
        const messages = await channel.getMessages();
        this.setState({loadingMessages: false, messages: messages.items || []});
      } catch {
        this.setState({loadingMessages: false});
        throw new Error('Unable to create channel, please reload this page');
      }
    }
  };

  handleBackButton() {
    Toast(
      "Oops!\nReturn key disabled.\nYou can end the chat by clicking the 'end' button above",
    );
    return true;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.joinChat();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  async sendMessage() {
    const {channel} = this.state;
    channel.sendMessage(this.state.message);
    this.setState({message: ''});
  }

  async getMessage() {
    const {channel} = this.state;
    channel.getMessages().then(messages => {
      this.setState({messages: messages.items});
    });
  }

  async typingMessage() {
    const {channel} = this.state;
    channel.typing();
  }

  render() {
    const {id, loadingMessages, appointmentId} = this.state;

    const replyOptions = (
      <>
        <TextInput
          style={{
            borderWidth: 1,
            marginVertical: 5,
            marginHorizontal: 10,
            borderRadius: 5,
            padding: 10,
            borderColor: '#1b2cc1',
          }}
          value={this.state.message}
          onChangeText={message => {
            this.setState({message});
            this.typingMessage();
          }}
          placeholder="Type here"
          returnKeyType="send"
          onSubmitEditing={() => this.sendMessage()}
        />
      </>
    );
    return (
      <Query
        query={GetAppointmentById}
        variables={{
          appointmentId,
        }}
        pollInterval={5000}>
        {({data, loading}) => {
          if (loading) return <ActivityIndicatorPage />;

          const {status} = data.getAppointmentById;
          return status === 'CANCELLED' || status === 'COMPLETED' ? (
            this.props.navigation.navigate('Ratings', {appointmentId})
          ) : (
            <>
              <View
                style={{
                  width: wp('100%'),
                  borderBottomColor: '#1b2cc1',
                  borderBottomWidth: 0.5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: wp('80%'),
                    justifyContent: 'space-between',
                    marginLeft: 10,
                    alignItems: 'center',
                    height: hp('10%'),
                    marginTop: 0,
                  }}>
                  <TouchableOpacity
                    onPress={async () => {
                      const {appointmentId} = this.state;
                      const {client} = this.props;

                      try {
                        const res = await client.mutate({
                          mutation: COMPLETE_APPOINTMENT,
                          variables: {appointmentId},
                          refetchQueries: [
                            {
                              query: MEPOST,
                            },
                          ],
                        });
                        if (res.data.completeAppointment) {
                          this.props.navigation.navigate('Ratings', {
                            appointmentId,
                          });
                        } else {
                          this.props.navigation.navigate('Home');
                        }
                        return;
                      } catch (err) {
                        this.props.navigation.navigate('Home');
                      }
                    }}
                    style={{backgroundColor: '#1b2cc1', borderRadius: 5}}>
                    {/* <Icon type="material-community" name="close" /> */}
                    <Text style={{color: 'white', padding: 10}}>End Chat</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <Image
                      source={require('../assets/logo-black.png')}
                      style={styles.headerImageIcon}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.container}>
                {loadingMessages ? (
                  <ActivityIndicatorPage />
                ) : (
                  <>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      ref={ref => {
                        this.scrollView = ref;
                      }}
                      onContentSizeChange={(contentWidth, contentHeight) => {
                        this.scrollView.scrollToEnd({animated: true});
                      }}>
                      {this.state.messages.map(d => {
                        return (
                          <View
                            style={{
                              justifyContent:
                                d.author !== id ? 'flex-start' : 'flex-end',
                              flexDirection: 'row',
                            }}
                            key={shortid.generate()}>
                            <View
                              style={
                                d.author !== id
                                  ? styles.chatReceived
                                  : styles.chatSent
                              }>
                              <Text
                                style={[
                                  styles.chatText,
                                  {
                                    color: d.author !== id ? '#000' : '#fff',
                                  },
                                ]}>
                                {d.body}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                    <View style={{marginVertical: 10}}>{replyOptions}</View>
                  </>
                )}
              </View>
            </>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(Chat);
