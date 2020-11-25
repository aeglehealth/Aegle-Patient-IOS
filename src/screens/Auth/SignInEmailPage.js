import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as yup from 'yup';
import {Formik} from 'formik';
import {Mutation} from 'react-apollo';
import {LOGIN} from '../../QueryAndMutation';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {FIRST_NAME, AUTH_TOKEN} from 'react-native-dotenv';

export default class Login extends React.Component {
  state = {
    loading: false,
    showPassword: true,
    navigate: false,
    email: '',
    password: '',
    firstName: '',
  };

  toggleSwitch = () => {
    this.setState(prevState => {
      return {
        showPassword: !prevState.showPassword,
      };
    });
  };

  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {
        backgroundColor: '#fff',
        shadowColor: '#fff',
        elevation: 0,
        borderBottomColor: '#fff',
        shadowOpacity: 0,
      },
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  async componentDidMount() {
    const firstName = await AsyncStorage.getItem(FIRST_NAME);
    this.setState({firstName});
  }

  async componentWillUnmount() {
    await AsyncStorage.removeItem(FIRST_NAME);
  }

  render() {
    const {firstName} = this.state;
    const welcomeText = firstName ? `, ${firstName}` : '';
    const validationSchema = yup.object().shape({
      email: yup.string().required(),
      password: yup.string().required(),
    });
    const {loading} = this.state;
    return (
      <Mutation
        mutation={LOGIN}
        onError={console.warn}
        onCompleted={console.warn}>
        {login => (
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={values => {
              this.setState({loading: true});
              login({
                variables: {
                  email: values.email.toLowerCase().trim(),
                  password: values.password.trim(),
                },
              })
                .then(async res => {
                  const token = res.data.login.token;
                  await AsyncStorage.setItem(AUTH_TOKEN, token);
                  this.setState({loading: false});
                  this.props.navigation.navigate('Home');
                })
                .catch(err => {
                  this.setState({loading: false});
                  return err;
                });
            }}
            validationSchema={validationSchema}>
            {({
              values,
              handleChange,
              errors,
              touched,
              handleBlur,
              handleSubmit,
            }) => (
              <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#fff'}}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{flexGrow: 1}}
                  keyboardShouldPersistTaps={'handled'}>
                  <View style={styles.container}>
                    <Text
                      style={styles.head}>{`Welcome back${welcomeText}`}</Text>
                    <View
                      style={{
                        flex: 1,
                        marginTop: 65,
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                      }}>
                      <View>
                        <View style={styles.emailBar}>
                          {values.email ? (
                            <FontAwesome
                              name="envelope"
                              color="#A7A6A6"
                              size={20}
                            />
                          ) : (
                            <FontAwesome
                              name="envelope-o"
                              color="#A7A6A6"
                              size={20}
                            />
                          )}
                          <TextInput
                            keyboardType="email-address"
                            style={styles.input}
                            placeholderTextColor="rgba(0, 0, 0, 0.7)"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            placeholder="Email"
                            name="email"
                            keyboardType="email-address"
                          />
                        </View>
                        {touched.email && errors.email && (
                          <Text style={{fontSize: 10, color: 'red'}}>
                            {errors.email}
                          </Text>
                        )}
                        <View style={styles.passwordMenu}>
                          <View
                            style={{
                              alignItems: 'center',
                              flexDirection: 'row',
                              paddingBottom: -10,
                            }}>
                            {values.password ? (
                              <FontAwesome
                                name="lock"
                                color="#A7A6A6"
                                size={20}
                              />
                            ) : (
                              <AntDesign
                                name="lock"
                                color="#A7A6A6"
                                size={20}
                              />
                            )}
                            <TextInput
                              style={styles.input1}
                              placeholderTextColor="rgba(0, 0, 0, 0.7)"
                              value={values.password}
                              onChangeText={handleChange('password')}
                              onBlur={handleBlur('password')}
                              placeholder="Password"
                              name="password"
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
                                <FontAwesome
                                  name="eye"
                                  size={20}
                                  color="#000000"
                                />
                              )}
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                        {touched.password && errors.password && (
                          <Text style={{fontSize: 10, color: 'red'}}>
                            {errors.password}
                          </Text>
                        )}
                      </View>
                      <View style={{marginTop: 85}}>
                        <TouchableOpacity
                          onPress={handleSubmit}
                          disabled={this.state.loading}>
                          <View style={styles.signupbox}>
                            {loading ? (
                              <ActivityIndicator size="small" color="white" />
                            ) : (
                              <Text
                                style={styles.signuptext}
                                onPress={handleSubmit}>
                                SIGN IN
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('ForgotPassword')
                          }>
                          <View style={{alignSelf: 'center', marginTop: '10%'}}>
                            <Text style={styles.sign}>Forgot password?</Text>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.alreadyhaveanaccount}>
                          <Text style={styles.opacity}>
                            Don't have an aegle account?
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('SignUpEmail')
                            }>
                            <View>
                              <Text style={styles.sign}>Sign up</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            )}
          </Formik>
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
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
    fontStyle: 'normal',
  },
  emailBar: {
    marginTop: 25,
    width: '100%',
    borderBottomWidth: 0.7,
    borderBottomColor: 'rgba(0, 0, 0, 0.7)',
    paddingBottom: -10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: 'rgba(0, 0, 0, 0.7)',
    marginLeft: 14,
    width: '70%',
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
    fontStyle: 'normal',
  },
  head: {
    color: '#1D1C1C',
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 30,
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    lineHeight: 38,
  },
  subText: {
    color: 'yellow',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Muli-Regular' : 'Proxima Nova',
    lineHeight: 12,
    color: '#828282',
  },
  sign: {
    color: '#1B2CC1',
    fontSize: 16,
    lineHeight: 20,
    paddingLeft: 5,
    fontWeight: 'normal',
    fontFamily: 'Muli-Regular',
  },
  signupbox: {
    backgroundColor: '#1B2CC1',
    height: 48,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  signuptext: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Muli-Regular' : 'Montserrat',
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
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 14,
  },
});
