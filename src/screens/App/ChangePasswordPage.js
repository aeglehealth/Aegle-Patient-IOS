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
import {CHANGE_PASSWORD} from '../../QueryAndMutation';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
import {HeaderLeft} from '../../Components/HeaderLeft';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 30,
    marginBottom: 55,
  },
  buttonStyle: {
    backgroundColor: '#1B2CC1',
    marginBottom: 20,
    paddingVertical: 15,
  },
  buttonTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Muli-Bold',
    alignSelf: 'center',
  },
  inputView: {
    marginVertical: 5,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class ChangePasswordPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    current_password: '',
    new_password: '',
    confirm_password: '',
    hidePassword: true,
    loading: false,
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView keyboardVerticalOffset={180}>
          <View>
            <Text style={styles.headerText}>Change password</Text>
          </View>
          <View style={styles.inputView}>
            <CustomIconInput
              label="Current Password"
              leftFocusIcon="lock"
              isFloatingLabel={false}
              rightIcon={this.state.hidePasswordIcon}
              isPassword={this.state.hidePassword}
              onRightIconPress={this.togglePasswordVisibility}
              value={this.state.current_password}
              onChangeText={text => {
                this.setState({
                  current_password: text,
                });
              }}
            />
          </View>
          <View style={styles.inputView}>
            <CustomIconInput
              label="New Password"
              leftFocusIcon="lock"
              isFloatingLabel={false}
              rightIcon={this.state.hidePasswordIcon}
              isPassword={this.state.hidePassword}
              onRightIconPress={this.togglePasswordVisibility}
              value={this.state.new_password}
              onChangeText={text => {
                this.setState({
                  new_password: text,
                });
              }}
            />
          </View>
          <View style={styles.inputView}>
            <CustomIconInput
              label="Confirm Password"
              leftFocusIcon="lock"
              isFloatingLabel={false}
              rightIcon={this.state.hidePasswordIcon}
              isPassword={this.state.hidePassword}
              onRightIconPress={this.togglePasswordVisibility}
              value={this.state.confirm_password}
              onChangeText={text => {
                this.setState({
                  confirm_password: text,
                });
              }}
            />
          </View>
          <View style={{marginTop: 40}}>
            <Mutation mutation={CHANGE_PASSWORD}>
              {changePassword => (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({loading: true});

                    if (
                      this.state.new_password !== this.state.confirm_password ||
                      !this.state.new_password
                    ) {
                      this.setState({loading: false});
                      ShowMessage(
                        type.ERROR,
                        'Please enter or match passwords!',
                      );
                      return;
                    }

                    changePassword({
                      variables: {
                        newPassword: this.state.new_password,
                        oldPassword: this.state.current_password,
                      },
                    })
                      .then(res => {
                        if (res) {
                          this.setState({loading: false});
                          ShowMessage(
                            type.DONE,
                            'Password Successfully Changed!',
                          );
                        }
                      })
                      .catch(err => {
                        this.setState({loading: false});
                        ShowMessage(type.ERROR, err);
                        return err;
                      });
                  }}>
                  <View style={styles.buttonStyle}>
                    {this.state.loading ? (
                      <ActivityIndicator size="small" color="#E5E5E5" />
                    ) : (
                      <Text style={styles.buttonTitleStyle}>SAVE</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            </Mutation>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
