/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableHighlight,
  Platform,
  FlatList,
} from 'react-native';
import shortid from 'shortid';
import {Query} from 'react-apollo';
import {
  APPOINTMENTS,
  MEPOST,
  ACTIVE_SUBSCRIPTION,
} from '../../QueryAndMutation';
import ActivityIndicatorPage from '../App/ActivityIndicatorPage';
import CommonListItem from '../../Components/CommonListItem';
import EmptyContent from '../../Components/EmptyContent';
import {date2} from '../../Utils/dateFormater';
import {disabled} from '../../Utils/disableAppointment';
import {HeaderLeft} from '../../Components/HeaderLeft';
import moment from 'moment';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';

function elevationShadowStyle(elevation) {
  if (Platform.OS === 'ios') {
    return {
      elevation,
      shadowColor: 'rgba(196, 196, 196, 0.4)',
      shadowOffset: {width: 0, height: 0.5 * elevation},
      shadowOpacity: 0.5,
      shadowRadius: 0.8 * elevation,
    };
  } else {
    return {
      elevation,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 0.5 * elevation},
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
    };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  bodyText: {
    color: '#555',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    marginBottom: 30,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 5,
  },
  cardBodyText: {
    color: '#000',
    fontFamily: 'muli-regular',
    fontSize: 14,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
  },
  imageIcon: {
    maxHeight: 65,
    maxWidth: 65,
    alignSelf: 'center',
  },
  careCard: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    ...elevationShadowStyle(3),
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#0066F5',
    width: 55,
    height: 55,
    overflow: 'hidden',
    borderRadius: 40,
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  buttonBigStyle: {
    backgroundColor: '#263AE7',
    borderRadius: 5,
    marginBottom: 10,
    paddingVertical: 25,
    justifyContent: 'flex-start',
    paddingLeft: 20,
    overflow: 'hidden',
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Muli-Bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontFamily: 'Muli-Bold',
    fontSize: 14,
    marginVertical: 10,
  },
});

