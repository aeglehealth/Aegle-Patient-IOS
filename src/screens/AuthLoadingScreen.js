import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ActivityIndicatorPage from './App/ActivityIndicatorPage';
import SplashScreen from 'react-native-splash-screen';
import {AUTH_TOKEN} from 'react-native-dotenv';

class AuthLoadingScreen extends Component {
  async componentDidMount() {
    // SplashScreen.preventAutoHide();
    await this._bootstrapAsync();
    SplashScreen.hide();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN);

    // await Font.loadAsync({
    //   'muli-regular': require('./assets/fonts/Muli-Regular.ttf'),
    //   'Muli-Bold': require('./assets/fonts/Muli-Bold.ttf'),
    //   'Muli-ExtraBold': require('./assets/fonts/Muli-ExtraBold.ttf'),
    // });
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(token ? 'App' : 'Auth'); // this.props.navigation.navigate(token ? "App" : "Auth");

    // Hide splash screen
    // SplashScreen.hide();
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicatorPage />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;
