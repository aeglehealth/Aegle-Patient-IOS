import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
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
// import codePush from 'react-native-code-push';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn:
    'https://12cb2ba41c58428a9a58e48f5bd574b8@o481668.ingest.sentry.io/5530671',
  enableAutoSessionTracking: true,
});

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

// const codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};

// export default codePush(codePushOptions)(App);
export default App;
