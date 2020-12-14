/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {Mutation, Query} from 'react-apollo';
import {Overlay} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import FastImage from 'react-native-fast-image';
import {
  CREATE_APPOINTMENT,
  HOME_VISIT,
  MEPOST,
  APPOINTMENTS,
  UPLOAD,
} from '../../QueryAndMutation';
import {HeaderLeft} from '../../Components/HeaderLeft';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
import {date8} from '../../Utils/dateFormater';
import {ReactNativeFile} from 'apollo-upload-client';
import ActivityIndicatorPage from '../App/ActivityIndicatorPage';
import HOMEVISIT from '../../assets/home_visit.svg';
import ImagePicker from 'react-native-image-picker';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardBodyText: {
    color: '#828282',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageIcon: {
    maxHeight: 60,
    maxWidth: 60,
    alignSelf: 'center',
  },
  careCard: {
    borderColor: 'rgba(196, 196, 196, 0.4)',
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 10,
  },
  careCardInner: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cardImageContainer: {
    justifyContent: 'center',
    maxHeight: 65,
    maxWidth: 65,
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  contactButtonTitle: {
    marginLeft: 15,
    fontFamily: 'Muli-Bold',
    fontSize: 14,
  },
  input: {
    borderBottomWidth: 1,
    textAlignVertical: 'top',
    borderBottomColor: '#C4C4C4',
    marginVertical: 10,
    paddingVertical: 2,
    fontSize: 13,
    fontFamily: 'Muli-Regular',
    height: 120,
  },
  buttonSolidStyle: {
    marginVertical: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#1B2CC1',
  },
  buttonSolidTitleStyle: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  textInputStyleClass: {
    borderWidth: 1,
    borderColor: 'rgba(130, 130, 130, 0.2)',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    height: 150,
    marginVertical: 10,
    paddingVertical: 10,
    paddingLeft: 15,
  },
});

const pickerStyle = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: 'Helvetica Neue',
    paddingTop: 5,
  },
  inputAndroid: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: 'Helvetica Neue',
    paddingTop: 5,
  },
  placeholder: {
    color: '#979797',
    fontSize: 14,
    lineHeight: 17,
    fontFamily: 'Helvetica Neue',
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
});

const statesVlues = [
  {label: 'ABIA', value: 'ABIA'},
  {label: 'ABUJA', value: 'ABUJA'},
  {label: 'ADAMAWA', value: 'ADAMAWA'},
  {label: 'AKWA IBOM', value: 'AKWA'},
  {label: 'ANAMBRA', value: 'ANAMBRA'},
  {label: 'BAUCHI', value: 'BAUCHI'},
  {label: 'BAYELSA', value: 'BAYELSA'},
  {label: 'BENUE', value: 'BENUE'},
  {label: 'BORNO', value: 'BORNO'},
  {label: 'CROSS RIVER', value: 'CROSS_RIVER'},
  {label: 'DELTA', value: 'DELTA'},
  {label: 'EBONYI', value: 'EBONYI'},
  {label: 'EDO', value: 'EDO'},
  {label: 'EKITI', value: 'EKITI'},
  {label: 'ENUGU', value: 'ENUGU'},
  {label: 'GOMBE', value: 'GOMBE'},
  {label: 'IMO', value: 'IMO'},
  {label: 'JIGAWA', value: 'JIGAWA'},
  {label: 'KADUNA', value: 'KADUNA'},
  {label: 'KANO', value: 'KANO'},
  {label: 'KATSINA', value: 'KATSINA'},
  {label: 'KEBBI', value: 'KEBBI'},
  {label: 'KOGI', value: 'KOGI'},
  {label: 'KWARA', value: 'KWARA'},
  {label: 'LAGOS', value: 'LAGOS'},
  {label: 'NASARAWA', value: 'NASARAWA'},
  {label: 'NIGER', value: 'NIGER'},
  {label: 'OGUN', value: 'OGUN'},
  {label: 'ONDO', value: 'ONDO'},
  {label: 'OSUN', value: 'OSUN'},
  {label: 'OYO', value: 'OYO'},
  {label: 'PLATEAU', value: 'PLATEAU'},
  {label: 'RIVERS', value: 'RIVERS'},
  {label: 'SOKOTO', value: 'SOKOTO'},
  {label: 'TARABA', value: 'TARABA'},
  {label: 'YOBE', value: 'YOBE'},
  {label: 'ZAMFARA', value: 'ZAMFARA'},
];

