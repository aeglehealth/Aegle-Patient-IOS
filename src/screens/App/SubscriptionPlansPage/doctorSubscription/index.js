/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Card} from 'react-native-elements';
import shortid from 'shortid';
import {HeaderLeft} from '../../../../Components/HeaderLeft';
import {withApollo} from 'react-apollo';
import {styles} from '../styles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {doctorPlans} from './doctorPlans';
import {currencyFormat} from '../../../../Utils/currencyFormat';
import {
  CANCEL_SUBSCRIPTION,
  ACTIVE_SUBSCRIPTION,
} from '../../../../QueryAndMutation';
import ShowMessage, {type} from '../../../../Components/toster/ShowMessage';
import Accordion from '../../../../Components/Accordion';

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
    subscriptions: doctorPlans,
    email: this.props.email,
    user: this.props.me,
    loading: false,
    name: this.props.name,
    isActive: this.props.isActive,
    route: this.props.route,
    collapseIcon: 'chevron-down',
    collapsed: true,
  };

  async componentDidMount() {
    let {subscriptions} = this.state;
    setTimeout(() => {
      const data = this.props.subscriptions;
      if (data.length > 0) {
        const doctorPlans = data.filter(plan => plan.entity === 'doctor');
        if (doctorPlans.length > 0) {
          subscriptions = doctorPlans[0].plans.map(subscription => {
            return {
              amount: subscription.price,
              oldAmount: subscription.previousPrice,
              entity: subscription.entity,
              name: subscription.name,
              code: subscription._id,
              per: `(Save \u20A6${subscription.previousPrice -
                subscription.price})`,
              features: subscription.packages.map(item => item.title),
            };
          });
        }
      }
      this.setState({
        subscriptions,
      });
    }, 1500);
  }

  render() {
    const {subscriptions, email, isActive, loading, route} = this.state;

    const activeSub =
      isActive.length > 0 &&
      isActive.filter(sub => sub.entity == subscriptions[0].entity);

    const subscription =
      activeSub && activeSub[0] ? activeSub[0].subscription : '';

    const renew = activeSub && activeSub[0] ? activeSub[0].renew : '';

    const cards = subscriptions.map(d => {
      const popularPlan = d.type === 'Most popular plan' ? true : false;
      const features = d.features.map(f => {
        return (
          <View style={{flexDirection: 'row'}} key={shortid.generate()}>
            <EvilIcons
              name="check"
              size={20}
              style={styles.pointIcon}
              color={popularPlan ? '#fff' : '#1B2CC1'}
            />
            <Text
              style={{
                ...styles.smallSubText,
                color: popularPlan ? '#fff' : '#000',
              }}>
              {f}
            </Text>
          </View>
        );
      });
      return (
        <Card
          containerStyle={{
            ...styles.cardContainer,
            backgroundColor: popularPlan ? '#1B2CC1' : '#fff',
          }}
          key={shortid.generate()}
          title={
            <View style={styles.cardSubHeaderView}>
              <Text
                style={{
                  ...styles.cardTitleName,
                  color: popularPlan ? '#fff' : '#000',
                }}>
                {d.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: 'pink',
                }}>
                <View style={{position: 'absolute', left: 40}}>
                  <EvilIcons name="close" size={56} color="red" />
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    marginRight: 15,
                    color: popularPlan ? '#fff' : '#000',
                  }}>
                  {'\u20A6'}
                  {currencyFormat(d.oldAmount)}
                </Text>
                <Text
                  style={{
                    ...styles.subAmountText,
                    color: popularPlan ? '#fff' : '#1B2CC1',
                  }}>
                  {'\u20A6'}
                  {currencyFormat(d.amount)}
                </Text>
              </View>

              <Text
                style={{
                  ...styles.smallHeaderSubText,
                  color: popularPlan ? '#fff' : '#ccc',
                }}>
                {d.per}
              </Text>
            </View>
          }>
          <Accordion title={'Learn More'} description={features} list />
          <TouchableOpacity
            disabled={loading}
            style={
              d.code === subscription && renew
                ? styles.selectBtn
                : {
                    ...styles.buttonSolidStyle,
                    backgroundColor: popularPlan ? '#fff' : '#1B2CC1',
                  }
            }
            onPress={async () => {
              if (d.amount === 0) {
                return;
              }

              if (d.code === subscription && renew) {
                try {
                  this.setState({loading: true});
                  const cancel = await this.props.client.mutate({
                    mutation: CANCEL_SUBSCRIPTION,
                    variables: {data: {entity: d.entity.toUpperCase()}},
                    awaitRefetchQueries: true,
                    refetchQueries: [
                      {
                        query: ACTIVE_SUBSCRIPTION,
                      },
                    ],
                  });
                  if (cancel && cancel.data.cancelSubscription.name == d.name) {
                    ShowMessage(type.DONE, 'Subscription cancelled');
                    setTimeout(() => {
                      this.setState({loading: false});
                      this.props.navigation.navigate('Subscription');
                    }, 3000);
                  }
                  this.setState({loading: false});
                  return;
                } catch (err) {
                  this.setState({loading: false});
                  ShowMessage(type.ERROR, err);
                }
                this.setState({loading: false});
                return;
              }

              this.setState({loading: false});
              this.props.navigation.navigate('PayStack', {
                email,
                amount: d.amount,
                code: d.code,
                route,
              });
            }}>
            {loading && d.code === subscription && renew ? (
              <ActivityIndicator style={{padding: 3}} color={'#1B2CC1'} />
            ) : (
              <Text
                style={
                  d.code === subscription && renew
                    ? styles.selectText
                    : {
                        ...styles.buttonSolidTitleStyle,
                        color: popularPlan ? '#1B2CC1' : '#fff',
                      }
                }>
                {d.code === subscription && renew ? 'CANCEL' : 'CHOOSE'}
              </Text>
            )}
          </TouchableOpacity>
        </Card>
      );
    });
    return <View style={styles.container}>{cards}</View>;
  }
}

export default withApollo(SubscriptionPlansPage);
