import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler,
  AppState,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import Call from '../../assets/telephone.svg';
import Camera from '../../assets/camera.svg';
import Mute from '../../assets/mute.svg';
import Toast from '../../Components/toster/Alert';
import {
  COMPLETE_APPOINTMENT,
  MEPOST,
  GetAppointmentById,
} from '../../QueryAndMutation';
import {withApollo, Query} from 'react-apollo';
import KeepAwake from 'react-native-keep-awake';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  callContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40,
    fontFamily: 'Muli',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  button: {
    marginTop: 100,
  },
  localVideo: {
    flex: 1,
    width: '25%',
    height: '25%',
    position: 'absolute',
    left: 10,
    bottom: 100,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  remoteVideo: {
    flex: 1,
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
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
    marginBottom: 20,
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
  titleBar: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
  },
  toggle: {
    backgroundColor: 'white',
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class VideoChat extends Component {
  state = {
    isAudioEnabled: true,
    isVideoEnabled: true,
    status: 'disconnected',
    participants: new Map(),
    videoTracks: new Map(),
    roomName: this.props.navigation.state.params.roomName,
    token: this.props.navigation.state.params.token,
    appointmentId: this.props.navigation.state.params.appointmentId,
    // roomName: 'this.props.navigation.state.params.roomName',
    // token: 'this.props.navigation.state.params.token',
    // appointmentId: 'this.props.navigation.state.params.appointmentId',
    appState: AppState.currentState,
    status: true,
  };

  static navigationOptions = {headerShown: false};

  _onConnectButtonPress = () => {
    this.refs.twilioVideo.connect({
      roomName: this.state.roomName,
      accessToken: this.state.token,
    });
    this.setState({status: 'connecting'});
  };

  _onEndButtonPress = async () => {
    const {appointmentId} = this.state;
    const {client} = this.props;

    this.refs.twilioVideo.disconnect();

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
      console.log(res, 'res1');
      if (res.data.completeAppointment) {
        console.log(res, 'res2');
        this.props.navigation.navigate('Ratings', {appointmentId});
      } else {
        this.props.navigation.navigate('Home');
      }
      return;
    } catch (err) {
      this.props.navigation.navigate('Home');
    }
  };

  _handleAppStateChange = nextAppState => {
    if (
      (this.state.appState.match('active') && nextAppState === 'inactive') ||
      (this.state.appState.match('active') && nextAppState === 'background')
    ) {
      console.log('App has exited the foreground!');
      this._onEndButtonPress();
    }
    this.setState({appState: nextAppState});
  };

  _onMuteButtonPress = () => {
    this.refs.twilioVideo
      .setLocalAudioEnabled(!this.state.isAudioEnabled)
      .then(isEnabled => this.setState({isAudioEnabled: isEnabled}));
  };

  _onFlipButtonPress = () => {
    this.refs.twilioVideo.flipCamera();
  };

  _onRoomDidConnect = () => {
    this.setState({status: 'connected'});
  };

  _onRoomDidDisconnect = ({roomName, error}) => {
    console.log('this call has endedddd!');
    const {appointmentId} = this.state;
    Toast('The call has ended!');
    this.setState({status: 'disconnected'});
    this.props.navigation.navigate('Ratings', {appointmentId});
  };

  _onRoomDidFailToConnect = error => {
    console.log('ERROR: ', error);

    this.setState({status: 'disconnected'});
    Toast('Connection failure.');
    this.props.navigation.navigate('Home');
  };

  componentDidMount() {
    this._onConnectButtonPress();
    AppState.addEventListener('change', this._handleAppStateChange);
    BackHandler.addEventListener('hardwareBackPress', this._onEndButtonPress);
  }

  componentWillUnmount = () => {
    AppState.removeEventListener('change', this._handleAppStateChange);
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this._onEndButtonPress,
    );
  };

  render() {
    const {appointmentId} = this.state;
    if (this.state.status === 'connected') {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
    return (
      <>
        <Query
          query={GetAppointmentById}
          fetchPolicy="network-only"
          variables={{appointmentId}}
          pollInterval={5000}>
          {({loading, error, data}) => {
            if (loading) return <Text> </Text>;
            if (error) return <Text>{error}</Text>;
            const {status} = data.getAppointmentById;
            if (status === 'CANCELLED' || status === 'COMPLETED') {
              this.props.navigation.navigate('Ratings', {appointmentId});
            }
            return (
              <View style={styles.container}>
                <View style={styles.callContainer}>
                  <View
                    style={{
                      alignSelf: 'center',
                      position: 'absolute',
                      top: 200,
                    }}>
                    <Image
                      source={require('../../assets/logo-black.png')}
                      style={{width: 250, height: 250}}
                    />
                  </View>

                  <View style={styles.optionsContainer}>
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={this._onEndButtonPress}>
                      <Call />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={this._onMuteButtonPress}>
                      {this.state.isAudioEnabled ? (
                        <Mute style={{width: 40, height: 40}} />
                      ) : (
                        <View style={styles.toggle}>
                          <Mute style={{width: 40, height: 40}} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                  {/* <TwilioVideoLocalView enabled={false} style={styles.localVideo} /> */}
                </View>
              </View>
            );
          }}
        </Query>
        <TwilioVideo
          ref="twilioVideo"
          onRoomDidConnect={this._onRoomDidConnect}
          onRoomDidDisconnect={this._onRoomDidDisconnect}
          onRoomDidFailToConnect={this._onRoomDidFailToConnect}
          // onParticipantAddedVideoTrack={
          //   this._onParticipantAddedVideoTrack
          // }
          // onParticipantRemovedVideoTrack={
          //   this._onParticipantRemovedVideoTrack
          // }
        />
      </>
    );
  }
}

export default withApollo(VideoChat);