const BookButton = props => {
  return (
    <Button
      icon={
        <Icon
          name={props.icon}
          type="material-community"
          size={20}
          color={props.selected ? '#FFFFFF' : '#555555'}
        />
      }
      title={props.title}
      buttonStyle={{
        backgroundColor: props.selected ? '#0066F5' : '#EEF3F7',
        paddingVertical: 14,
      }}
      titleStyle={[
        styles.contactButtonTitle,
        {
          color: props.selected ? '#FFFFFF' : '#555555',
        },
      ]}
      onPress={props.onPress}
    />
  );
};

const BookSelectView = props => {
  return (
    <View style={styles.careCard}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={styles.careCardInner}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <View style={styles.cardImageContainer}>
              {props.icon ? (
                <Image style={styles.imageIcon} source={props.icon} />
              ) : props.image ? (
                <FastImage
                  style={{
                    height: 65,
                    width: 65,
                    borderRadius: 100 / 2,
                  }}
                  source={{
                    uri: props.image,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <Image
                  style={styles.imageIcon}
                  source={require('../../assets/user-default.png')}
                />
              )}
            </View>
          </View>

          <View style={styles.cardText}>
            <View>
              <Text style={styles.cardHeaderText}>{props.headText}</Text>
              <Text style={styles.cardBodyText}>{props.subText}</Text>
            </View>
          </View>

          <View style={{justifyContent: 'center'}}>
            <Icon type="material-community" name="menu-down" color="#686B6F" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export const HomeVisit = () => {
  return (
    <View
      style={{
        padding: 20,
      }}>
      <Text style={{fontSize: 20, fontWeight: '700', alignSelf: 'center'}}>
        Enter Address
      </Text>
      <TextInput
        style={[styles.textInputStyleClass, {borderColor: '#1B2CC1'}]}
        underlineColorAndroid="transparent"
        placeholder={'Address(Area and Street).'}
        placeholderTextColor={'#9E9E9E'}
        numberOfLines={10}
        multiline={true}
      />
      <TextInput
        style={{
          borderColor: '#1B2CC1',
          ...styles.textInputStyleClass,
          height: 50,
        }}
        underlineColorAndroid="transparent"
        placeholder={'City/District/Town'}
        placeholderTextColor={'#9E9E9E'}
      />
      <TextInput
        style={{
          ...styles.textInputStyleClass,
          height: 50,
          borderColor: '#1B2CC1',
        }}
        underlineColorAndroid="transparent"
        placeholder={'State'}
        placeholderTextColor={'#9E9E9E'}
      />
      <Button title="Save" />
    </View>
  );
};

export default class BookAppointmentPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerLeft: <HeaderLeft navigation={navigation} />,
      headerStyle: {
        backgroundColor: '#fff',
        shadowColor: '#fff',
        elevation: 0,
        borderBottomColor: '#fff',
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        fontFamily: 'Muli-ExtraBold',
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
      },
      headerRight: <View />,
      title: 'Appointment',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      appointmentFor: '',
      consultationType: '',
      appointmentTime: '',
      appointmentDate: '',
      note: '',
      meansOfContact: '',
      isModalVisible: false,
      isModalVisible2: false,
      address: '',
      city: '',
      states: '',
      familyId: '',
      initiliazing: false,
      fetchingImage: false,
      photo: '',
      personForPhoto: '',
      picture: {
        original: null,
        thumbnail: null,
      },
    };
  }

  toggleModal = () =>
    this.setState({isModalVisible: !this.state.isModalVisible});

  onChangeUser = appointmentFor => {
    const names = appointmentFor.split(' ');

    const id = names.splice(2, 1);

    const personForPhoto = names.splice(2, 1).join('');

    const familyId = id.join();
    appointmentFor = names.join(' ');
    console.log(personForPhoto);
    this.setState({...this.state, familyId, appointmentFor, personForPhoto});
  };

  onChangeMedic = consultationType => {
    this.setState({...this.state, consultationType});
  };

  onChangeTime = appointmentTime => {
    this.setState({...this.state, appointmentTime});
  };

  onChangeDate = appointmentDate => {
    this.setState({...this.state, appointmentDate});
  };

  checkSelected = id => this.state.selectedId === id;

  render() {
    const {
      appointmentFor,
      consultationType,
      appointmentTime,
      appointmentDate,
      note,
      meansOfContact,
      address,
      city,
      states,
      familyId,
    } = this.state;

    const checkHomeInfo = address && city && states;
    const checkBookNow =
      appointmentFor &&
      consultationType &&
      appointmentTime &&
      appointmentDate &&
      meansOfContact;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'ios' ? 'padding' : ''}>
        <Mutation
          mutation={CREATE_APPOINTMENT}
          awaitRefetchQueries={true}
          refetchQueries={[
            {
              query: APPOINTMENTS,
            },
          ]}>
          {(createAppointment, {loading: isLoading, error}) => (
            <Query query={MEPOST} fetchPolicy="network-only">
              {({loading, error, data}) => {
                if (loading) return <ActivityIndicatorPage />;
                if (error) return <Text>{error}</Text>;
                const {authorization} = data.me;
                const {firstName, lastName, photo} = data.me.profile;
                const currentUserFullName = `${firstName} ${lastName}`;

                const check = appointmentFor === currentUserFullName;
                return (
                  <View>
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      style={{marginHorizontal: 15}}>
                      <View style={{paddingVertical: 10}} />
                      <BookSelectView
                        headText="Appointment for"
                        subText={this.state.appointmentFor}
                        image={this.state.personForPhoto}
                        onPress={() => {
                          this.props.navigation.navigate('AppointmentFor', {
                            onChangeUser: this.onChangeUser,
                          });
                        }}
                      />

                      <BookSelectView
                        headText="Consultant Type"
                        subText={this.state.consultationType}
                        icon={require('../../assets/booking-doctor.png')}
                        onPress={() => {
                          this.props.navigation.navigate('ConsultantType', {
                            onChangeMedic: this.onChangeMedic,
                          });
                        }}
                      />

                      <BookSelectView
                        headText="Appointment time"
                        subText={`${this.state.appointmentTime} ${this.state
                          .appointmentDate &&
                          date8(this.state.appointmentDate)}`}
                        icon={require('../../assets/booking-clock2.png')}
                        onPress={() => {
                          this.props.navigation.navigate('AppointmentTime', {
                            onChangeTime: this.onChangeTime,
                            onChangeDate: this.onChangeDate,
                          });
                        }}
                      />
                      <Text>
                        {this.state.appointmentDate &&
                          !this.state.appointmentTime && (
                            <Text style={{color: 'red'}}>
                              You selected only date, Please select appointment
                              time
                            </Text>
                          )}
                      </Text>
                      <Text>
                        {this.state.appointmentTime &&
                          !this.state.appointmentDate && (
                            <Text style={{color: 'red'}}>
                              You selected only time, Please select appointment
                              date
                            </Text>
                          )}
                      </Text>
                      {/* April 29, 2:00pm, evening */}
                      <View
                        style={{
                          marginVertical: 10,
                          paddingBottom: 20,
                          borderBottomWidth: 1,
                          borderBottomColor: '#C4C4C4',
                        }}>
                        <Text style={styles.cardHeaderText}>
                          Appointment Type
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                          <View style={{flex: 1, marginRight: 5}}>
                            <BookButton
                              icon="phone"
                              title="Voice call"
                              selected={
                                this.state.meansOfContact === 'VOICE_CALL'
                              }
                              onPress={() => {
                                this.setState({
                                  ...this.state,
                                  meansOfContact: 'VOICE_CALL',
                                  subscribeHomeVisit: false,
                                });
                              }}
                            />
                          </View>

                          <View style={{flex: 1, marginLeft: 5}}>
                            <BookButton
                              icon="video"
                              title="Video call"
                              selected={
                                this.state.meansOfContact === 'VIDEO_CALL'
                              }
                              onPress={() => {
                                this.setState({
                                  ...this.state,
                                  meansOfContact: 'VIDEO_CALL',
                                  subscribeHomeVisit: false,
                                });
                              }}
                            />
                          </View>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          {/* <View style={{flex: 1, marginRight: 5}}>
                            <BookButton
                              icon="chat"
                              title="Chat"
                              selected={this.state.meansOfContact === 'CHAT'}
                              onPress={() => {
                                this.setState({
                                  ...this.state,
                                  meansOfContact: 'CHAT',
                                  subscribeHomeVisit: false,
                                });
                              }}
                            />
                          </View> */}

                          <View style={{flex: 1, marginLeft: 5}}>
                            <BookButton
                              icon="home"
                              title="Home Visit"
                              // selected={
                              //   this.state.meansOfContact === 'HOME_VISIT' &&
                              //   this.state.subscribeHomeVisit
                              // }
                              onPress={() => {
                                // this.props.navigation.navigate('HomeVisit');
                                // this.setState({
                                //   ...this.state,
                                //   meansOfContact: 'HOME_VISIT',
                                // });
                                this.toggleModal();
                              }}
                            />
                            <Overlay
                              overlayStyle={{
                                borderColor: '#1B2CC1',
                                borderWidth: 1,
                              }}
                              onBackdropPress={() =>
                                this.setState({isModalVisible: false})
                              }
                              isVisible={this.state.isModalVisible}>
                              <View
                                style={{
                                  flex: 1,
                                  backgroundColor: '#fff',
                                  height: '70%',
                                }}>
                                <View style={{padding: 20}}>
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      fontWeight: '700',
                                      alignSelf: 'center',
                                    }}>
                                    Enter Address
                                  </Text>
                                  <TextInput
                                    style={[
                                      styles.textInputStyleClass,
                                      {borderColor: '#1B2CC1'},
                                    ]}
                                    underlineColorAndroid="transparent"
                                    placeholder={'Address(Area and Street).'}
                                    placeholderTextColor={'#979797'}
                                    numberOfLines={10}
                                    multiline={true}
                                    value={address}
                                    onChangeText={text =>
                                      this.setState({
                                        ...this.state,
                                        address: text,
                                      })
                                    }
                                  />
                                  <TextInput
                                    style={{
                                      ...styles.textInputStyleClass,
                                      height: 50,
                                      borderColor: '#1B2CC1',
                                    }}
                                    underlineColorAndroid="transparent"
                                    placeholder={'City/District/Town'}
                                    placeholderTextColor={'#979797'}
                                    value={city}
                                    onChangeText={text =>
                                      this.setState({
                                        ...this.state,
                                        city: text,
                                      })
                                    }
                                  />
                                  <View
                                    style={{
                                      ...styles.textInputStyleClass,
                                      justifyContent: 'center',
                                      borderColor: '#1B2CC1',
                                      height: 50,
                                    }}>
                                    <RNPickerSelect
                                      placeholder={{
                                        label: 'SELECT STATE',
                                        value: '',
                                      }}
                                      onValueChange={value =>
                                        this.setState({
                                          ...this.state,
                                          states: value,
                                        })
                                      }
                                      value={this.state.states}
                                      items={statesVlues}
                                      style={{...pickerStyle}}
                                    />
                                  </View>
                                  <Button
                                    title="Save"
                                    buttonStyle={[
                                      styles.buttonSolidStyle,
                                      {
                                        marginTop: 30,
                                        borderWidth: 1,
                                        borderColor: '#1B2CC1',
                                        backgroundColor: '#1B2CC1',
                                      },
                                    ]}
                                    onPress={() =>
                                      this.setState({
                                        isModalVisible: false,
                                        isModalVisible2: true,
                                      })
                                    }
                                    disabled={!checkHomeInfo}
                                  />
                                </View>
                              </View>
                            </Overlay>

                            <Overlay
                              overlayStyle={{
                                borderRadius: 10,
                              }}
                              onBackdropPress={() =>
                                this.setState({isModalVisible2: false})
                              }
                              isVisible={this.state.isModalVisible2}>
                              {/* <View
                                style={{
                                  flex: 1,
                                  backgroundColor: '#fff',
                                  height: '70%',
                                  marginBottom: 30,
                                }}>
                                {/*<View style={{padding: 20, flex: 3}}>
                                  <Text
                                    style={{
                                      fontFamily: 'Muli-Regular',
                                      fontStyle: 'normal',
                                      fontweight: 'bold',
                                      fontSize: 25,
                                      lineHeight: 38,
                                    }}>
                                    Home visit fee
                                  </Text>

                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontFamily: 'Montserrat',
                                      fontWeight: '500',
                                      marginVertical: 25,
                                    }}>
                                    N.B: You will be charged {'\u20A6'}5,000 for
                                    home visit
                                  </Text>
                                  <View
                                    style={{
                                      backgroundColor: '#1B2CC1',
                                      borderRadius: 5,
                                      marginTop: 20,
                                    }}>
                                    <View
                                      style={{
                                        width: '85%',
                                        alignSelf: 'center',
                                        justifyContent: 'space-between',
                                        marginVertical: 35,
                                        flexDirection: 'row',
                                      }}>
                                      <Text style={{color: 'white'}}>
                                        {`********${authorization &&
                                          authorization.last4}`}
                                      </Text>
                                      <Text style={{color: 'white'}}>
                                        {`Expires ${authorization &&
                                          authorization.expMonth.slice(
                                            -2,
                                          )}/${authorization &&
                                          authorization.expYear.slice(-2)}`}
                                      </Text>
                                    </View>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.setState({
                                        isModalVisible2: false,
                                      });
                                      this.props.navigation.navigate(
                                        'CardPayment',
                                      );
                                    }}>
                                    <Text
                                      style={{
                                        color: '#1B2CC1',
                                        fontSize: 12,
                                        fontWeight: '500',
                                        lineHeight: 14,
                                        alignSelf: 'flex-end',
                                        marginTop: 15,
                                      }}>
                                      Add new card
                                    </Text>
                                  </TouchableOpacity>
                                </View> 
                             

                                <View style={{flex: 1}}>
                                  <Mutation mutation={HOME_VISIT}>
                                    {initializePayment => (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.setState({initiliazing: true});
                                          initializePayment({
                                            variables: {
                                              data: {
                                                purpose: 'HOME_VISIT',
                                              },
                                            },
                                          })
                                            .then(res => {
                                              const {
                                                status,
                                              } = res.data.initializePayment;
                                              if (status !== 'FAILED') {
                                                this.setState({
                                                  isModalVisible2: false,
                                                  subscribeHomeVisit: true,
                                                  initiliazing: false,
                                                });
                                                ShowMessage(type.DONE, status);
                                                return;
                                              } else {
                                                this.setState({
                                                  isModalVisible2: false,
                                                  subscribeHomeVisit: false,
                                                  initiliazing: false,
                                                });
                                                ShowMessage(type.ERROR, status);
                                              }
                                            })
                                            .catch(err => {
                                              console.log(err);
                                              ShowMessage(type.ERROR, err);
                                              this.setState({
                                                initiliazing: false,
                                                subscribeHomeVisit: false,
                                              });
                                            });
                                        }}>
                                        <View style={styles.buttonSolidStyle}>
                                          {this.state.initiliazing ? (
                                            <ActivityIndicator
                                              size="small"
                                              color="#E5E5E5"
                                            />
                                          ) : (
                                            <Text
                                              style={
                                                styles.buttonSolidTitleStyle
                                              }>
                                              Process Payment
                                            </Text>
                                          )}
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                  </Mutation>

                                  <TouchableOpacity
                                    onPress={() =>
                                      this.setState({isModalVisible2: false})
                                    }>
                                    <View
                                      style={[
                                        styles.buttonSolidStyle,
                                        {backgroundColor: '#C11B1B'},
                                      ]}>
                                      <Text
                                        style={[styles.buttonSolidTitleStyle]}>
                                        Decline
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </View> */}
                              <HOMEVISIT
                                style={{
                                  alignSelf: 'center',
                                  marginVertical: 30,
                                }}
                              />
                              <View style={{marginHorizontal: 20}}>
                                <Text
                                  style={{
                                    fontSize: 24,
                                    lineHeight: 28,
                                    fontWeight: 'bold',
                                    color: 'black',
                                    marginBottom: 8,
                                    alignSelf: 'center',
                                  }}>
                                  Home Visit
                                </Text>
                                <Text
                                  style={{
                                    color: '#575757',
                                    fontSize: 14,
                                    lineHeight: 20,
                                    marginBottom: 10,
                                  }}>
                                  We are excited to see your interest in our
                                  "Home Visit" service but unfortunately, we are
                                  not yet in your area.{'\n'}
                                  {'\n'}You will be the first to know when we
                                  roll out this service in your area.{'\n'}
                                  {'\n'}Please, book an online appointment to
                                  see a doctor the same day, or another day, at
                                  a time that suits you.
                                </Text>

                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({
                                      isModalVisible2: false,
                                    })
                                  }>
                                  <View
                                    style={[
                                      styles.buttonSolidStyle,
                                      {
                                        width: '70%',
                                        backgroundColor: 'white',
                                      },
                                    ]}>
                                    <Text
                                      style={[styles.buttonSolidTitleStyle]}>
                                      RETURN
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </Overlay>
                          </View>
                        </View>
                      </View>

                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingEnd: 20,
                          }}>
                          <Text style={styles.cardHeaderText}>Add note</Text>
                          {this.state.fetchingImage ? (
                            <ActivityIndicator
                              color="#1B2CC1"
                              style={{height: 80, width: 80}}
                            />
                          ) : (
                            <Mutation mutation={UPLOAD}>
                              {uploadFile => (
                                <TouchableOpacity
                                  onPress={async () => {
                                    // try {
                                    //   const documents = await DocumentPicker.pickMultiple(
                                    //     {
                                    //       type: [DocumentPicker.types.allFiles],
                                    //     },
                                    //   );
                                    //   documents.map((file, index) => {
                                    //     console.log(JSON.stringify(file));
                                    //     const data = new FormData();
                                    //     data.append('files', {
                                    //       uri: file.uri,
                                    //       type: file.type,
                                    //       name:
                                    //         file.name ||
                                    //         `temp_file_${index}.${file.type}`,
                                    //     });
                                    //   });

                                    //   let myHeaders = () => {
                                    //     const fetchHeader = new Headers();
                                    //     fetchHeader.append(
                                    //       'Content-Type',
                                    //       `multipart/form-data; boundary=${data._boundary}`,
                                    //       'Accept',
                                    //       'application/x-www-form-urlencoded',
                                    //     );
                                    //     return fetchHeader;
                                    //   };
                                    //   // headers: {
                                    //   //   Accept:
                                    //   //     'application/x-www-form-urlencoded',
                                    //   //   'content-type': `multipart/form-data; boundary=${data._boundary}`,
                                    //   // },
                                    //   try {
                                    //     const res = await fetch(
                                    //       'https://api.aeglehealth.io/file-upload/upload-multiple-files',
                                    //       {
                                    //         method: 'POST',
                                    //         headers: myHeaders(),
                                    //         files: data,
                                    //       },
                                    //     );
                                    //     console.log(res, 'res');
                                    //     const data = await res.json();
                                    //     return console.log(data);
                                    //   } catch (err) {
                                    //     return console.log(err);
                                    //   }

                                    //   // try {
                                    //   //   const res = await axios(
                                    //   //     'https://api.aeglehealth.io/file-upload/upload-multiple-files',
                                    //   //     {
                                    //   //       method: 'POST',
                                    //   //       headers: myHeaders(),
                                    //   //       files: data,
                                    //   //     },
                                    //   //   );
                                    //   //   return console.log(res);
                                    //   // } catch (err) {
                                    //   //   return console.log(err);
                                    //   // }

                                    //   // .then(res => {
                                    //   //   console.log(res);
                                    //   //   return res.json();
                                    //   // })
                                    //   // .then(res => console.log(res, 'reee'))
                                    //   // .catch(err => {
                                    //   //   console.log(err, 'error uploading');
                                    //   // });
                                    // } catch (err) {
                                    //   if (DocumentPicker.isCancel(err)) {
                                    //     // User cancelled the picker, exit any dialogs or menus and move on
                                    //   } else {
                                    //     throw err;
                                    //   }
                                    // }
                                    const options = {
                                      noData: true,
                                      rotation: 360,
                                    };

                                    ImagePicker.showImagePicker(
                                      options,
                                      response => {
                                        if (response.uri) {
                                          const {
                                            uri,
                                            type,
                                            fileName,
                                          } = response;
                                          this.setState({
                                            fetchingImage: true,
                                            photo: uri,
                                          });
                                          const fileUrl = new ReactNativeFile({
                                            uri,
                                            type: type || 'image/jpg',
                                            name: fileName || 'profile picture',
                                          });

                                          uploadFile({
                                            variables: {
                                              file: fileUrl,
                                            },
                                          })
                                            .then(res => {
                                              if (res) {
                                                console.log(res);
                                                const {
                                                  original,
                                                  thumbnail,
                                                } = res.data.uploadFile;
                                                const {picture} = {
                                                  ...this.state,
                                                };
                                                const pictureObj = picture;
                                                pictureObj.original = original;
                                                pictureObj.thumbnail = thumbnail;
                                                this.setState({
                                                  picture: pictureObj,
                                                  fetchingImage: false,
                                                });
                                              }
                                            })
                                            .catch(err => {
                                              console.log(err, 'erthj');
                                              this.setState({
                                                fetchingImage: false,
                                              });
                                              return err;
                                            });
                                        }
                                      },
                                    );
                                  }}>
                                  {!this.state.photo && (
                                    <Icon
                                      type="material-community"
                                      name="attachment"
                                      color="#686B6F"
                                    />
                                  )}
                                </TouchableOpacity>
                              )}
                            </Mutation>
                          )}
                        </View>

                        {this.state.photo ? (
                          <FastImage
                            style={{
                              height: 500,
                              width: '100%',
                              marginVertical: 5,
                            }}
                            source={{
                              uri: this.state.photo,
                              priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        ) : (
                          <TextInput
                            style={{...styles.input, marginVertical: 15}}
                            multiline
                            value={this.state.note}
                            placeholder="To help us give you the best care, you'll need to tell us your reason for booking an appointment. This could be a symptom or condition, or any reason like you need to review your blood test results or medications. You can also add a photo if there's something you want to show the doctor."
                            onChangeText={text => this.setState({note: text})}
                          />
                        )}
                      </View>
                      <View style={{marginBottom: 40}}>
                        <Button
                          type="solid"
                          title="BOOK NOW"
                          buttonStyle={styles.buttonSolidStyle}
                          titleStyle={styles.buttonSolidTitleStyle}
                          onPress={() => {
                            const attachments = [];
                            this.state.picture.original &&
                              attachments.push(this.state.picture.original);

                            const data = {
                              consultationType: consultationType.toLocaleUpperCase(),
                              time: appointmentTime,
                              date: appointmentDate,
                              meansOfContact: meansOfContact,
                              homeVisit: {
                                address: address ? address : 'LAGOS',
                                city: '',
                                state: states || 'LAGOS',
                              },
                              additionalNotes: note,
                              familyId: check ? '' : familyId,
                              belongsTo: check ? 'USER' : 'FAMILY_MEMBER',
                              attachments,
                            };

                            console.log(data, 'dattt');

                            createAppointment({
                              variables: {data},
                            })
                              .then(res => {
                                this.props.navigation.navigate(
                                  'CompletedAction',
                                  {
                                    title: 'Booked!',
                                    subTitle:
                                      'Voila! You have successfully booked an appointment',
                                    onCompleted: () => {
                                      this.props.navigation.navigate('Home');
                                    },
                                  },
                                );
                              })
                              .catch(err => {
                                ShowMessage(
                                  type.ERROR,
                                  err.toString().split(':')[2],
                                );
                                console.log(err, 'error');
                              });
                          }}
                          loading={isLoading}
                          disabled={!checkBookNow || isLoading}
                        />
                      </View>
                    </ScrollView>
                  </View>
                );
              }}
            </Query>
          )}
        </Mutation>
      </KeyboardAvoidingView>
    );
  }
}
