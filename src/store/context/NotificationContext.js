import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Aegle from '../../assets/aegle-black.svg';
import {Subscription, withApollo} from 'react-apollo';
import {VIDEO_CALL_SUBSCRIPTION, MEPOST} from '../../QueryAndMutation';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 900,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 4,
  },
  logo: {
    alignSelf: 'center',
    margin: 10,
  },
  title: {
    paddingHorizontal: 15,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonDiv: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  accept: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
  },
  decline: {
    backgroundColor: '#C11B1B',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    color: 'white',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
});

// const NotificationContext = createContext();

class NotificationProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '1',
      sessionId: '2',
      open: false,
      id: '',
    };
  }

  async componentDidMount() {
    let that = this;

    const {client} = this.props;
    const res = await client.query({query: MEPOST});
    const {id} = res.data.me;

    // client.subscribe({query: VIDEO_CALL_SUBSCRIPTION}).subscribe({
    //   next({data}) {
    //     const {
    //       Time,
    //       RoomId,
    //       SessionId,
    //     } = data.emitNotificationWhenConsultIsStartedByDoctor;
    //     console.log(Time, RoomId, SessionId);
    //     that.setState({
    //       roomId: RoomId,
    //       sessionId: SessionId,
    //       open: true,
    //       id,
    //     });
    //   },
    // });
  }

  // // Joins the appointment
  // join = ({roomId, sessionId}) => {
  //   return {roomId, sessionId};
  // };

  // Declines - Cancels the appointment
  decline = () => {
    this.setState({open: false});
  };

  render() {
    const {roomId, sessionId, open} = this.state;
    return (
      <>
        {roomId && sessionId && open && (
          <View style={styles.container}>
            <View style={styles.body}>
              <Aegle style={styles.logo} />
              <Text style={styles.title}>
                Dr. Chuks started your video call appointment scheduled for
                12:30 today
              </Text>

              <View style={styles.buttonDiv}>
                <TouchableOpacity
                  onPress={() =>
                    this.join({
                      patientId: this.props.user.id,
                      roomId: this.state.roomId,
                      sessionId: this.state.sessionId,
                    })
                  }
                  style={styles.accept}>
                  <Text style={styles.button}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.decline()}
                  style={styles.decline}>
                  <Text style={styles.button}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {this.props.children}
        {/* </NotificationContext.Provider> */}
      </>
    );
  }
}

export default withApollo(NotificationProvider);
