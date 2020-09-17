/* eslint-disable global-require */
import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';

import DoctorReport from './DoctorReportPage';
import DoctorReferral from './DoctorReferralPage';
import DoctorPrescriptionPage from './DoctorPrescriptionPage';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

// const TabNavigator = createMaterialTopTabNavigator(
//   {
//     Report: DoctorReport,
//     Prescription: DoctorPrescriptionPage,
//     Referral: DoctorReferral,
//   },
// {
//   tabBarOptions: {
//     activeTintColor: '#fff',
//     inactiveTintColor: 'rgba(255, 255, 255, 0.7)',
//     indicatorStyle: {
//       height: 3,
//       backgroundColor: '#fff',
//     },
//     labelStyle: {
//       fontSize: 13,
//       marginBottom: 0,
//     },
//     tabStyle: {
//       paddingBottom: 0,
//       paddingTop: 0,
//     },
//     style: {
//       paddingBottom: 0,
//       paddingTop: 0,
//       borderTopColor: '#1B2CC1',
//       backgroundColor: '#1B2CC1',
//       ...elevationShadowStyle(5),
//     },
//     },
//   },
// );

// const AppNavigator = createStackNavigator({
//   Root: {
//     screen: TabNavigator,
//     navigationOptions: {
//       header: null,
//     },
//   },
// });

// export default createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    console.log(this.props.navigation, 'propsss');
    const {
      navigation,
      navigation: {
        state: {
          params: {appointmentId},
        },
      },
    } = this.props;
    class Report extends React.Component {
      render() {
        return <DoctorReport screenProps={{navigation, appointmentId}} />;
      }
    }

    class Referral extends React.Component {
      render() {
        return <DoctorReferral screenProps={{navigation, appointmentId}} />;
      }
    }

    class Prescription extends React.Component {
      render() {
        return (
          <DoctorPrescriptionPage screenProps={{navigation, appointmentId}} />
        );
      }
    }

    const TabNavigator = createMaterialTopTabNavigator(
      {
        Report,
        Referral,
        Prescription,
      },
      {
        tabBarOptions: {
          activeTintColor: '#fff',
          inactiveTintColor: 'rgba(255, 255, 255, 0.7)',
          indicatorStyle: {
            height: 3,
            backgroundColor: '#fff',
          },
          labelStyle: {
            fontSize: 13,
            marginBottom: 0,
          },
          tabStyle: {
            paddingBottom: 0,
            paddingTop: 0,
          },
          style: {
            paddingBottom: 0,
            paddingTop: 0,
            borderTopColor: '#1B2CC1',
            backgroundColor: '#1B2CC1',
            ...elevationShadowStyle(5),
          },
        },
      },
    );

    const AppContainer = createAppContainer(TabNavigator);
    return <AppContainer />;
  }
}
