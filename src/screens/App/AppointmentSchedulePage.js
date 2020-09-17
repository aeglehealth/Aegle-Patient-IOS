/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Modal from 'react-native-modal';
import RadioGroup from '../../Components/RadioGroup';
import {UserContext} from '../../store/context/UserContext';
import {date2} from '../../Utils/dateFormater';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  bodyText: {
    color: '#555',
    fontFamily: 'muli-regular',
    fontSize: 14,
    marginBottom: 30,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 5,
  },
  modalHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 20,
    marginBottom: 5,
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginVertical: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  inputText: {
    fontFamily: 'muli-regular',
    fontSize: 16,
    color: 'rgba(0,0,0,0.7)',
  },
  genderView: {
    marginTop: 30,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
  },
  genderViewInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  genderModalView: {
    marginTop: 22,
    maxHeight: 250,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'flex-start',
    marginHorizontal: 20,
  },
});

export default class AppointmentDetailsPage extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      dob: null,
      modalVisible: false,
      gender: 'Gender',
      genderOptions: [
        {
          label: 'Male',
          size: 25,
        },
        {
          label: 'Female',
          size: 25,
        },
      ],
    };
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    this.hideDateTimePicker();
    this.setState({dob: date.toLocaleDateString()});
  };

  // update state
  onPress = (data, selected) => {
    this.setState({
      genderOptions: data,
      gender: selected.label,
      modalVisible: false,
    });
  };

  render() {
    // const {dob} = this.state;
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    return (
      <UserContext.Consumer>
        {({data}) => {
          const {profile} = data.me;
          const {dateOfBirth, gender} = profile;
          const dob = date2(dateOfBirth);
          return (
            <View style={styles.container}>
              <ScrollView
                style={{marginHorizontal: 15}}
                showsVerticalScrollIndicator={false}>
                <View>
                  <Text style={styles.headerText}>Details Required</Text>
                  <Text style={styles.bodyText}>
                    Please provide the following information. This helps us to
                    offer the right healthcare service
                  </Text>
                </View>
                <View>
                  <View style={styles.genderView}>
                    <TouchableWithoutFeedback
                      underlayColor="rgba(0, 0, 0, 0.01)"
                      onPress={this.showDateTimePicker}>
                      <View style={styles.genderViewInner}>
                        <Text style={styles.inputText}>
                          {dob || 'Date of birth'}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                  />

                  <View style={styles.genderView}>
                    <TouchableWithoutFeedback
                      underlayColor="rgba(0, 0, 0, 0.01)"
                      onPress={() => {
                        this.setState({
                          modalVisible: true,
                        });
                      }}>
                      <View style={styles.genderViewInner}>
                        <Text style={styles.inputText}>
                          {gender || 'Update your profil to see the gender'}
                        </Text>
                        <Icon type="material-community" name="chevron-down" />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Button
                    type="solid"
                    title="CONTINUE"
                    buttonStyle={styles.buttonSolidStyle}
                    titleStyle={styles.buttonSolidTitleStyle}
                    onPress={() => {
                      this.props.navigation.navigate('BookAppointment', {
                        dob,
                      });
                    }}
                  />
                </View>
              </ScrollView>
              <Modal
                isVisible={this.state.modalVisible}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                onBackdropPress={() => {
                  this.setState({
                    modalVisible: false,
                  });
                }}>
                <View style={styles.genderModalView}>
                  <Text style={styles.modalHeaderText}>Gender</Text>
                  <RadioGroup
                    radioButtons={this.state.genderOptions}
                    onPress={this.onPress}
                  />
                </View>
              </Modal>
            </View>
          );
        }}
      </UserContext.Consumer>
    );
  }
}
