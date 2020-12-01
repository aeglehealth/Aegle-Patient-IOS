import 'react-native-gesture-handler';
/* eslint-disable global-require */
import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {StyleSheet, Text, View, Platform} from 'react-native';
import {Header} from 'react-native-elements';
import {HeaderLeft} from '../../Components/HeaderLeft';

import UpcomingAppointments from './AppointmentsUpcomingPage';
import PreviousAppointments from './AppointmentsPreviousPage';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    fontSize: 32,
    marginTop: 5,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
    paddingTop: 0,
    height: Platform.select({
      android: 55,
      default: 50,
    }),
  },
  headerLeftContainerStyle: {
    flex: 10,
    paddingTop: 0,
    width: '100%',
  },
});

export default class App extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  render() {
    const {navigation} = this.props;
    class Upcoming extends React.Component {
      render() {
        return <UpcomingAppointments screenProps={{navigation}} />;
      }
    }

    class Previous extends React.Component {
      render() {
        return <PreviousAppointments screenProps={{navigation}} />;
      }
    }

    const TabNavigator = createMaterialTopTabNavigator(
      {
        Upcoming: {
          screen: Upcoming,
        },
        Previous: {
          screen: Previous,
        },
      },
      {
        tabBarOptions: {
          activeTintColor: '#0066F5',
          inactiveTintColor: '#828282',
          indicatorStyle: {
            height: 5,
            backgroundColor: '#0066F5',
          },
          labelStyle: {
            fontSize: 14,
            marginBottom: 0,
            fontFamily: 'Muli-Bold',
          },
          tabStyle: {
            marginTop: 10,
            paddingBottom: 0,
            paddingTop: 0,
          },
          style: {
            paddingBottom: 0,
            paddingTop: 0,
            borderTopColor: '#fff',
            backgroundColor: '#fff',
            ...elevationShadowStyle(5),
          },
        },
      },
    );

    const AppNavigator = createStackNavigator({
      Root: {
        screen: TabNavigator,
        navigationOptions: () => ({
          header: () => {
            return (
              <View>
                <Header
                  containerStyle={styles.headerStyle}
                  leftComponent={
                    <Text style={styles.headerText}>Appointments</Text>
                  }
                  leftContainerStyle={styles.headerLeftContainerStyle}
                />
              </View>
            );
          },
        }),
      },
    });

    const AppContainer = createAppContainer(AppNavigator);
    return <AppContainer />;
  }
}
