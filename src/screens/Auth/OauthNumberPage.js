import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import {Icon} from 'react-native-elements';
import {Mutation} from 'react-apollo';
import {PHONENUMBER_VERIFICATION, UPDATE_PROFILE} from '../../QueryAndMutation';
import AsyncStorage from '@react-native-community/async-storage';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {EMAIL, FIRST_NAME} from 'react-native-dotenv';
import PhoneInput from 'react-native-phone-number-input';
import {debounce} from 'throttle-debounce';

export default class OauthPhone extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      loading: false,
      valid: false,
      ShowMessage: false,
      formattedValue: '',
      value: '',
      country: 'NG',
    };
    this.validNumber = debounce(1000, this.checkValidNumber);
  }

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.formattedValue != this.state.formattedValue) {
      this.setState({showMessage: false});
    }
  }

  handleTextChange = value => {
    this.setState({value}, () => this.validNumber(this.state.value));
  };

  checkValidNumber = value => {
    const valid = this.myRef.current?.isValidNumber(value);
    this.setState({showMessage: true});
    this.setState({valid: valid ? valid : false});
  };

  numberFormatter = () => {
    const {formattedValue, country} = this.state;
    const arr = [...formattedValue];
    if (arr[4] == 0 && country == 'NG') {
      arr.splice(4, 1);
      return arr.join('');
    }
    return formattedValue;
  };

  render() {
    const validationSchema = yup.object().shape({
      phone: yup.string().required(),
    });
    const route = this.props.navigation.state.params.route;
    return (
      <Mutation
        mutation={UPDATE_PROFILE}
        onError={console.warn}
        onCompleted={console.warn}>
        {updateUser => (
          <Mutation
            mutation={PHONENUMBER_VERIFICATION}
            onError={console.warn}
            onCompleted={console.warn}>
            {sendPhoneVerification => (
              <Formik
                initialValues={{
                  phone: '',
                }}
                onSubmit={values => {
                  this.setState({loading: true});
                  updateUser({
                    variables: {
                      phoneNumber: this.numberFormatter(),
                    },
                  })
                    .then(async res => {
                      if (res.data.updateUser) {
                        const {
                          provider,
                          profile: {firstName},
                        } = res.data.updateUser;
                        const googleEmail =
                          res.data.updateUser.google &&
                          res.data.updateUser.google.email;
                        const facebookEmail =
                          res.data.updateUser.facebook &&
                          res.data.updateUser.facebook.email;
                        const aegleEmail =
                          res.data.updateUser.local &&
                          res.data.updateUser.local.email;
                        const email =
                          provider === 'GOOGLE'
                            ? googleEmail
                            : provider === 'AEGLE'
                            ? aegleEmail
                            : facebookEmail;
                        await AsyncStorage.setItem(
                          FIRST_NAME,
                          firstName.charAt(0).toUpperCase() +
                            firstName.toLowerCase().substring(1),
                        );
                        await AsyncStorage.setItem(EMAIL, email);
                        sendPhoneVerification()
                          .then(res => {
                            const {
                              code,
                              message,
                            } = res.data.sendPhoneVerification;
                            if (code == 'OK') {
                              ShowMessage(type.DONE, message);
                              setTimeout(() => {
                                this.setState({loading: false});
                                this.props.navigation.navigate(
                                  'SignUpNumberVerification',
                                  {
                                    phone: values.phone,
                                    route,
                                  },
                                );
                              }, 3000);
                            } else {
                              ShowMessage(
                                type.ERROR,
                                'Please enter a valid phone number',
                              );
                              this.setState({loading: false});
                              return;
                            }
                          })
                          .catch(err => {
                            this.setState({loading: false});
                            ShowMessage(type.ERROR, err);
                            console.log(err);
                            return err;
                          });
                      }
                    })
                    .catch(err => {
                      this.setState({loading: false});
                      ShowMessage(type.ERROR, err);
                      console.log(err);
                      return err;
                    });
                }}
                // validationSchema={validationSchema}
              >
                {({
                  values,
                  handleChange,
                  errors,
                  touched,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <KeyboardAvoidingView
                    style={{flex: 1, backgroundColor: '#fff'}}>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{flexGrow: 1}}
                      keyboardShouldPersistTaps={'handled'}>
                      <View style={styles.container}>
                        <View>
                          <View style={{marginRight: 60, width: 295}}>
                            <Text style={styles.head}>
                              What's your phone no?
                            </Text>
                            <Text style={styles.subText}>
                              We sometimes share updates on your account, our
                              new features, announcements and more
                            </Text>
                          </View>
                          <View
                            style={{
                              marginTop: 57,
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                borderBottomWidth: 0.5,
                                borderBottomColor: '#B4B4B4',
                                alignItems: 'center',
                              }}>
                              {/* {values.phone ? (
                              <FontAwesome
                                name="phone"
                                color="#A7A6A6"
                                size={20}
                              />
                            ) : (
                              <Feather
                                name="phone"
                                color="#A7A6A6"
                                size={20}
                              />
                            )} */}
                              <PhoneInput
                                ref={this.myRef}
                                defaultValue={this.state.value}
                                defaultCode={this.state.country}
                                onChangeText={text =>
                                  this.handleTextChange(text)
                                }
                                onChangeFormattedText={text => {
                                  this.setState({formattedValue: text});
                                }}
                                name="valid"
                                autoFocus
                                containerStyle={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                                textContainerStyle={{
                                  backgroundColor: 'white',
                                }}
                              />
                              {this.state.showMessage ? (
                                this.state.valid && this.state.value != '' ? (
                                  <>
                                    <Icon
                                      name="check-circle"
                                      type="font-awesome-5"
                                      color="green"
                                    />
                                  </>
                                ) : (
                                  <Icon
                                    name="x-circle"
                                    type="feather"
                                    color="red"
                                  />
                                )
                              ) : (
                                <Text>{''}</Text>
                              )}
                              {/* <TextInput
                              style={styles.input}
                              placeholderTextColor="#B4B4B4"
                              value={values.phone}
                              onChangeText={handleChange('phone')}
                              onBlur={handleBlur('phone')}
                              placeholder="Phone number"
                              name="phone"
                              keyboardType="number-pad"
                              maxLength={11}
                            /> */}
                            </View>
                            {touched.phone && errors.phone && (
                              <Text style={{fontSize: 10, color: 'red'}}>
                                {errors.phone}
                              </Text>
                            )}
                            <View style={styles.circle}>
                              <View style={styles.circle2}></View>
                              <View style={styles.circle2}></View>
                              <View style={styles.circle2}></View>
                              <View style={styles.circle1}></View>
                            </View>
                            <TouchableOpacity
                              onPress={handleSubmit}
                              disabled={
                                this.state.loading || !this.state.valid
                              }>
                              <View
                                style={
                                  !this.state.valid
                                    ? styles.signupboxDisabled
                                    : styles.signupbox
                                }>
                                {this.state.loading ? (
                                  <ActivityIndicator color="#E5E5E5" />
                                ) : (
                                  <Text style={styles.signuptext}>SUBMIT</Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  </KeyboardAvoidingView>
                )}
              </Formik>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '85%',
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  phoneMenu: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: 'white',
    alignItems: 'center',
    marginTop: 35,
  },
  input1: {
    width: '70%',
    color: 'white',
  },
  input: {
    width: '50%',
    color: '#1D1C1C',
    marginLeft: 14,
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
    fontStyle: 'normal',
  },
  head: {
    color: '#1D1C1C',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 8,
  },
  subText: {
    color: 'yellow',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Muli-Regular' : 'Proxima Nova',
    lineHeight: 12,
    color: '#828282',
  },
  signupbox: {
    backgroundColor: '#1B2CC1',
    height: 48,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 56.9,
    marginBottom: 39,
  },
  signupboxDisabled: {
    backgroundColor: '#cccccc',
    height: 48,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 56.9,
    marginBottom: 39,
  },
  signuptext: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Muli-Regular' : 'Proxima Nova',
    alignSelf: 'center',
  },
  alreadyhaveanaccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  opacity: {
    textAlign: 'center',
    color: 'yellow',
    fontSize: 14,
  },
  circle: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 91,
  },
  circle1: {
    flexDirection: 'row',
    backgroundColor: '#1B2CC1',
    borderRadius: 100,
    width: 9.9,
    height: 9.9,
    borderColor: '#1B2CC1',
    margin: 6,
  },
  circle2: {
    flexDirection: 'row',
    borderRadius: 100,
    width: 9.9,
    height: 9.9,
    borderWidth: 1,
    borderColor: '#1B2CC1',
    margin: 6,
  },
  footer: {
    backgroundColor: '#060606',
    alignSelf: 'center',
    width: 134,
    height: 5,
    marginBottom: 9,
    borderRadius: 100,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});
