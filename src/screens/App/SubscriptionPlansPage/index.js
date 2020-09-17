/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import {Button} from 'react-native-elements';
import {HeaderLeft} from '../../../Components/HeaderLeft';
import {withApollo} from 'react-apollo';
import {styles} from './styles';
import {SUBSCRIPTION_LIST} from '../../../QueryAndMutation';
import DoctorSubscription from './doctorSubscription';
import SpecialistSubscription from './specialistSubscription';
import TherapistSubscription from './therapistSubscription';
import HasPlan from './hasPlan';

class SubscriptionPlansPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
      headerRight:
        params.route != 'app' ? (
          <Button
            onPress={() => {
              navigation.navigate('Home');
            }}
            title="SKIP"
            buttonStyle={{backgroundColor: '#fff'}}
            titleStyle={{color: '#000', marginEnd: 20}}
          />
        ) : null,
    };
  };

  state = {
    activeIndex: 1,
    email: '',
    user: {},
    loading: false,
    name: '',
    isActive: null,
    activeScreen: 'DoctorSubscription',
    subscriptions: [],
  };

  async UNSAFE_componentWillMount() {
    const res = await this.props.client.query({
      query: SUBSCRIPTION_LIST,
    });
    console.log(res, 'ddd');
    if (res) {
      const {subscriptionList} = res.data;
      this.setState({
        subscriptions: subscriptionList,
      });
    }
  }

  render() {
    const {
      navigation: {
        state: {
          params: {activeUserSubscriptions, route, email},
        },
      },
    } = this.props;
    const {activeScreen, subscriptions} = this.state;
    const screens = {
      DoctorSubscription: (
        <DoctorSubscription
          navigation={this.props.navigation}
          email={email}
          isActive={activeUserSubscriptions}
          subscriptions={subscriptions}
          route={route}
        />
      ),
      SpecialistSubscription: (
        <SpecialistSubscription
          navigation={this.props.navigation}
          email={email}
          isActive={activeUserSubscriptions}
          subscriptions={subscriptions}
          route={route}
        />
      ),
      TherapistSubscription: (
        <TherapistSubscription
          navigation={this.props.navigation}
          email={email}
          isActive={activeUserSubscriptions}
          subscriptions={subscriptions}
          route={route}
        />
      ),
    };

    const active = activeUserSubscriptions
      .map(item => item.renew)
      .filter((v, i, a) => a.indexOf(v) === i);

    const activeCheck =
      active.length > 1
        ? true
        : active.length == 1 && active[0] == false
        ? false
        : active.length == 0
        ? false
        : true;

    const activeLength = activeUserSubscriptions
      .map(item => item.renew)
      .filter(item => item == true);

    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingHorizontal: 15}}>
          <Text style={styles.headerText}>
            {route === 'app' ? 'Subscription Plans' : 'Select a Plan'}
          </Text>
          {activeUserSubscriptions.length > 0 ? (
            <>
              <Text style={{...styles.bodyText, fontWeight: 'bold'}}>
                {activeCheck &&
                  `Active Plan${activeLength.length > 1 ? 's' : ''}`}
              </Text>
              {activeUserSubscriptions.map((subscription, i) => (
                <HasPlan
                  key={i}
                  price={subscription.price}
                  expiresIn={subscription.expiresIn}
                  entity={subscription.entity}
                  name={subscription.name}
                  renew={subscription.renew}
                  navigation={this.props.navigation}
                />
              ))}
            </>
          ) : (
            <View></View>
          )}
          <View>
            {route !== 'app' ? (
              <Text style={{...styles.bodyText, marginBottom: 20}}>
                Choose a plan to continue
              </Text>
            ) : (
              <Text
                style={{
                  ...styles.bodyText,
                  fontWeight: 'bold',
                  marginBottom: 20,
                }}>
                Other Plans
              </Text>
            )}
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  ...this.state,
                  activeScreen: 'DoctorSubscription',
                })
              }
              style={[
                styles.eachTab,
                activeScreen === 'DoctorSubscription' && styles.activeStyle,
              ]}>
              <Text
                style={[
                  styles.tabText,
                  activeScreen === 'DoctorSubscription' && styles.activeText,
                ]}>
                Doctor Plan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  ...this.state,
                  activeScreen: 'TherapistSubscription',
                })
              }
              style={[
                styles.eachTab,
                activeScreen === 'TherapistSubscription' && styles.activeStyle,
              ]}>
              <Text
                style={[
                  styles.tabText,
                  activeScreen === 'TherapistSubscription' && styles.activeText,
                ]}>
                Therapist Plan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  ...this.state,
                  activeScreen: 'SpecialistSubscription',
                })
              }
              style={[
                styles.eachTab,
                activeScreen === 'SpecialistSubscription' && styles.activeStyle,
              ]}>
              <Text
                style={[
                  styles.tabText,
                  activeScreen === 'SpecialistSubscription' &&
                    styles.activeText,
                ]}>
                Specialist Plan
              </Text>
            </TouchableOpacity>
          </View>
          {screens[this.state.activeScreen]}
        </ScrollView>
      </View>
    );
  }
}

export default withApollo(SubscriptionPlansPage);
