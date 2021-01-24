/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EMAIL} from 'react-native-dotenv';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  bodyText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 26,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonDisabledStyle: {
    backgroundColor: 'rgba(27, 44, 193, 0.5)',
    marginHorizontal: 0,
    marginBottom: 20,
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginHorizontal: 0,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
  },
  mainView: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 20,
  },
});

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class TermsPage extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    acceptEnabled: true,
    email: '',
  };

  async componentDidMount() {
    const email = await AsyncStorage.getItem(EMAIL);
    console.log(email, 'email');
    this.setState({email});
  }

  render() {
    const {email} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.mainView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                this.setState({acceptEnabled: false});
              }
            }}
            scrollEventThrottle={400}>
            <Text style={styles.headerText}>Terms &amp; Conditions</Text>
            <Text style={styles.bodyText}>
              We’re creating a world where healthcare is priority and building a
              digital health service that suits your lifestyle.
            </Text>
            <Text style={styles.bodyText}>
              To Provide you with our services we need to collect and process
              some information about you. To do so we need your consent to
              process your data for:
            </Text>
            <Text style={styles.bodyText}>
              Doctor Consultations and Prescriptions.
            </Text>
            <Text style={styles.bodyText}>
              To process or issue a prescription, our doctors need to confirm
              your request and authorise it. To do so, we need to collect the
              following data:
            </Text>
            <Text style={styles.bodyText}>
              Your name, date of birth, gender, contact telephone number and
              email, address, current prescription and payment details.
            </Text>
            <Text style={[styles.bodyText]}>
              Our Privacy Policy which can be accessed on our website sets out
              how your personal information will be used by us. By clicking
              Accept, you confirm that you have read the terms and conditions,
              that you understand them and that you agree to be bound by them.
            </Text>
          </ScrollView>

          <Button
            type="solid"
            title="ACCEPT"
            // disabled={this.state.acceptEnabled}
            buttonStyle={styles.buttonSolidStyle}
            titleStyle={styles.buttonSolidTitleStyle}
            disabledStyle={styles.buttonDisabledStyle}
            disabledTitleStyle={styles.buttonSolidTitleStyle}
            // onPress={() => this.props.navigation.navigate('AuthSubscription')}
            onPress={() => {
              this.props.navigation.navigate('SubscriptionPlans', {
                email,
                activeUserSubscriptions: [],
                route: 'auth',
              });
            }}
          />
        </View>
      </View>
    );
  }
}
