import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Linking,
  AppState,
  Appearance,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Divider} from 'react-native-elements';
import {withApollo, Mutation} from 'react-apollo';
import {
  SUBMIT_PHONE,
  SUBMIT_PIN,
  PAY,
  SUBMIT_OTP,
  ACTIVE_SUBSCRIPTION,
  CHECK_SUBSCRIPTION_STATUS,
  UPDATE_PROFILE,
} from '../../QueryAndMutation';
import {Formik} from 'formik';
import * as yup from 'yup';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
import {CurrencyFormat} from '../../Utils/currencyFormatter/index';
import {HeaderLeft} from '../../Components/HeaderLeft';
import Aegle from '../../assets/logo-black.png';
import DialogInput from 'react-native-dialog-input';

class Paystack extends React.Component {
  state = {
    cardNum: '',
    cardExpiryMonth: '',
    cardExpiryYear: '',
    cardCvc: '',
    loading: false,
    email: this.props.navigation.state.params.email,
    amount: this.props.navigation.state.params.amount,
    code: this.props.navigation.state.params.code,
    route: this.props.navigation.state.params.route,
    isDialogVisible: false,
    isDialogVisible2: false,
    isDialogVisible3: false,
    reference: '',
    url: '',
    appState: AppState.currentState,
  };

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: 'Pay with Card',
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
      headerTintColor: '#727272',
      headerTitleStyle: {
        fontSize: 17,
        flex: 1,
        fontWeight: 'bold',
        alignSelf: 'center',
      },
    };
  };

  handleChange = ({target}) => {
    const {name, value} = target;
    this.setState({
      [name]: value,
    });
  };

  sendInputPin = async inputText => {
    const {route} = this.state;
    console.log(inputText, 'pin');
    try {
      const sendPin = await this.props.client.mutate({
        mutation: SUBMIT_PIN,
        variables: {data: {reference: this.state.reference, pin: inputText}},
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: ACTIVE_SUBSCRIPTION,
          },
        ],
      });
      if (sendPin) {
        console.log('sendd', sendPin);
        this.setState({isDialogVisible: false});
        const {
          data: {status, reference},
        } = sendPin.data.submitPin.data;
        if (status === 'success') {
          ShowMessage(type.DONE, 'Transaction Successful');
          setTimeout(
            () =>
              this.props.navigation.navigate(
                `${route == 'app' ? 'Subscription' : 'Home'}`,
              ),
            3000,
          );
        } else if (status === 'send_otp') {
          this.setState({isDialogVisible2: true, reference});
        } else if (status === 'send_phone') {
          this.setState({isDialogVisible3: true, reference});
        } else if (status === 'open_url') {
          this.setState({reference, url});
          this.openUrl(url);
        }
      }
      this.setState({isDialogVisible: false});
    } catch (err) {
      this.setState({isDialogVisible: false});
      console.log(err);
      ShowMessage(type.ERROR, err);
    }
  };

  sendInputOTP = async inputText => {
    const {route} = this.state;
    console.log(inputText, 'otp');
    try {
      const sendOTP = await this.props.client.mutate({
        mutation: SUBMIT_OTP,
        variables: {data: {reference: this.state.reference, otp: inputText}},
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: ACTIVE_SUBSCRIPTION,
          },
        ],
      });
      if (sendOTP) {
        console.log('senddOTP', sendOTP);
        this.setState({isDialogVisible2: false});
        const {
          data: {status, reference},
        } = sendOTP.data.submitOTP.data;
        if (status === 'success') {
          ShowMessage(type.DONE, 'Transaction Successful');
          setTimeout(
            () =>
              this.props.navigation.navigate(
                `${route == 'app' ? 'Subscription' : 'Home'}`,
              ),
            3000,
          );
        } else if (status === 'send_phone') {
          this.setState({isDialogVisible3: true, reference});
        } else if (status === 'open_url') {
          this.setState({reference, url});
          this.openUrl(url);
        }
      }
      this.setState({isDialogVisible2: false});
    } catch (err) {
      this.setState({isDialogVisible2: false});
      console.log(err);
      ShowMessage(type.ERROR, err);
    }
  };

  sendInputPhone = async inputText => {
    const {route} = this.state;
    console.log(inputText, 'phone');
    try {
      const sendPhone = await this.props.client.mutate({
        mutation: SUBMIT_PHONE,
        variables: {data: {reference: this.state.reference, phone: inputText}},
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: ACTIVE_SUBSCRIPTION,
          },
        ],
      });
      if (sendPhone) {
        console.log('sendd', sendPhone);
        this.setState({isDialogVisible3: false});
        const {
          data: {status, reference},
        } = sendPhone.data.submitPhone.data;
        if (status === 'success') {
          ShowMessage(type.DONE, 'Transaction Successful');
          setTimeout(
            () =>
              this.props.navigation.navigate(
                `${route == 'app' ? 'Subscription' : 'Home'}`,
              ),
            3000,
          );
        } else if (status === 'send_otp') {
          this.setState({isDialogVisible2: true, reference});
        } else if (status === 'open_url') {
          this.setState({reference, url});
          this.openUrl(url);
        }
      }
      this.setState({isDialogVisible3: false});
    } catch (err) {
      this.setState({isDialogVisible3: false});
      console.log(err);
      ShowMessage(type.ERROR, err);
    }
  };

  openUrl = async url => {
    await Linking.openURL(url);
  };

  checkStatus = async () => {
    const {route} = this.state;
    const {client} = this.props;

    try {
      const res = await client.query({
        query: CHECK_SUBSCRIPTION_STATUS,
        variables: {ref: this.state.reference},
      });
      console.log(res);
      if (res) {
        const {
          data: {
            checkStatus: {status},
          },
        } = res;
        if (status == 'success') {
          await client.mutate({
            mutation: UPDATE_PROFILE,
            variables: {cv: ''},
            awaitRefetchQueries: true,
            refetchQueries: [
              {
                query: ACTIVE_SUBSCRIPTION,
              },
            ],
          });
          ShowMessage(type.DONE, 'Transaction Successful');
          setTimeout(
            () =>
              this.props.navigation.navigate(
                `${route == 'app' ? 'Subscription' : 'Home'}`,
              ),
            3000,
          );
        }
      }
    } catch (err) {
      this.setState({
        isDialogVisible: false,
        isDialogVisible2: false,
        isDialogVisible3: false,
      });
    }
  };

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.checkStatus();
    }
    this.setState({appState: nextAppState});
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    const colorScheme = Appearance.getColorScheme();
    const darkmode = colorScheme === 'dark' ? true : false;
    const validationSchema = yup.object().shape({
      cardNum: yup.string().required('Enter Card Number'),
      cardExpiryMonth: yup.number().required('Enter Card Expiry Month'),
      cardExpiryYear: yup.number().required('Enter Card Expiry Year'),
      cardCvc: yup.number().required('Enter Card CVC Number'),
    });
    const {route, amount, email, code, loading} = this.state;
    return (
      <Mutation mutation={PAY}>
        {pay => (
          <Formik
            initialValues={{
              cardNum: '',
              cardExpiryMonth: '',
              cardExpiryYear: '',
              cardCvc: '',
            }}
            onSubmit={values => {
              this.setState({loading: true});
              pay({
                variables: {
                  pay: {
                    reason: 'subscription',
                    itemId: code,
                    card: {
                      number: values.cardNum,
                      expMonth: values.cardExpiryMonth,
                      expYear: values.cardExpiryYear,
                      cvv: values.cardCvc,
                    },
                  },
                },
                awaitRefetchQueries: true,
                refetchQueries: [
                  {
                    query: ACTIVE_SUBSCRIPTION,
                  },
                ],
              })
                .then(async res => {
                  const {
                    data: {status, reference, url},
                  } = res.data.pay.data;
                  if (status === 'success') {
                    ShowMessage(type.DONE, 'Transaction Successful');
                    // this.setState({loading: false});
                    setTimeout(
                      () =>
                        this.props.navigation.navigate(
                          `${route == 'app' ? 'Subscription' : 'Home'}`,
                        ),
                      3000,
                    );
                  } else if (status === 'send_pin') {
                    this.setState({isDialogVisible: true, reference, url});
                  } else if (status === 'open_url') {
                    this.setState({reference, url});
                    this.openUrl(url);
                  } else if (status === 'send_otp') {
                    this.setState({isDialogVisible2: true, reference});
                  }
                })
                .catch(error => {
                  this.setState({loading: false});
                  ShowMessage(type.ERROR, error);
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
              <ScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}>
                <View style={styles.main}>
                  <View style={styles.header}>
                    <Image source={Aegle} style={{width: 25, height: 25}} />
                    <View>
                      <Text style={{color: '#6C6C6C'}}>{email}</Text>
                      <Text style={{color: '#6C6C6C', alignSelf: 'flex-end'}}>
                        Pay
                        <Text style={{color: '#1B2CC1', fontWeight: '700'}}>
                          {' \u20A6' + CurrencyFormat(amount)}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <DialogInput
                    isDialogVisible={this.state.isDialogVisible}
                    title={'PAYSTACK'}
                    message={'Please input your pin'}
                    submitInput={inputText => {
                      this.sendInputPin(inputText);
                    }}
                    closeDialog={() => {
                      this.setState({isDialogVisible: false});
                    }}
                  />
                  <DialogInput
                    isDialogVisible={this.state.isDialogVisible2}
                    title={'PAYSTACK'}
                    message={'Please input your OTP'}
                    submitInput={inputText => {
                      this.sendInputOTP(inputText);
                    }}
                    closeDialog={() => {
                      this.setState({isDialogVisible2: false});
                    }}
                  />
                  <DialogInput
                    isDialogVisible={this.state.isDialogVisible3}
                    title={'PAYSTACK'}
                    message={'Please input your phone number'}
                    submitInput={inputText => {
                      this.sendInputPhone(inputText);
                    }}
                    closeDialog={() => {
                      this.setState({isDialogVisible3: false});
                    }}
                  />
                  <Divider style={styles.divider} />
                  <Text style={styles.cardDetails}>
                    Enter your card details to pay
                  </Text>
                  <View style={styles.cardView}>
                    <Text style={{color: '#85AECC'}}>CARD NUMBER</Text>
                    <TextInput
                      value={values.cardNum}
                      onChangeText={handleChange('cardNum')}
                      onBlur={handleBlur('cardNum')}
                      name="cardNum"
                      keyboardType="number-pad"
                      placeholder="0000 0000 0000 0000"
                      style={{
                        paddingTop: 5,
                        color: darkmode ? '#878787' : '#000',
                      }}
                    />
                    {touched.cardNum && errors.cardNum && (
                      <Text style={styles.errorText}>{errors.cardNum}</Text>
                    )}
                  </View>
                  <View style={styles.cardView2Main}>
                    <View style={styles.cardView2}>
                      <Text style={{color: '#A5A5A5'}}>CARD EXPIRY</Text>
                      <View style={styles.cardExpiry}>
                        <TextInput
                          value={values.cardExpiryMonth}
                          onChangeText={handleChange('cardExpiryMonth')}
                          onBlur={handleBlur('cardExpiryMonth')}
                          name="cardExpiryMonth"
                          keyboardType="number-pad"
                          placeholder="MM"
                          maxLength={2}
                          returnKeyType={'next'}
                          onSubmitEditing={event => {
                            this.refs.cardExpiryYear.focus();
                          }}
                          style={{
                            color: darkmode ? '#878787' : '#000',
                          }}
                        />
                        <Text style={{color: '#A5A5A5', margin: 5}}>/</Text>
                        <TextInput
                          ref={ref => (this.cardExpiryYear = ref)}
                          value={values.cardExpiryYear}
                          onChangeText={handleChange('cardExpiryYear')}
                          onBlur={handleBlur('cardExpiryYear')}
                          name="cardExpiryYear"
                          keyboardType="number-pad"
                          placeholder="YY"
                          maxLength={2}
                          style={{
                            color: darkmode ? '#878787' : '#000',
                          }}
                        />
                      </View>
                      {touched.cardExpiryYear && errors.cardExpiryYear && (
                        <Text style={styles.errorText}>
                          {errors.cardExpiryYear}
                        </Text>
                      )}
                      {touched.cardExpiryMonth && errors.cardExpiryMonth && (
                        <Text style={styles.errorText}>
                          {errors.cardExpiryMonth}
                        </Text>
                      )}
                    </View>
                    <View style={styles.cardView2}>
                      <Text style={{color: '#A5A5A5'}}>CVV</Text>
                      <TextInput
                        value={values.cardCvc}
                        onChangeText={handleChange('cardCvc')}
                        onBlur={handleBlur('cardCvc')}
                        name="cardCvc"
                        keyboardType="number-pad"
                        placeholder="123"
                        style={{
                          paddingTop: 12,
                          color: darkmode ? '#878787' : '#000',
                        }}
                        maxLength={3}
                      />
                      {touched.cardCvc && errors.cardCvc && (
                        <Text style={styles.errorText}>{errors.cardCvc}</Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    disabled={loading}
                    onPress={handleSubmit}
                    style={styles.payDiv}>
                    {loading ? (
                      <ActivityIndicator
                        size="small"
                        color="white"
                        style={{padding: 16}}
                      />
                    ) : (
                      <Text style={styles.payBtn}>
                        Pay {'\u20A6'}
                        {CurrencyFormat(amount)}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    // disabled={loading}
                    onPress={() => this.props.navigation.goBack()}>
                    <View style={styles.return}>
                      <FontAwesome
                        name="close"
                        color="black"
                        size={15}
                        style={{padding: 10}}
                      />
                      <Text style={{padding: 10, color: '#4C535B'}}>
                        Cancel Payment
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.lock}>
                    <FontAwesome name="lock" color="#001B33" size={15} />
                    <View style={{padding: 10}}>
                      <Text style={styles.secure}>
                        Secured by{' '}
                        <Text style={styles.bottomText}>paystack</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </Formik>
        )}
      </Mutation>
    );
  }
}

export default withApollo(Paystack);

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
  bar: {
    flexDirection: 'row',
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    elevation: 0.9,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  cardView: {
    borderWidth: 1,
    borderColor: '#85AECC',
    borderRadius: 5,
    width: '100%',
    padding: 10,
  },
  cardView2Main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  cardView2: {
    borderWidth: 1,
    borderColor: '#cacaca',
    borderRadius: 5,
    width: '48%',
    padding: 10,
  },
  cardExpiry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
  },
  payDiv: {
    backgroundColor: '#1B2CC1',
    marginTop: 30,
    borderRadius: 5,
    width: '100%',
  },
  payBtn: {
    padding: 13,
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    fontWeight: '700',
  },
  lock: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  return: {
    backgroundColor: '#E8E8E8',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '45%',
    borderRadius: 4,
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  bottomText: {
    color: '#001B33',
    fontWeight: '700',
    fontSize: 16,
  },
  secure: {
    color: '#4C535B',
    flexDirection: 'row',
    fontSize: 16,
  },
  cardDetails: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 30,
    color: '#353E45',
  },
  divider: {
    backgroundColor: '#cacaca',
    width: '100%',
    margin: 30,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
    paddingTop: 5,
  },
});
