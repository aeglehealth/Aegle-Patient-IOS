/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, Icon} from 'react-native-elements';
// import { DotsLoader } from "react-native-indicator";
import Modal from 'react-native-modal';
import shortid from 'shortid';
// import Client from 'twilio-chat';
import {ThisMonthInstance} from 'twilio/lib/rest/api/v2010/account/usage/record/thisMonth';
import ActivityIndicatorPage from '../screens/App/ActivityIndicatorPage';
import {UserContext} from '../store/context/UserContext';
import {Mutation, Query} from 'react-apollo';
import {JoinChatMutation, GetAppointmentById, ME} from '../QueryAndMutation';

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

var typing = false;

export default class Chat extends React.Component {
  static navigationOptions = {
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
          source={require('../assets/logo-black.png')}
          style={styles.headerImageIcon}
        />
      </View>
    ),
    headerRight: <View />,
  };

  constructor(props) {
    super(props);
    this.state = {
      loadingMessages: true,
      messagingClient: undefined,
      runMutation: 0,
      roomId: '',
      prevChat: [],
      message: '',
      messages: [],
      partsIndex: 0,
      index: 0,
      typing: undefined,
      modalVisible: false,
    };
    this.scrollView = null;
  }

  componentDidMount() {
    // this.Twilio();
    const {prevChat} = this.state;
    const {index} = this.state;
    if (this.state.messages.length > index) {
      prevChat.push({
        sender: 1,
        message: this.state.messages[index].chat,
      });

      this.setState(prevState => ({
        replyOptions: prevState.messages[index].responses,
      }));
    }
  }

  async Twilio(token) {
    await Client.create(token).then(client => {
      this.setState({messagingClient: client});
      client.on('tokenAboutToExpire', () =>
        console.log('Token about to expire'),
      );
      client.on('channelJoined', channel => {
        console.log('Joined channel ' + channel.friendlyName);

        channel.getMessages().then(messages => {
          this.setState({loadingMessages: false, messages: messages.items});
          // console.log(messages.items)
        });

        channel.on('messageAdded', () => this.getMessage());
        // channel.on("typingStarted", (member)=>{console.log("typing..."+member.channel.entity.uuid);return this.setState({typing:true})})
        // channel.on("typingEnded", (member)=>this.setState({typing:undefined}))
      });
      this.state.messagingClient
        .getChannelBySid(this.state.roomId)
        .then(channel => channel.join());
    });
  }

  async sendMessage() {
    var channel = await this.state.messagingClient.getChannelBySid(
      this.state.roomId,
    );
    var messageResponse = await channel.sendMessage(this.state.message);
    this.setState({message: ''});
  }

  async getMessage() {
    var channel = await this.state.messagingClient.getChannelBySid(
      this.state.roomId,
    );
    channel.getMessages().then(messages => {
      this.setState({messages: messages.items});
    });
  }

  async typingMessage() {
    var channel = await this.state.messagingClient.getChannelBySid(
      this.state.roomId,
    );
    channel.typing();
  }

  render() {
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    const chatBubbles = this.state.messages.map(d => {
      return (
        <Query query={ME}>
          {({data, loading}) =>
            loading ? (
              <ActivityIndicatorPage />
            ) : (
              <>
                {console.log(data)}
                <View
                  style={{
                    justifyContent:
                      d.author !== data.me.id ? 'flex-start' : 'flex-end',
                    flexDirection: 'row',
                  }}
                  key={shortid.generate()}>
                  <View
                    style={
                      d.author !== data.me.id
                        ? styles.chatReceived
                        : styles.chatSent
                    }>
                    <Text
                      style={[
                        styles.chatText,
                        {color: d.author !== data.me.id ? '#000' : '#fff'},
                      ]}>
                      {d.body}
                    </Text>
                  </View>
                </View>
              </>
            )
          }
        </Query>
      );
    });

    const replyOptions = (
      <>
        <TextInput
          style={{
            borderWidth: 1,
            marginVertical: 5,
            marginHorizontal: 10,
            borderRadius: 5,
            padding: 10,
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
    var appointment = false;
    console.log(
      this.props.navigation.state.params.appointmentId,
      this.props.navigation.state.params.patientId,
    );
    return (
      <Query
        query={GetAppointmentById}
        variables={{
          appointmentId: this.props.navigation.state.params.appointmentId,
        }}>
        {({data, loading}) => {
          appointment = data;
          if (!loading && this.state.roomId == '') {
            this.setState({
              roomId: appointment.getAppointmentById.session.room,
            });
            console.log('room', appointment.getAppointmentById.session.room);
          }
          return loading ? (
            <ActivityIndicatorPage />
          ) : (
            <Mutation mutation={JoinChatMutation}>
              {(joinChat, {data, loading, error}) => {
                if (data && !this.state.messagingClient)
                  this.Twilio(data.joinChat.token);
                if (loading) {
                  !data && this.state.runMutation == '0'
                    ? this.setState({
                        runMutation: this.state.runMutation + 1,
                      })
                    : null;
                } else {
                  this.state.runMutation == '1'
                    ? null
                    : joinChat({
                        variables: {
                          data: {
                            patientId: this.props.navigation.state.params
                              .patientId,
                            sessionId:
                              appointment.getAppointmentById.session.id,
                          },
                        },
                      });
                }
                return (
                  <View style={styles.container}>
                    {this.state.loadingMessages ? (
                      <>
                        <ActivityIndicatorPage />
                      </>
                    ) : (
                      <>
                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          ref={ref => {
                            this.scrollView = ref;
                          }}
                          onContentSizeChange={(
                            contentWidth,
                            contentHeight,
                          ) => {
                            this.scrollView.scrollToEnd({animated: true});
                          }}>
                          {chatBubbles}
                          {this.state.typing ? <Text>Typing...</Text> : null}
                          {this.state.typing ? (
                            <View style={{padding: 10}} />
                          ) : null}
                        </ScrollView>
                        <View style={{marginVertical: 10}}>{replyOptions}</View>
                      </>
                    )}
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
