/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {Mutation} from 'react-apollo';
import {FORGOT_PASSWORD} from '../../QueryAndMutation';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Formik} from 'formik';
import {HeaderLeft} from '../../Components/HeaderLeft';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: 'center',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    borderRadius: 5,
    // marginBottom: 20,
    marginTop: 30,
    paddingVertical: 15,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    alignSelf: 'center',
  },
  bodyText: {
    fontSize: 14,
    marginHorizontal: 5,
    marginVertical: 5,
    color: '#828282',
  },
  inputView: {
    marginTop: 20,
  },
  passwordMenu: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 0.7,
    borderColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    marginTop: 35,
  },
  input1: {
    width: '70%',
    color: 'rgba(0, 0, 0, 0.7)',
    marginLeft: 14,
  },
});

export default class ForgotPasswordPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {
        backgroundColor: '#fff',
        shadowColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomColor: '#fff',
      },
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    loading: false,
    showPassword: true,
    showPassword2: true,
  };

  toggleSwitch = () => {
    this.setState(prevState => {
      return {
        showPassword: !prevState.showPassword,
      };
    });
  };

  toggleSwitch2 = () => {
    this.setState(prevState => {
      return {
        showPassword2: !prevState.showPassword2,
      };
    });
  };

  render() {
    return (
      <Mutation
        mutation={FORGOT_PASSWORD}
        onError={console.warn}
        onCompleted={console.warn}>
        {resetPassword => (
          <View style={styles.container}>
            <Formik
              initialValues={{
                new_password: '',
                confirm_password: '',
              }}
              onSubmit={values => {
                this.setState({loading: true});

                if (
                  values.new_password !== values.confirm_password ||
                  !values.new_password
                ) {
                  ShowMessage(type.ERROR, 'Please enter or match passwords!');
                  this.setState({loading: false});
                  return;
                }

                resetPassword({
                  variables: {
                    token: this.props.navigation.state.params.sendResetEmail,
                    password: values.new_password,
                  },
                })
                  .then(res => {
                    if (res) {
                      ShowMessage(type.DONE, 'Password has been reset!');
                      setTimeout(() => {
                        this.setState({loading: false});
                        this.props.navigation.navigate('SignInEmail');
                      }, 3000);
                    }
                  })
                  .catch(err => {
                    ShowMessage(type.ERROR, err);
                    this.setState({loading: false});
                  });
              }}>
              {({
                values,
                handleChange,
                errors,
                setFieldValue,
                setFieldTouched,
                touched,
                isValid,
                handleBlur,
                handleSubmit,
              }) => (
                <KeyboardAvoidingView
                  behavior="padding"
                  keyboardVerticalOffset={230}>
                  <View>
                    <Text style={styles.headerText}>Reset password</Text>
                    <Text style={styles.bodyText}>
                      Please enter your new password
                    </Text>
                  </View>

                  <View style={styles.passwordMenu}>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingBottom: -10,
                      }}>
                      {values.new_password ? (
                        <FontAwesome name="lock" color="#A7A6A6" size={20} />
                      ) : (
                        <AntDesign name="lock" color="#A7A6A6" size={20} />
                      )}
                      <TextInput
                        style={styles.input1}
                        placeholderTextColor="rgba(0, 0, 0, 0.7)"
                        value={values.new_password}
                        onChangeText={handleChange('new_password')}
                        onBlur={handleBlur('new_password')}
                        placeholder="New Password"
                        name="new_password"
                        secureTextEntry={this.state.showPassword}
                      />
                    </View>
                    <TouchableWithoutFeedback onPress={this.toggleSwitch}>
                      <View>
                        {this.state.showPassword === true ? (
                          <FontAwesome
                            name="eye-slash"
                            size={20}
                            color="#000000"
                          />
                        ) : (
                          <FontAwesome name="eye" size={20} color="#000000" />
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                  <View style={styles.passwordMenu}>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingBottom: -10,
                      }}>
                      {values.confirm_password ? (
                        <FontAwesome name="lock" color="#A7A6A6" size={20} />
                      ) : (
                        <AntDesign name="lock" color="#A7A6A6" size={20} />
                      )}
                      <TextInput
                        style={styles.input1}
                        placeholderTextColor="rgba(0, 0, 0, 0.7)"
                        value={values.confirm_password}
                        onChangeText={handleChange('confirm_password')}
                        onBlur={handleBlur('confirm_password')}
                        placeholder="Confirm Password"
                        name="confirm_password"
                        secureTextEntry={this.state.showPassword2}
                      />
                    </View>
                    <TouchableWithoutFeedback onPress={this.toggleSwitch2}>
                      <View>
                        {this.state.showPassword2 === true ? (
                          <FontAwesome
                            name="eye-slash"
                            size={20}
                            color="#000000"
                          />
                        ) : (
                          <FontAwesome name="eye" size={20} color="#000000" />
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                  <View style={{marginTop: 40}}>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={this.state.loading}>
                      <View style={styles.buttonSolidStyle}>
                        {this.state.loading ? (
                          <ActivityIndicator size="small" color="#E5E5E5" />
                        ) : (
                          <Text style={styles.buttonSolidTitleStyle}>SAVE</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              )}
            </Formik>
          </View>
        )}
      </Mutation>
    );
  }
}
