/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import CustomIconInput from '../../Components/CustomIconInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingEnd: 10,
    justifyContent: 'flex-start',
  },
  bodyText: {
    color: '#777',
    fontFamily: 'muli-regular',
    fontSize: 12,
    marginBottom: 30,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 24,
    marginBottom: 5,
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'muli-bold',
  },
  wrapper: {
    marginTop: 20,
  },
  slides: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class MembershipPage extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      userInput: {
        email: '',
        phone: '',
        first_name: '',
        last_name: '',
        password: '',
      },
      viewIndex: 0,
      hidePassword: true,
      hidePasswordIcon: 'eye',
    };
    this.swiper = null;
    this.nextView = this.nextView.bind(this);
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
  }

  togglePasswordVisibility() {
    const {hidePassword} = this.state;
    this.setState({
      hidePassword: !hidePassword,
      hidePasswordIcon: hidePassword ? 'eye-off' : 'eye',
    });
  }

  nextView() {
    const {viewIndex} = this.state;
    if (viewIndex === 3) {
      this.props.navigation.navigate('SignUpNumberVerification');
    } else {
      this.setState({viewIndex: viewIndex + 1});
      this.swiper.scrollBy(1);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Swiper
          ref={swiper => {
            this.swiper = swiper;
          }}
          style={styles.wrapper}
          showsButtons={false}
          showsHorizontalScrollIndicator
          loop={false}
          scrollEnabled={false}
          removeClippedSubviews={false}>
          <View style={styles.slides}>
            <Text style={styles.headerText}>What&apos;s your email?</Text>
            <Text style={styles.bodyText}>
              We need your email to look up your account or create a new one
            </Text>
            <CustomIconInput
              label="Email"
              leftBlurIcon="email-outline"
              leftFocusIcon="email"
              isFloatingLabel
              onChangeText={text => {
                const {userInput} = this.state;
                this.setState({
                  user: {...userInput, email: text},
                });
              }}
            />
          </View>

          <View style={styles.slides}>
            <Text style={styles.headerText}>What&apos;s your name?</Text>
            <Text style={styles.bodyText}>
              Please provide your first and last name to continue
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'stretch',
              }}>
              <View style={{flex: 1}}>
                <CustomIconInput
                  label="First name"
                  leftBlurIcon="account-outline"
                  leftFocusIcon="account"
                />
              </View>
              <View style={{flex: 1}}>
                <CustomIconInput
                  label="Last name"
                  leftBlurIcon="account-outline"
                  leftFocusIcon="account"
                />
              </View>
            </View>
          </View>

          <View style={styles.slides}>
            <Text style={styles.headerText}>Choose a password</Text>
            <Text style={styles.bodyText}>
              Use at least 8 characters including a number, an uppercase and a
              lowercase letter
            </Text>
            <CustomIconInput
              label="Password"
              leftBlurIcon="lock-outline"
              leftFocusIcon="lock"
              rightIcon={this.state.hidePasswordIcon}
              isPassword={this.state.hidePassword}
              onRightIconPress={this.togglePasswordVisibility}
            />
          </View>

          <View style={styles.slides}>
            <Text style={styles.headerText}>What&apos;s your phone no?</Text>
            <Text style={styles.bodyText}>
              We sometimes share updates on your account, our new features,
              announcements, and more
            </Text>
            <CustomIconInput
              label="Phone number"
              leftBlurIcon="phone"
              leftFocusIcon="phone"
              onChangeText={text => {
                const {userInput} = this.state;
                this.setState({
                  userInput: {...userInput, phone: text},
                });
              }}
            />
          </View>
        </Swiper>
        <View style={{marginBottom: 40}}>
          <Button
            type="solid"
            title="NEXT"
            buttonStyle={styles.buttonSolidStyle}
            titleStyle={styles.buttonSolidTitleStyle}
            onPress={this.nextView}
          />
        </View>
      </View>
    );
  }
}
