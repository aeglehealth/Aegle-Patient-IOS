/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import 'react-native-gesture-handler';
import React from 'react';
import {Image} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Badge from '../../Components/Badge';

import Home from './Home';
// import Home from './HomePage';
import Care from './CarePage';
import Forum from './ForumNavigator';
import Notifications from './NotificationPage';
import Accounts from './AccountsPage';
import {View} from 'react-native-animatable';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Care,
    Forum,
    Notifications,
    Accounts,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;

        if (routeName === 'Home') {
          if (tintColor === '#828282') {
            return (
              <Image
                style={{maxHeight: 21, maxWidth: 21}}
                source={require('../../assets/home-desd.png')}
              />
            );
          }
          return (
            <Image
              style={{maxHeight: 21, maxWidth: 21}}
              source={require('../../assets/home.png')}
            />
          );
        }

        if (routeName === 'Care') {
          if (tintColor === '#828282') {
            return (
              <Image
                style={{maxHeight: 21, maxWidth: 21}}
                source={require('../../assets/heartbeat-desd.png')}
              />
            );
          }
          return (
            <Image
              style={{maxHeight: 21, maxWidth: 21}}
              source={require('../../assets/heartbeat.png')}
            />
          );
        }

        if (routeName === 'Forum') {
          if (tintColor === '#828282') {
            return (
              <Image
                style={{maxHeight: 21, maxWidth: 21}}
                source={require('../../assets/forum-desd.png')}
              />
            );
          }
          return (
            <Image
              style={{maxHeight: 21, maxWidth: 21}}
              source={require('../../assets/forum.png')}
            />
          );
        }

        if (routeName === 'Notifications') {
          if (tintColor === '#828282') {
            return (
              <View>
                <Image
                  style={{height: 23.2, width: 23}}
                  source={require('../../assets/notify-desd.png')}
                />
                <Badge navigation={navigation} />
              </View>
            );
          }
          return (
            <View>
              <Image
                style={{height: 23.2, width: 23}}
                source={require('../../assets/notify.png')}
              />
              <Badge navigation={navigation} />
            </View>
          );
        }

        if (routeName === 'Accounts') {
          if (tintColor === '#828282') {
            return (
              <Image
                style={{maxHeight: 21, maxWidth: 21}}
                source={require('../../assets/account-desd.png')}
              />
            );
          }
          return (
            <Image
              style={{maxHeight: 21, maxWidth: 21}}
              source={require('../../assets/account.png')}
            />
          );
        }

        // You can return any component that you like here!
        return <Image source={require('../../assets/home.png')} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#1B2CC1',
      inactiveTintColor: '#828282',
      style: {
        height: 65,
        paddingVertical: 8,
        borderTopColor: '#fff',
        backgroundColor: '#fff',
        ...elevationShadowStyle(5),
      },
    },
  },
);

export default createAppContainer(TabNavigator);
