/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Header} from 'react-native-elements';
import shortid from 'shortid';
import {Query} from 'react-apollo';
import ActivityIndicatorPage from '../../screens/App/ActivityIndicatorPage';
import {NOTIFICATION} from '../../QueryAndMutation';
import moment from 'moment';
import {NavigationActions} from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    width: '100%',
  },
  headerStyle: {
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
    paddingTop: 0,
    paddingBottom: 0,
    height:
      Platform.select({
        android: 56,
        default: 50,
      }) + 20,
    width: '100%',
  },
  headerLeftContainerStyle: {
    flex: 10,
    paddingTop: 20,
    width: '100%',
  },
  cardBodyText: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontFamily: 'muli-regular',
    fontSize: 14,
  },
  cardTimeText: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontFamily: 'muli-regular',
    fontSize: 12,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 18,
    marginBottom: 5,
  },
  imageIcon: {
    maxHeight: 30,
    maxWidth: 30,
    alignSelf: 'center',
  },
  careCard: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: 'rgba(196, 196, 196, 0.4)',
    borderBottomWidth: 2,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#0066F5',
    width: 65,
    height: 65,
    borderRadius: 40,
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginVertical: 10,
  },
  headerText1: {
    fontFamily: 'Muli-Regular',
    textAlign: 'left',
    flex: 10,
    fontSize: 30,
    marginTop: 10,
    lineHeight: 38,
    fontWeight: 'bold',
    padding: 5,
    width: '100%',
  },
  emptyIcon: {
    alignSelf: 'center',
    maxWidth: 200,
    maxHeight: 200,
    marginTop: 20,
  },
});

export default class NotificationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentIcon: require('../../assets/notification-appointment.png'),
      forumIcon: require('../../assets/notification-forum.png'),
    };
  }

  componentDidMount() {}

  render() {
    return (
      <>
        <View style={styles.container}>
          <Header
            containerStyle={styles.headerStyle}
            leftComponent={<Text style={styles.headerText1}>Notification</Text>}
            leftContainerStyle={styles.headerLeftContainerStyle}
          />
          <ScrollView
            style={{paddingHorizontal: 15}}
            showsVerticalScrollIndicator={false}>
            <Query query={NOTIFICATION} pollInterval={5000}>
              {({loading, error, data}) => {
                if (loading)
                  return (
                    <View
                      style={{height: Dimensions.get('screen').height / 1.2}}>
                      <ActivityIndicatorPage />
                    </View>
                  );
                console.log(data);
                if (data && data.getNotifications)
                  return data.getNotifications.length == 0 ? (
                    <View style={{paddingHorizontal: 15}}>
                      <Image
                        style={styles.emptyIcon}
                        source={require('../../assets/empty-notification.png')}
                      />
                      <Text
                        style={[
                          styles.bodyText,
                          {textAlign: 'center', marginHorizontal: 20},
                        ]}>
                        You do not have any notifications yet
                      </Text>
                    </View>
                  ) : (
                    data.getNotifications.map((notification, key) => (
                      <TouchableOpacity
                        onPress={() =>
                          notification.type == 'Referral' ||
                          notification.type == 'Report' ||
                          notification.type == 'Prescription'
                            ? this.props.navigation.navigate(
                                'DoctorNote',
                                {
                                  appointmentId: notification.appointment.id,
                                },
                                NavigationActions.navigate({
                                  routeName: notification.type,
                                }),
                              )
                            : // notification.appointment
                              //   ? this.props.navigation.navigate(
                              //       'AppointmentDetail',
                              //       {
                              //         appointment: {
                              //           title:
                              //             notification.owner.profile.firstName +
                              //             ' ' +
                              //             notification.owner.profile.lastName,
                              //           firstDesc:
                              //             notification.owner.profile.gender,
                              //           secondDesc:
                              //             notification.owner.profile.dateOfBirth,
                              //           id: notification.appointment.id,
                              //           date:
                              //             notification.appointment.ConsultationDate,
                              //           time: notification.appointment.time,
                              //           service: '_',
                              //           status: notification.appointment.status,
                              //           contact:
                              //             notification.appointment.meansOfContact,
                              //           additionalNotes:
                              //             notification.appointment.additionalNotes,
                              //           client: true,
                              //         },
                              //       },
                              //     )
                              null
                        }>
                        <View style={styles.careCard} key={shortid.generate()}>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                            }}>
                            <View style={styles.cardImageContainer}>
                              <Image
                                style={styles.imageIcon}
                                source={this.state.appointmentIcon}
                              />
                            </View>
                          </View>

                          <View style={styles.cardText}>
                            <View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <Text style={styles.cardHeaderText}>
                                  Appointment
                                </Text>
                                <Text style={styles.cardTimeText}>
                                  {moment(notification.createdAt).fromNow()}
                                </Text>
                              </View>

                              <Text style={styles.cardBodyText}>
                                {notification.message}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))
                  );
                return (
                  <View style={{paddingHorizontal: 15}}>
                    <Image
                      style={styles.emptyIcon}
                      source={require('../../assets/empty-notification.png')}
                    />
                    <Text
                      style={[
                        styles.bodyText,
                        {textAlign: 'center', marginHorizontal: 20},
                      ]}>
                      You do not have any notifications yet
                    </Text>
                  </View>
                );
              }}
            </Query>
          </ScrollView>
        </View>
      </>
    );
  }
}
