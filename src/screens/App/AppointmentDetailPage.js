/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import CommonListItem from '../../Components/CommonListItem';
import DialogModal from '../../Components/DialogModal';
import {date2} from '../../Utils/dateFormater';
import {age} from '../../Utils/calculateAge';
import {
  capitalize,
  capitalizeEachWord,
} from '../../Utils/capitalizeFirstLetter';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {splitWord} from '../../Utils/splitWord';
import shortid from 'shortid';
import FastImage from 'react-native-fast-image';
import {NavigationActions} from 'react-navigation';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'rgba(196, 196, 196, 0.7)',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },
  cardStyle: {
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    backgroundColor: '#fff',
  },
  itemView: {
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
    borderBottomWidth: 1,
    paddingVertical: 15,
    marginVertical: 5,
  },
  labelText: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: '#828282',
    marginVertical: 2,
  },
  valueText: {
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    color: '#000',
    marginVertical: 2,
  },
  buttonStyleGray: {
    backgroundColor: '#DADADA',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginRight: 5,
  },
  titleStyleGray: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: '#828282',
  },
  buttonStyleBlue: {
    backgroundColor: '#1B2CC1',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginLeft: 5,
  },
  titleStyleBlue: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: '#fff',
  },
  buttonStyleWhite: {
    ...elevationShadowStyle(4),
    backgroundColor: '#1B2CC1',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginHorizontal: 5,
  },
  titleStyleWhite: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: '#fff',
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
  attachment: {
    height: 500,
    width: '100%',
    alignSelf: 'center',
  },
});

export default class AppointmentUpcomingDetailPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerLeft: <HeaderLeft navigation={navigation} />,
      headerStyle: {
        backgroundColor: '#fff',
        ...elevationShadowStyle(2),
      },
      headerLayoutPreset: 'center',
      headerTitleStyle: {
        fontFamily: 'Muli-ExtraBold',
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
      },
      headerRight: <View />,
      title: 'Appointment Info',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      dialogModal: 0,
      yesFunction: this.closeModal,
      appointment: {},
    };
  }

  closeModal = () => {
    this.setState({
      dialogModal: 0,
    });
  };

  openModal = () => {
    this.setState({
      dialogModal: 0,
    });
  };
  splitCamelCaseToString = word => {
    return word.split(/(?=[A-Z])/).join(' ');
  };
  componentDidMount() {
    const {navigation} = this.props;
    const appointment = navigation.getParam('appointment', {});
    this.setState({appointment});
  }
  render() {
    const appointment1 = this.props.navigation.getParam('appointment', {});
    // const image = appointment1.image;
    const {
      title,
      firstDesc,
      secondDesc,
      id,
      date,
      time,
      service,
      contact,
      attachments,
      additionalNotes,
      client,
      status,
      items,
      image,
      medicalPersonDetails,
      upcoming,
    } = this.state.appointment;
    const user = client ? (
      <CommonListItem
        cardStyle={styles.cardStyle}
        title={title}
        firstDesc={capitalize(firstDesc)}
        secondDesc={age(secondDesc)}
        image={image}
        original
      />
    ) : (
      <CommonListItem
        cardStyle={styles.cardStyle}
        title={`Dr. ${title}`}
        firstDesc={capitalize(firstDesc)}
        secondDesc={(secondDesc && capitalizeEachWord(secondDesc)) || '-'}
        image={image}
        original
        onPress={() => {
          this.props.navigation.navigate('DoctorProfile', {
            medicalDetails: medicalPersonDetails,
          });
        }}
      />
    );

    const appointmentStatus = (
      <View style={styles.itemView}>
        <Text style={styles.labelText}>Status</Text>
        <Text
          style={[
            styles.valueText,
            {
              color:
                status === 'PENDING'
                  ? 'orange'
                  : status === 'APPROVED'
                  ? 'purple'
                  : status === 'CANCELLED'
                  ? '#fd4b4b'
                  : status === 'COMPLETED'
                  ? '#41bd9a'
                  : status === 'RESCHEDULED'
                  ? 'pink'
                  : status === 'EXPIRED'
                  ? '#DF75BF'
                  : null,
            },
          ]}>
          {capitalize(status)}
        </Text>
      </View>
    );

    const footerButton =
      client || upcoming ? (
        <View style={styles.footer}>
          <View style={{flex: 1}}>
            <Button
              title="Cancel booking"
              cancel
              buttonStyle={styles.buttonStyleGray}
              titleStyle={styles.titleStyleGray}
              type="solid"
              onPress={() => {
                this.setState({
                  dialogModal: 1,
                });
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              title={
                status == 'APPROVED' && contact == 'CHAT'
                  ? 'Chat Room'
                  : status == 'APPROVED' && contact == 'VOICE_CALL'
                  ? 'Await Call...'
                  : 'Reschedule'
              }
              buttonStyle={styles.buttonStyleBlue}
              type="solid"
              titleStyle={styles.titleStyleBlue}
              onPress={() => {
                status == 'APPROVED' && contact == 'CHAT'
                  ? this.props.navigation.navigate('Chat', {id})
                  : status == 'APPROVED' && contact == 'VOICE_CALL'
                  ? this.props.navigation.navigate('VoiceChat', {id})
                  : this.setState({
                      dialogModal: 2,
                    });
              }}
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 20,
            paddingBottom: 20,
            marginBottom: 20,
          }}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.buttonStyleWhite}
              onPress={() => {
                this.props.navigation.navigate(
                  'DoctorNote',
                  {
                    appointmentId: this.state.appointment.id,
                  },
                  // NavigationActions.navigate({
                  //   routeName: 'Prescription',
                  // }),
                );
              }}>
              <Text style={styles.titleStyleWhite}>View Doctor's note</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {user}
          <View style={styles.itemView}>
            <Text style={styles.labelText}>Date & Time</Text>

            <Text style={styles.valueText}>
              {date2(date)} | {time}
            </Text>
          </View>
          <View style={styles.itemView}>
            <Text style={styles.labelText}>Service</Text>
            <Text style={styles.valueText}>
              {capitalize(service)} Appointment
            </Text>
          </View>
          {appointmentStatus}

          <View style={styles.itemView}>
            <Text style={styles.labelText}>Means of Contact</Text>
            <Text style={styles.valueText}>{splitWord(contact)}</Text>
          </View>
          {attachments && attachments.length > 0 && (
            <View style={styles.itemView}>
              <Text style={styles.labelText}>Attachment</Text>
              {attachments.map(attachment => {
                return (
                  <View key={shortid.generate()}>
                    <FastImage
                      style={styles.attachment}
                      source={{
                        uri: attachment.url,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                );
              })}
            </View>
          )}
          <View style={styles.itemView}>
            <Text style={styles.labelText}>Additional Note</Text>
            <Text style={styles.valueText}>{additionalNotes}</Text>
          </View>
          {footerButton}
        </ScrollView>
        <DialogModal
          id={id}
          isVisible={this.state.dialogModal > 0}
          onBackdropPress={this.closeModal}
          cancel={this.state.dialogModal === 1}
          reschedule={this.state.dialogModal === 2}
          question={`${'\n'}${'\n'}Our doctors, therapists and specialists are always here whenever you need help - you just need to ask!${'\n'}${'\n'}To reschedule this appointment, please select a time and date that suits you.`}
          title={`${
            this.state.dialogModal === 1 ? 'Cancel' : 'Reschedule'
          } booking?`}
          NoFunction={this.closeModal}
          YesFunction={this.state.yesFunction}
        />
      </View>
    );
  }
}