export default class TalkToDoctorPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  render() {
    // const yes = moment().subtract(1, 'days');
    // console.log(yes, 'yes');
    return (
      <Query query={APPOINTMENTS} fetchPolicy="network-only">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return <Text>{error}</Text>;
          const {patientAppointments} = data;
          console.log(data, 'data');
          const upComingAppointments = patientAppointments.filter(
            i => i.status === 'PENDING' || i.status === 'RESCHEDULED',
          );
          return (
            <Query query={MEPOST} fetchPolicy="network-only">
              {({loading: proLoading, error: proError, data: proData}) => {
                if (proLoading) return <ActivityIndicatorPage />;
                if (proError) return <Text>{proError}</Text>;
                const {
                  firstName,
                  lastName,
                  dateOfBirth,
                  gender,
                  photo,
                } = proData.me.profile;
                const fullName = `${firstName} ${lastName}`;
                return (
                  <View style={styles.container}>
                    <FlatList
                      removeClippedSubviews={true}
                      scrollEventThrottle={16}
                      showsVerticalScrollIndicator={false}
                      ListHeaderComponent={
                        <>
                          <View>
                            <Text style={styles.headerText}>
                              Talk to a Doctor
                            </Text>
                            <Text style={styles.bodyText}>
                              Get medical advice, second opinion or
                              prescriptions. Schedule a call or chat session to
                              get help at your convenience.
                            </Text>
                          </View>
                          <View>
                            <Query
                              query={ACTIVE_SUBSCRIPTION}
                              fetchPolicy="cache-and-network">
                              {({loading, error, data}) => {
                                if (loading) return <ActivityIndicatorPage />;
                                if (error) return console.log('error');
                                const me = data.me ? data.me : null;
                                const {
                                  profile: {photo},
                                  local: {email},
                                } = me;
                                const {activeUserSubscriptions} = data;
                                return (
                                  <ImageBackground
                                    source={require('../../assets/btn-bg-doctor.jpg')}
                                    style={styles.buttonBigStyle}>
                                    <TouchableHighlight
                                      onPress={() => {
                                        if (
                                          activeUserSubscriptions.length == 0 ||
                                          (activeUserSubscriptions &&
                                            !activeUserSubscriptions[0].renew)
                                        ) {
                                          ShowMessage(
                                            type.ERROR,
                                            'Oops! You do not have Subscription plan. Please Subscribe to proceed.',
                                          );
                                          return;
                                        }

                                        this.props.navigation.navigate(
                                          // 'AppointmentSchedule',
                                          'BookAppointment',
                                        );
                                      }}
                                      underlayColor="rgba(0,0,0,0.01)">
                                      <View>
                                        <Text style={styles.buttonTextStyle}>
                                          Tap here to book an appointment
                                        </Text>
                                      </View>
                                    </TouchableHighlight>
                                  </ImageBackground>
                                );
                              }}
                            </Query>
                          </View>
                          <Text style={styles.sectionTitle}>
                            RECENT APPOINTMENT
                          </Text>
                        </>
                      }
                      data={upComingAppointments}
                      renderItem={({item}) => {
                        const familyFirstName = item.family
                          ? item.family.firstName
                          : null;
                        const familyLastName = item.family
                          ? item.family.lastName
                          : null;
                        const fullNameInfo = item.family
                          ? `${familyFirstName} ${familyLastName}`
                          : fullName;
                        const genderInfo = item.family
                          ? item.family.gender
                          : gender;
                        const dateOfBirthInfo = item.family
                          ? item.family.dateOfBirth
                          : dateOfBirth;

                        const picture = item.family ? item.family.photo : photo;
                        const {
                          id,
                          time,
                          date,
                          meansOfContact,
                          status,
                          consultationType,
                          additionalNotes,
                          attachments,
                        } = item;
                        console.log(attachments, 'pics');
                        return (
                          <CommonListItem
                            disabled={disabled(date, time)}
                            key={shortid.generate()}
                            title={fullNameInfo}
                            firstDesc={`${item.consultationType} APPOINTMENT`}
                            secondDesc={date2(item.date) || 'jj'}
                            // image={require('../../assets/user-default.png')}
                            image={picture}
                            onPress={() => {
                              this.props.navigation.navigate(
                                'AppointmentDetail',
                                {
                                  appointment: {
                                    title: fullNameInfo,
                                    firstDesc: genderInfo || '-',
                                    secondDesc: dateOfBirthInfo,
                                    id,
                                    date,
                                    time,
                                    service: consultationType,
                                    status,
                                    contact: meansOfContact,
                                    additionalNotes,
                                    image: picture ? picture : '',
                                    client: true,
                                    attachments,
                                  },
                                },
                              );
                            }}
                          />
                        );
                      }}
                      keyExtractor={item => item.id}
                      ListEmptyComponent={
                        <EmptyContent text="No appointment" />
                      }
                    />
                  </View>
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}
// import moment from 'moment';
// export const disabled = (date, time) => {
//   if (!date || !time) {
//     console.log('kikikik');
//   } else {
//     console.warn(date, time, 'd');
//   }
//   console.log(time, 'll');
//   // let date = '2020-07-04';
//   // let time = '01:15AM';

//   // let time = '00:45 AM';
// };
// export const disabled = (date, time) => {
//   //  console.log(time, 'll');
//   // let date = '2020-07-04';
//   // let time = '01:15AM';
//   console.warn(date, time, 'd');
//   // let time = '00:45 AM';
//   let timePassed;
//   // get current Hour
//   const currentHour = new Date().getHours();
//   let newHour;
//   let isPassed;
//   // check if its pm
//   if (time && time.includes('PM')) {
//     // remOve PM
//     const numberTime = time && time.slice(0, 5);
//     // convert string time to number
//     let integer = parseInt(numberTime, 10);
//     // set new hour to the integer
//     newHour = integer + 12;
//   } else {
//     const numberTime = time.slice(0, 5);
//     let integer = parseInt(numberTime, 10);
//     newHour = integer;
//   }

//   // compare hours
//   if (currentHour > newHour) {
//     timePassed = true;
//   } else if (currentHour === newHour) {
//     timePassed = false;
//   } else {
//     timePassed = false;
//   }

//   const dayPassed = moment(date).isBefore(moment().subtract(1, 'days'));
//   console.log(date, moment().subtract(1, 'days'));
//   // const isPassed = dayPassed && timePassed;
//   if (dayPassed === true && timePassed === true) {
//     isPassed = true;
//   } else {
//     isPassed = false;
//   }
//   const t = dayPassed && timePassed;
//   console.log(dayPassed, 'dayPassed');
//   console.log(timePassed, 'timePassed');
//   console.log(dayPassed && timePassed, 'jjjjjjjjjjjj');

//   return isPassed;
// };
