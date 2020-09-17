/* eslint-disable react/prefer-stateless-function */
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button} from 'react-native-elements';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import {useMutation} from '@apollo/react-hooks';
import {
  CANCEL_APPOINTMENT,
  RESCHEDULE_APPOINTMENT,
  DELETE_FAMILY_MEMBER,
  MEPOST,
  APPOINTMENTS,
} from '../QueryAndMutation';
import {withNavigation} from 'react-navigation';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {date5} from '../Utils/dateFormater';

const styles = StyleSheet.create({
  optionsModalView: {
    marginTop: 10,
    maxHeight: 800,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'space-around',
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#1B2CC1',
  },
  modalHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 20,
    marginBottom: 5,
  },
  modalBodyText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 18,
    marginLeft: 5,
  },
  modalFooterText: {
    color: '#1B2CC1',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    marginLeft: 15,
  },
  TextInputStyleClass: {
    textAlign: 'center',
    height: 50,
    borderWidth: 1.5,
    borderColor: '#1B2CC1',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    height: 150,
    marginVertical: 10,
  },
  inputText: {
    fontFamily: 'muli-regular',
    fontSize: 16,
    color: 'rgba(0,0,0,0.7)',
    textAlign: 'center',
  },
});

const DialogModal = props => {
  const {id, loadingProp} = props;

  const [state, setState] = useState({
    reason: '',
    isDateTimePickerVisible: false,
    date: '',
    time: '',
  });
  const {reason, isDateTimePickerVisible, date, time} = state;
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const [cancelAppointment, {loading, error}] = useMutation(
    CANCEL_APPOINTMENT,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: APPOINTMENTS,
        },
      ],
    },
  );
  const [
    rescheduleAppointment,
    {loading: loading1, error: error1},
  ] = useMutation(RESCHEDULE_APPOINTMENT, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: APPOINTMENTS,
      },
    ],
  });
  const [deleteFamilyMember, {loading: loading2, error: erro2}] = useMutation(
    DELETE_FAMILY_MEMBER,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: MEPOST,
        },
      ],
    },
  );
  const showDateTimePicker = () => {
    setState({isDateTimePickerVisible: true});
  };

  const hideDateTimePicker = () => {
    setState({isDateTimePickerVisible: false});
  };

  const handleDatePicked = date => {
    const formatDate = date5(date);
    const splitDate = formatDate.split(' ');
    const dates = splitDate[0];
    const time = splitDate[1];
    console.log(date, dates, 'dateeee', time);
    hideDateTimePicker();
    setState({date, time});
  };
  const handleRemoveFamilyMember = async () => {
    const familyId = id;
    await deleteFamilyMember({
      variables: {familyId},
    })
      .then(res => {
        props.NoFunction();
        props.navigation.navigate('CompletedAction', {
          title: 'Removed!',
          subtitle: 'Voila! Family Member successfully removed',
          onCompleted: () => {
            props.navigation.goBack();
          },
        });
      })
      .catch(err => console.log(err, 'error'));
  };

  const handleCancelAppointment = async id => {
    const data = {
      appointmentId: props.id,
      reason: state.reason,
    };

    await cancelAppointment({variables: {data}})
      .then(res => {
        props.NoFunction();
        props.navigation.navigate('CompletedAction', {
          title: 'Cancelled!',
          subTitle: 'Voila! Appointment succesfully cancelled',
          onCompleted: () => {
            props.navigation.goBack();
          },
        });
      })
      .catch(err => console.log(err, 'error'));
  };
  const handleRescheduleAppointment = async id => {
    const data = {
      appointmentId: props.id,
      time: state.time,
      date: state.date,
    };

    await rescheduleAppointment({variables: {data}})
      .then(res => {
        props.NoFunction();
        props.navigation.navigate('CompletedAction', {
          title: 'Rescheduled!',
          subTitle: 'Voila! Appointment succesfully Rescheduled',
          onCompleted: () => {
            props.navigation.goBack();
          },
        });
      })
      .catch(err => console.log(err, 'error'));
  };

  const selected = `${date5(date).split(' ')[0]} | ${time}`;
  return (
    <Modal
      isVisible={props.isVisible}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      onBackdropPress={props.onBackdropPress}>
      <View style={styles.optionsModalView}>
        <Text style={styles.modalHeaderText}>{props.title}</Text>
        <Text style={styles.modalBodyText}>{props.question}</Text>

        {props.cancel && (
          <TextInput
            style={styles.TextInputStyleClass}
            underlineColorAndroid="transparent"
            placeholder={'Why do you want to cancel this appointment?'}
            placeholderTextColor={'#9E9E9E'}
            numberOfLines={10}
            multiline={true}
            value={state.reason}
            onChangeText={text =>
              setState({
                ...state,
                reason: text,
              })
            }
          />
        )}

        {props.reschedule && (
          <View>
            <TouchableWithoutFeedback
              underlayColor="rgba(0, 0, 0, 0.01)"
              onPress={showDateTimePicker}>
              <View
                style={{
                  ...styles.TextInputStyleClass,
                  height: 50,
                  justifyContent: 'center',
                }}>
                <Text style={styles.inputText}>
                  {date ? selected : 'Select date and time'}
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <DateTimePicker
              isVisible={state.isDateTimePickerVisible}
              onConfirm={handleDatePicked}
              onCancel={hideDateTimePicker}
              mode="datetime"
            />
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Button
            type="clear"
            title="Cancel"
            disabled={loading || loading1 || loading2 || loadingProp}
            titleStyle={styles.modalFooterText}
            onPress={props.NoFunction}
          />

          <Button
            type="clear"
            title="Continue"
            disabled={
              props.cancel
                ? !state.reason
                : props.reschedule
                ? !time ||
                  !date ||
                  loading ||
                  loading1 ||
                  loading2 ||
                  loadingProp
                : null
            }
            loading={loading || loading1 || loading2 || loadingProp}
            titleStyle={styles.modalFooterText}
            onPress={
              props.cancel
                ? () => handleCancelAppointment()
                : props.reschedule
                ? () => handleRescheduleAppointment()
                : props.removeFamily
                ? () => handleRemoveFamilyMember(props.id)
                : props.YesFunction
            }
          />
        </View>
      </View>
    </Modal>
  );
};

DialogModal.propTypes = {
  title: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  NoFunction: PropTypes.func.isRequired,
  YesFunction: PropTypes.func.isRequired,
  onBackdropPress: PropTypes.func,
  isVisible: PropTypes.bool.isRequired,
};

DialogModal.defaultProps = {
  onBackdropPress: () => {},
};

export default withNavigation(DialogModal);
