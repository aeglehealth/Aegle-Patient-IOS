import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  BackHandler,
  Platform,
  ActivityIndicator,
} from 'react-native';
// import TwilioVoice from 'react-native-twilio-programmable-voice';
import Call from '../../assets/telephone.svg';
import Speaker from '../../assets/speaker.svg';
import Mute from '../../assets/mute.svg';
import {Mutation, Query} from 'react-apollo';
import {JOIN_VOICE_CALL, ME, GetAppointmentById} from '../../QueryAndMutation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    backgroundColor: '#1B2CC1',
    height: 150,
  },
  optionsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1B2CC1',
    padding: 13,
  },
  optionButton: {
    width: 50,
    height: 50,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 50 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40,
    fontFamily: 'Muli-Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default class VoiceChat extends Component {
  static navigationOptions = {headerShown: false};

  state = {
    isAudioEnabled: true,
    isSpeakerEnabled: false,
    callInit: 'connect',
    incomingCall: false,
  };

  _deviceDidReceiveIncoming = data => {
    TwilioVoice.addEventListener('deviceDidReceiveIncoming', function(data) {
      // {
      //     call_sid: string,  // Twilio call sid
      //     call_state: 'PENDING' | 'CONNECTED' | 'ACCEPTED' | 'CONNECTING' 'DISCONNECTED' | 'CANCELLED',
      //     call_from: string, // "+441234567890"
      //     call_to: string,   // "client:bob"
      // }
    });
  };

  initTelephony = async token => {
    try {
      // const accessToken = await getAccessTokenFromServer();
      const success = await TwilioVoice.initWithToken(token);
      console.log(success, 'susgfdv');
      TwilioVoice.addEventListener('deviceReady', () => {
        console.log('good');
        this.setState({callInit: 'connected', incomingCall: false});
      });
      TwilioVoice.addEventListener('deviceNotReady', function(err) {
        console.log(err);
      });
      TwilioVoice.addEventListener('connectionDidConnect', data => {
        console.log('connected', data);
        this.setState({callInit: 'connecteds', incomingCall: false});
      });
      TwilioVoice.addEventListener('connectionDidDisconnect', data => {
        console.log('disconnected', data);
        this.setState({callInit: 'connected', incomingCall: false});
      });
      TwilioVoice.addEventListener('deviceDidReceiveIncoming', data => {
        // {
        //     call_sid: string,  // Twilio call sid
        //     call_state: 'PENDING' | 'CONNECTED' | 'ACCEPTED' | 'CONNECTING' 'DISCONNECTED' | 'CANCELLED',
        //     call_from: string, // "+441234567890"
        //     call_to: string,   // "client:bob"
        // }
        console.log('did you connect');
        this.setState({incomingCall: true});
      });
    } catch (err) {
      console.err(err);
    }
  };

  initTelephonyWithUrl = token => {
    TwilioVoice.initWithTokenUrl(token);
    try {
      TwilioVoice.configureCallKit({
        appName: 'Aegle', // Required param
        imageName: 'my_image_name_in_bundle', // OPTIONAL
        ringtoneSound: 'my_ringtone_sound_filename_in_bundle', // OPTIONAL
      });
    } catch (err) {
      console.err(err);
    }
  };

  connect = () => {
    TwilioVoice.connect({To: '+61234567890'});
  };

  disconnect = () => {
    TwilioVoice.disconnect();

    this.props.navigation.goBack();
  };

  accept = () => {
    TwilioVoice.accept();
  };

  reject = () => {
    TwilioVoice.reject();
  };

  ignore = () => {
    TwilioVoice.ignore();
  };

  speaker = () => {
    this.setState({
      isSpeakerEnabled: !this.state.isSpeakerEnabled,
    });
    TwilioVoice.setSpeakerPhone(!this.state.isSpeakerEnabled);
  };

  mute = () => {
    this.setState(prevState => ({
      isAudioEnabled: !prevState.isAudioEnabled,
    })) && TwilioVoice.setMuted(this.state.isAudioEnabled);
  };

  getActiveCall() {
    return TwilioVoice.getActiveCall().then(incomingCall => {
      if (incomingCall) {
        _deviceDidReceiveIncoming(incomingCall);
      }
    });
  }

  componentDidMount() {
    this.initialize('eee');
  }

  initialize(token) {
    if (Platform.OS === 'ios') {
      this.initTelephonyWithUrl(token);
    } else {
      this.initTelephony(token);
    }
    this.getActiveCall();
    BackHandler.addEventListener('hardwareBackPress', this.disconnect);
  }

  render() {
    return (
      <Query query={ME}>
        {({loading, data}) => {
          let User_Data = loading ? null : data;

          return loading ? (
            <ActivityIndicator />
          ) : (
            <Mutation
              mutation={JOIN_VOICE_CALL}
              onCompleted={data => this.initialize(data.joinVoiceCall.token)}>
              {(joinVoiceCall, {loading, data, error}) => {
                let Mutation_Loading = loading;
                return (
                  <View style={[styles.container, {justifyContent: 'center'}]}>
                    <View style={styles.topBar}>
                      <Text style={styles.welcome}>AEGLE VOICE CALL</Text>
                    </View>
                    {this.state.incomingCall ? (
                      <View>
                        <Text style={{textAlign: 'center'}}>
                          Accept Incoming Call
                        </Text>
                        <TouchableOpacity
                          style={{height: 100}}
                          onPress={() => this.accept()}>
                          <Call />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                    <View style={styles.optionsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          {
                            backgroundColor: this.state.isSpeakerEnabled
                              ? 'green'
                              : null,
                          },
                        ]}
                        onPress={this.speaker}>
                        <Speaker style={{width: 40, height: 40}} />
                      </TouchableOpacity>
                      <Query
                        query={GetAppointmentById}
                        variables={{
                          appointmentId: this.props.navigation.getParam('id'),
                        }}>
                        {({loading, data}) =>
                          loading ? (
                            <ActivityIndicator />
                          ) : (
                            <TouchableOpacity
                              style={styles.optionButton}
                              onPress={() =>
                                !data.getAppointmentById.session
                                  ? null
                                  : this.state.callInit == 'connected'
                                  ? null
                                  : this.state.callInit == 'connect'
                                  ? joinVoiceCall({
                                      variables: {
                                        data: {
                                          sessionId:
                                            data.getAppointmentById.session.id,
                                          patientId: User_Data.me.id,
                                        },
                                      },
                                    })
                                  : this.disconnect()
                              }>
                              {!data.getAppointmentById.session ? (
                                <Text style={{color: 'white', fontSize: 11}}>
                                  Wait
                                </Text>
                              ) : Mutation_Loading ? (
                                <ActivityIndicator />
                              ) : this.state.callInit == 'connect' ? (
                                <Text style={{color: 'white', fontSize: 11}}>
                                  Connect
                                </Text>
                              ) : this.state.callInit == 'connected' ? (
                                <Text style={{color: 'white', fontSize: 11}}>
                                  Connected
                                </Text>
                              ) : (
                                <Text style={{color: 'white', fontSize: 18}}>
                                  End
                                </Text>
                              )}
                            </TouchableOpacity>
                          )
                        }
                      </Query>
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          {
                            backgroundColor: !this.state.isAudioEnabled
                              ? 'green'
                              : null,
                          },
                        ]}
                        onPress={this.mute}>
                        <Mute style={{width: 40, height: 40}} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
