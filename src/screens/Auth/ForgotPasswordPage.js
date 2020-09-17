/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import CustomIconInput from '../../Components/CustomIconInput';
import {Mutation} from 'react-apollo';
import {SEND_RESET_MAIL} from '../../QueryAndMutation';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
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
    marginBottom: 20,
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
    email: '',
    loading: false,
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={180}>
          <View>
            <Text style={styles.headerText}>Forgot password?</Text>
            <Text style={styles.bodyText}>
              Please enter your Email to help us identify you
            </Text>
          </View>
          <View style={styles.inputView}>
            <CustomIconInput
              label="Email"
              leftBlurIcon="email-outline"
              leftFocusIcon="email"
              isFloatingLabel={false}
              value={this.state.email}
              onChangeText={text => {
                this.setState({
                  email: text,
                });
              }}
            />
          </View>

          <Mutation mutation={SEND_RESET_MAIL}>
            {sendResetEmail => (
              <TouchableOpacity
                disabled={this.state.loading}
                onPress={() => {
                  if (!this.state.email) {
                    return;
                  }

                  this.setState({loading: true});

                  sendResetEmail({
                    variables: {
                      email: this.state.email.toLowerCase(),
                    },
                  })
                    .then(res => {
                      console.log(sendResetEmail, 'res');
                      if (res) {
                        this.setState({loading: false});
                        ShowMessage(
                          type.DONE,
                          'The password reset link has been sent to your email',
                        );
                        const {sendResetEmail} = res.data;
                        // setTimeout(() => {
                        //   this.setState({loading: false});
                        //   this.props.navigation.navigate('ForgotPassword2', {
                        //     sendResetEmail,
                        //   });
                        // }, 3000);
                      }
                    })
                    .catch(err => {
                      this.setState({loading: false});
                      ShowMessage(type.ERROR, err);
                    });
                }}>
                <View style={styles.buttonSolidStyle}>
                  {this.state.loading ? (
                    <ActivityIndicator size="small" color="#E5E5E5" />
                  ) : (
                    <Text style={styles.buttonSolidTitleStyle}>SEND LINK</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </Mutation>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
