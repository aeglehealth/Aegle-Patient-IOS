/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, View, FlatList, Image, Text} from 'react-native';
import shortid from 'shortid';
import CommonListItem from '../../Components/CommonListItem';
import EmptyContent from '../../Components/EmptyContent';
import {Query} from 'react-apollo';
import {APPOINTMENTS} from '../../QueryAndMutation';
import ActivityIndicatorPage from './ActivityIndicatorPage';
import {date2} from '../../Utils/dateFormater';
import moment from 'moment';
import {capitalize} from '../../Utils/capitalizeFirstLetter';
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
  },

  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class AppointmentsPreviousPage extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      appointmentIcon: require('../../assets/notification-appointment.png'),
      forumIcon: require('../../assets/notification-forum.png'),
    };
  }

  getAge = dob => {
    const currentDate = date2(moment());
    const dob1 = date2(dob);
    const age = moment(moment()).diff(dob1, 'years');

    return age;
  };
  calculate_age = dob => {
    var diff_ms = Date.now() - dob;
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  handleRenderItem = (item, navigation) => {
    const {
      approvedBy: {
        profile: {firstName, lastName, gender, speciality, photo},
      },
    } = item;
    const {approvedBy} = item;
    const doctorDetails = JSON.stringify(approvedBy);
    const items = JSON.stringify(item);
    const fullName = `${firstName} ${lastName}`;
    const fullNameInfo = fullName;
    const genderInfo = gender;

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

    return (
      <CommonListItem
        key={shortid.generate()}
        title={`Dr. ${fullName}`}
        firstDesc={`${capitalize(item.consultationType)} Appointment`}
        secondDesc={date2(item.date) || 'jj'}
        image={photo}
        onPress={() => {
          navigation.navigate('AppointmentDetail', {
            appointment: {
              title: fullNameInfo,
              firstDesc: genderInfo || '-',
              secondDesc: speciality,
              id,
              date,
              time,
              service: consultationType,
              status,
              contact: meansOfContact,
              additionalNotes,
              image: photo,
              medicalPersonDetails: doctorDetails,
              items,
              attachments,
            },
          });
        }}
      />
    );
  };

  render() {
    const {navigation} = this.props.screenProps;
    return (
      <Query query={APPOINTMENTS} fetchPolicy="network-only">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return <Text>There was an error</Text>;
          const {patientAppointments} = data;
          const previousAppointments = patientAppointments.filter(
            i => i.status === 'COMPLETED',
          );
          return (
            <View style={styles.container}>
              <FlatList
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                data={previousAppointments}
                renderItem={({item}) => this.handleRenderItem(item, navigation)}
                keyExtractor={item => item.id}
                ListEmptyComponent={<EmptyContent text="No appointment" />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          );
        }}
      </Query>
    );
  }
}
