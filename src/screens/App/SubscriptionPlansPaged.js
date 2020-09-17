/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Card} from 'react-native-elements';
import shortid from 'shortid';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {
  CANCEL_SUBSCRIPTION,
  UPGRADE_DOWNGRADE_SUB,
  MEPOST,
  GET_PLANS,
} from '../../QueryAndMutation';
import {withApollo} from 'react-apollo';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingEnd: 10,
    justifyContent: 'flex-start',
  },
  bodyText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 30,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginHorizontal: 60,
    marginBottom: 20,
    paddingVertical: 15,
    marginTop: 40,
    borderRadius: 5,
  },
  selectBtn: {
    backgroundColor: '#fff',
    marginHorizontal: 60,
    marginBottom: 20,
    paddingVertical: 15,
    marginTop: 40,
    borderRadius: 5,
    borderColor: '#1B2CC1',
    borderWidth: 1,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Muli-Regular',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  subAmountText: {
    color: '#1B2CC1',
    fontFamily: 'Muli-Regular',
    fontSize: 46,
    marginBottom: -2,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectText: {
    color: '#1B2CC1',
    fontSize: 20,
    fontFamily: 'Muli-Regular',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  smallHeaderSubText: {
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    color: '#ccc',
    textAlign: 'center',
  },
  smallSubText: {
    fontSize: 16,
    marginVertical: 5,
    fontFamily: 'Muli-Regular',
    color: '#000',
    textAlign: 'left',
    flex: 20,
  },
  cardContainer: {
    justifyContent: 'center',
    borderRadius: 6,
    marginHorizontal: 5,
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
  cardActiveSubHeaderView: {
    justifyContent: 'center',
    paddingBottom: 10,
    marginBottom: 5,
    padding: 10,
  },
  cardTitleName: {
    fontSize: 18,
    fontFamily: 'Muli-Regular',
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pointIcon: {
    fontFamily: 'Muli-Regular',
    fontSize: 20,
    color: '#1B2CC1',
    marginHorizontal: 10,
    flex: 1,
    fontWeight: 'bold',
  },
  markIcon: {
    alignSelf: 'center',
    height: 65,
    width: 65,
    marginTop: 5,
    marginBottom: 30,
  },
});

const formatNumber = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

class SubscriptionPlansPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    activeIndex: 1,
    subscriptions: [
      {
        amount: 0,
        name: 'Pay As You Go',
        purpose: 'PAY_AS_YOU_GO',
        code: '',
        per: 'per consultation',
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
        code: '',
        per: 'per month',
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
        code: '',
        per: 'per month',
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
    email: this.props.navigation.state.params.me.local.email,
    user: this.props.navigation.state.params.me,
    loading: false,
    name: this.props.navigation.state.params.name,
    isActive: this.props.navigation.state.params.isActive,
  };

  async UNSAFE_componentWillMount() {
    const {subscriptions} = {...this.state};
    const updatedSubscriptions = subscriptions;

    const data = await this.props.client.query({
      query: GET_PLANS,
    });
    if (data) {
      const {getPlans} = data.data;

      updatedSubscriptions[1].code = getPlans[0].code;
      updatedSubscriptions[2].code = getPlans[1].code;
    }

    const price = this.state.user;
    if (price) {
      const {priceTags, local} = price;
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

  render() {
    const {
      subscriptions,
      activeIndex,
      email,
      isActive,
      name,
      loading,
    } = this.state;
    const cards = subscriptions.map(d => {
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
                {formatNumber(d.amount)}
              </Text>
              <Text style={styles.smallHeaderSubText}>{d.per}</Text>
            </View>
          }>
          <View style={{marginHorizontal: 10, paddingHorizontal: 10}}>
            {features}
          </View>
          <TouchableOpacity
            disabled={loading}
            style={
              d.purpose === name && isActive
                ? styles.selectBtn
                : styles.buttonSolidStyle
            }
            onPress={async () => {
              if (d.amount === 0) {
                return;
              }

              if (isActive) {
                this.setState({loading: true});
                if (d.purpose === name) {
                  try {
                    const cancel = await this.props.client.mutate({
                      mutation: CANCEL_SUBSCRIPTION,
                      awaitRefetchQueries: true,
                      refetchQueries: [
                        {
                          query: MEPOST,
                        },
                      ],
                    });
                    if (cancel) {
                      ShowMessage(type.DONE, 'Subscription cancelled');
                      setTimeout(() => {
                        this.setState({loading: false});
                        this.props.navigation.navigate('Subscription');
                      }, 3000);
                    }
                    return;
                  } catch (err) {
                    this.setState({loading: false});
                    ShowMessage(type.ERROR, err);
                  }
                  this.setState({loading: false});
                  return;
                }

                try {
                  const res = await this.props.client.mutate({
                    mutation: UPGRADE_DOWNGRADE_SUB,
                    variables: {
                      data: {
                        plan: d.purpose,
                      },
                    },
                    awaitRefetchQueries: true,
                    refetchQueries: [
                      {
                        query: MEPOST,
                      },
                    ],
                  });
                  if (res) {
                    const {status} = res.data.downgradeOrupgradeSubscription;
                    if (status === 'SUCCESS') {
                      ShowMessage(type.DONE, status);
                      setTimeout(() => {
                        this.setState({loading: false});
                        // this.props.navigation.navigate('Subscription');
                        this.props.navigation.navigate('Home');
                      }, 3000);
                    }
                    return;
                  }
                  return;
                } catch (err) {
                  this.setState({loading: false});
                  ShowMessage(type.ERROR, err);
                  return;
                }
              }
              this.setState({loading: false});
              this.props.navigation.navigate('PayStack', {
                email,
                amount: d.amount,
                code: d.code,
                purpose: d.purpose,
                route: 'app',
              });
            }}>
            {loading ? (
              <ActivityIndicator
                style={{padding: 3}}
                color={d.purpose === name && loading ? '#1B2CC1' : '#fff'}
              />
            ) : (
              <Text
                style={
                  d.purpose === name && isActive
                    ? styles.selectText
                    : styles.buttonSolidTitleStyle
                }>
                {d.purpose === name && isActive ? 'CANCEL' : 'SELECT'}
              </Text>
            )}
          </TouchableOpacity>
        </Card>
      );
    });
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingHorizontal: 15}}>
          <View>
            <Text style={styles.headerText}>Subscription</Text>
          </View>

          <Text style={styles.bodyText}>Plans</Text>
          {cards}
        </ScrollView>
      </View>
    );
  }
}

export default withApollo(SubscriptionPlansPage);
