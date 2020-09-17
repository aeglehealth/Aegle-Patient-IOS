/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Button, Card} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import shortid from 'shortid';
import {withApollo} from 'react-apollo';
import {GET_PLANS, MEPOST} from '../../QueryAndMutation';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {CurrencyFormat} from '../../Utils/currencyFormatter/index';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const formatNumber = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

class SubscriptionPage extends React.Component {
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
      headerRight: (
        <Button
          onPress={() => {
            navigation.navigate('Home');
          }}
          title="SKIP"
          buttonStyle={{backgroundColor: '#fff'}}
          titleStyle={{color: '#000', marginEnd: 20}}
        />
      ),
    };
  };

  async UNSAFE_componentWillMount() {
    const {subscriptions} = {...this.state};
    const updatedSubscriptions = subscriptions;

    const data = await this.props.client.query({
      query: GET_PLANS,
      fetchPolicy: 'no-cache',
    });
    if (data) {
      const {getPlans} = data.data;

      updatedSubscriptions[1].code = getPlans[0].code;
      updatedSubscriptions[2].code = getPlans[1].code;
    }

    const price = await this.props.client.query({
      query: MEPOST,
      fetchPolicy: 'no-cache',
    });
    if (price) {
      const {priceTags, local} = price.data.me;
      const {email} = local;
      updatedSubscriptions[0].amount = priceTags.payAsYouGo / 100;
      updatedSubscriptions[1].amount = priceTags.basic / 100;
      updatedSubscriptions[2].amount = priceTags.premium / 100;
      this.setState({
        email,
      });
    }
    this.setState({
      subscriptions: updatedSubscriptions,
    });
  }

  state = {
    subscriptions: [
      {
        name: 'Pay As You Go',
        amount: 0,
        purpose: 'PAY_AS_YOU_GO',
        per: 'per consultation',
        code: '',
        features: [
          'Get Doctors on demand',
          'Prescriptions in minutes',
          'Access to licensed Doctors',
          'Free specialist and therapist referral',
          'Free medical notes',
          'Free medical follow-ups',
          'Free access to Aegle bot',
          'Additional \u20A65,000 for a face-to-face consultation',
        ],
      },
      {
        name: 'Basic Plan',
        amount: 0,
        purpose: 'BASIC',
        per: 'per month',
        code: '',
        features: [
          'Get Doctors on demand',
          'Prescriptions in minutes',
          'Access to licensed Doctors',
          'Free specialist and therapist referral',
          'Free medical notes',
          'Free medical follow-ups',
          'Free access to Aegle bot',
          'Additional \u20A65,000 for a face-to-face consultation',
        ],
      },
      {
        name: 'Premium Plan',
        amount: 0,
        purpose: 'PREMIUM',
        per: 'per month',
        code: '',
        features: [
          'Get Doctors on demand',
          'Prescriptions in minutes',
          'Access to licensed Doctors',
          'Access to licensed Therapist',
          'Access to licensed Specialist',
          'Free medical notes',
          'Free medical follow-ups',
          'Free access to Aegle bot',
          'Additional \u20A65,000 for a face-to-face consultation',
        ],
      },
    ],
    initiliazing: false,
    email: '',
  };

  chargeCard() {
    RNPaystack.chargeCard({
      cardNumber: '507850785078507812',
      expiryMonth: '08',
      expiryYear: '21',
      cvc: '081',
      email: 'ezeokecc@gmail.com',
      amountInKobo: 500000,
    })
      .then(response => {
        console.log(response, 'response'); // do stuff with the token
      })
      .catch(error => {
        console.log(error); // error is a javascript Error object
      });
  }

  render() {
    const cards = this.state.subscriptions.map(d => {
      const features = d.features.map(f => {
        return (
          <View style={{flexDirection: 'row'}} key={shortid.generate()}>
            <Text style={styles.pointIcon}>-</Text>
            <Text style={styles.smallSubText}>{f}</Text>
          </View>
        );
      });
      return (
        <Card
          containerStyle={styles.cardContainer}
          key={shortid.generate()}
          title={
            <View style={styles.cardSubHeaderView}>
              <Text style={styles.cardTitleName}>{d.name}</Text>
              <Text style={styles.subAmountText}>
                {'\u20A6'}
                {CurrencyFormat(d.amount)}
              </Text>
              <Text style={styles.smallHeaderSubText}>{d.per}</Text>
            </View>
          }>
          <View style={{marginHorizontal: 10, paddingHorizontal: 10}}>
            {features}
          </View>

          <TouchableOpacity
            onPress={() => {
              console.log(d.code);
              this.props.navigation.navigate('PayStack', {
                // this.props.navigation.navigate('SubscriptionOrderDetail', {
                amount: d.amount,
                code: d.code,
                purpose: d.purpose,
                email: this.state.email,
                route: 'auth',
              });
            }}>
            <View style={styles.buttonSolidStyle}>
              <Text style={styles.buttonSolidTitleStyle}>SUBSCRIBE</Text>
            </View>
          </TouchableOpacity>
        </Card>
      );
    });

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: 15}}>
            <Text style={styles.headerText}>Subscription</Text>
            {/* <Text style={styles.bodyText}>
              Get 30 days free trial for any plan you select and enjoy unlimited
              access to all our features.
            </Text> */}
          </View>
          <View style={{marginBottom: 50}}>{cards}</View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingEnd: 10,
    justifyContent: 'flex-start',
  },
  bodyText: {
    color: '#555',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    marginBottom: 30,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 30,
    marginBottom: 5,
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginHorizontal: 60,
    marginBottom: 20,
    paddingVertical: 10,
    marginTop: 40,
    borderRadius: 5,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    alignSelf: 'center',
  },
  subAmountText: {
    color: '#1B2CC1',
    fontFamily: 'Muli-Bold',
    fontSize: 36,
    marginBottom: -2,
    textAlign: 'center',
  },
  smallHeaderSubText: {
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    color: '#ccc',
    textAlign: 'center',
  },
  smallSubText: {
    fontSize: 14,
    marginVertical: 5,
    fontFamily: 'Muli-Regular',
    color: '#000',
    textAlign: 'left',
    flex: 20,
  },
  cardContainer: {
    justifyContent: 'center',
    borderRadius: 6,
    marginBottom: 20,
    padding: 0,
    ...elevationShadowStyle(6),
  },
  cardSubHeaderView: {
    justifyContent: 'center',
    borderBottomColor: '#eee',
    paddingBottom: 20,
    borderBottomWidth: 2,
    marginBottom: 20,
    padding: 10,
  },
  cardTitleName: {
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    color: '#000',
    textAlign: 'center',
  },
  pointIcon: {
    fontFamily: 'Muli-ExtraBold',
    fontSize: 20,
    color: '#1B2CC1',
    marginHorizontal: 10,
    flex: 1,
  },
});

export default withApollo(SubscriptionPage);
