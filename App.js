/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
// } from 'react-native';
//
// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

import React from 'react';
import {
  StatusBar,
  View,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import {PRIMARY_COLOR} from './src/shared/Colors';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import Page from './src/screens/Routes';
import codePush from 'react-native-code-push';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: PRIMARY_COLOR,
  },
};

class App extends React.Component {
  constructor(properties) {
    super(properties);
  }

  // _handleAppStateChange = nextAppState => {
  //   let badgeCount,
  //     that = this;
  //   if (
  //     this.state.appState.match(/inactive|background/) &&
  //     nextAppState === 'active'
  //   ) {
  //     console.log(this.state.appState, 'idler');
  //     PushNotificationIOS.getApplicationIconBadgeNumber(async num => {
  //       badgeCount = num;
  //       that.setState({badgeCount});
  //     });
  //   }
  //   this.setState({appState: nextAppState});
  // };

  // componentWillUnmount() {
  //   AppState.removeEventListener('change', this._handleAppStateChange);
  // }

  // componentDidMount() {
  //   let that = this;
  //   PushNotificationIOS.getApplicationIconBadgeNumber(async num => {
  //     badgeCount = num;
  //     that.setState({badgeCount});
  //   });
  //   AppState.addEventListener('change', this._handleAppStateChange);
  // }

  statusBarIOS() {
    if (Platform.OS === 'ios') {
      return (
        <View
          style={{
            backgroundColor: PRIMARY_COLOR,
            height: Dimensions.get('screen').height / 20,
          }}
        />
      );
    }

    return null;
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <View style={{flex: 1}}>
          {/* {this.statusBarIOS()} */}
          <SafeAreaView style={{flex: 1}}>
            <StatusBar
              backgroundColor={PRIMARY_COLOR}
              barStyle={'light-content'}
            />
            <Page />
          </SafeAreaView>
        </View>
      </PaperProvider>
    );
  }
}

console.disableYellowBox = true;

const codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};

// export default codePush(codePushOptions)(App);
export default App;
