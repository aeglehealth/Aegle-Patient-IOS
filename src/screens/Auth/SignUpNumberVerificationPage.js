import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import {Mutation} from 'react-apollo';
import {
  CODE_VERIFICATION,
  PHONENUMBER_VERIFICATION,
} from '../../QueryAndMutation';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';

export default class Verify extends React.Component {
  state = {
    loading: false,
    loading1: false,
    showPassword: true,
    value: '',
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
    console.log(this.state.value);
  };

  static navigationOptions = {headerShown: false};

  render() {
    const item = this.props.navigation.state.params;
    return (
      <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.container}>
            <View>
              <View style={{marginRight: 60, width: 295}}>
                <Text style={styles.head}>Let's verify your number</Text>
                <Text style={styles.subText}>
                  Please enter the 5 digit code sent to{'\u00a0'}
                  {item ? item.phone : 'phone'}
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
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <CodeInput
                    ref="codeInputRef1"
                    inputPosition="full-width"
                    borderType="underline"
                    codeLength={5}
                    size={50}
                    space={5}
                    keyboardType="number-pad"
                    autoFocus={false}
                    onFulfill={code => {
                      this.setState({value: code});
                    }}
                    codeInputStyle={{fontWeight: '800', fontSize: 30}}
                    containerStyle={{alignItems: 'center', paddingBottom: 150}}
                    cellBorderWidth={1}
                    className="border-b"
                    inactiveColor="#B4B4B4"
                    activeColor="#000"
                  />
                </View>
                <View>
                  <Mutation
                    mutation={CODE_VERIFICATION}
                    onError={console.warn}
                    onCompleted={console.warn}>
                    {verifyCode => (
                      <TouchableOpacity
                        disabled={this.state.loading1 || this.state.loading}
                        onPress={() => {
                          if (this.state.value) {
                            this.setState({loading: true});
                            verifyCode({
                              variables: {
                                code: this.state.value,
                              },
                            })
                              .then(res => {
                                const {code, message} = res.data.verifyCode;
                                if (res && code == 'OK') {
                                  ShowMessage(type.DONE, message);
                                  setTimeout(() => {
                                    this.setState({loading: false});
                                    this.props.navigation.navigate(
                                      item.route === 'auth' ? 'Terms' : 'Home',
                                    );
                                  }, 3000);
                                } else {
                                  ShowMessage(
                                    type.ERROR,
                                    'Verification code is incorrect!',
                                  );
                                  this.setState({loading: false});
                                  return;
                                }
                              })
                              .catch(err => {
                                this.setState({loading: false});
                                ShowMessage(
                                  type.ERROR,
                                  'Verification code is incorrect!',
                                );
                                console.log(err);
                                return err;
                              });
                          }
                        }}>
                        <View style={styles.signupbox}>
                          {this.state.loading ? (
                            <ActivityIndicator color="#E5E5E5" />
                          ) : (
                            <Text style={styles.signuptext}>FINISH</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                  </Mutation>
                  <Mutation
                    mutation={PHONENUMBER_VERIFICATION}
                    onError={console.warn}
                    onCompleted={console.warn}>
                    {sendPhoneVerification => (
                      <TouchableOpacity
                        disabled={this.state.loading1 || this.state.loading}
                        onPress={() => {
                          this.setState({loading1: true});
                          setTimeout(() => {
                            sendPhoneVerification()
                              .then(res => {
                                const {
                                  code,
                                  message,
                                } = res.data.sendPhoneVerification;
                                if (code == 'OK') {
                                  ShowMessage(type.DONE, message);
                                  this.setState({loading1: false});
                                  return;
                                } else {
                                  ShowMessage(
                                    type.ERROR,
                                    'Please enter a valid phone number',
                                  );
                                  this.setState({loading1: false});
                                  return;
                                }
                              })
                              .catch(err => {
                                this.setState({loading1: false});
                                ShowMessage(type.ERROR, err);
                                console.log(err);
                                return err;
                              });
                          }, 20000);
                        }}>
                        <View style={styles.signbox}>
                          {this.state.loading1 ? (
                            <ActivityIndicator color="#E5E5E5" />
                          ) : (
                            <Text style={styles.signtext}>
                              RESEND OTP IN 30 SECS
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                  </Mutation>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  imageBackgroundStyle: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '85%',
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  passwordMenu: {
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
    color: '#1D1C1C',
    marginLeft: 14,
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
  signbox: {
    height: 48,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    borderColor: '#1B2CC1',
    borderWidth: 0.7,
  },
  signtext: {
    color: '#1B2CC1',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Muli-Regular' : 'Proxima Nova',
    alignSelf: 'center',
  },
});
