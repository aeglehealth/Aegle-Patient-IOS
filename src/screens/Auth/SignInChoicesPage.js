/* eslint-disable react/prop-types */
import React from 'react';
import SigningChoices from '../../Components/SigningChoices';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
import {GOOGLE_SIGNIN, FACEBOOK_SIGNIN} from '../../QueryAndMutation';
import {withApollo} from 'react-apollo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import ActivityIndicatorPage from '../App/ActivityIndicatorPage';
import {WEBCLIENTID, IOSCLIENTID, AUTH_TOKEN} from 'react-native-dotenv';

GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  webClientId: WEBCLIENTID,
  offlineAccess: true,
  hostedDomain: '',
  loginHint: '',
  forceConsentPrompt: true,
  accountName: '',
  iosClientId: IOSCLIENTID,
});

class SignInChoicesPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {
        backgroundColor: '#fff',
        shadowColor: '#fff',
        elevation: 0,
        borderBottomColor: '#fff',
        shadowOpacity: 0,
      },

      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    loading: false,
  };

  get_Response_Info = (error, result) => {
    if (error) {
      //Alert for the Error
      Alert.alert('Error fetching data: ' + error.toString());
    } else {
      //response alert
      alert(JSON.stringify(result));
      this.setState({user_name: 'Welcome' + ' ' + result.name});
      this.setState({token: 'User Token: ' + ' ' + result.id});
      this.setState({profile_pic: result.picture.data.url});
    }
  };

  facebookSignIn = () => {
    let that = this;
    LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ]).then(
      function(result) {
        if (result.isCancelled) {
          ShowMessage(type.ERROR, 'Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(async data => {
            const {accessToken} = data;
            // that.setState({loading: true});
            const res = await that.props.client.mutate({
              mutation: FACEBOOK_SIGNIN,
              variables: {accessToken},
            });
            const {token} = res.data.signInWithFacebook;
            await AsyncStorage.setItem(AUTH_TOKEN, token);
            that.setState({loading: false});
            that.props.navigation.navigate('Home');
          });
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
        this.setState({loading: false});
        ShowMessage(type.ERROR, `Login failed with error: ${error}`);
      },
    );
  };

  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    this.setState({isLoginScreenPresented: !isSignedIn});
  };

  signOut = async () => {
    if (this.isSignedIn()) {
      try {
        await this.revokeAccess();
        await GoogleSignin.signOut();
        this.setState({user: null}); // Remember to remove the user from your app's state as well
      } catch (error) {
        console.error(error);
      }
    }
  };

  googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {idToken} = userInfo;
      this.setState({loading: true});
      const res = await this.props.client.mutate({
        mutation: GOOGLE_SIGNIN,
        variables: {data: {idToken}},
      });
      const {token} = res.data.signInWithGoogle;
      console.log(token, 'token');
      await AsyncStorage.setItem(AUTH_TOKEN, token);
      this.setState({loading: false});
      this.props.navigation.navigate('Home');
    } catch (error) {
      this.setState({loading: false});
      console.log(error.code, error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services');
      } else {
        console.log(error.code);
      }
    }
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <ActivityIndicatorPage />
        ) : (
          <SigningChoices
            googleText="Sign in with Google    "
            googleButtonFunction={this.googleSignIn}
            facebookText="Sign in with Facebook"
            facebookButtonFunction={this.facebookSignIn}
            customText="Sign in with email address"
            customButtonFunction={() =>
              this.props.navigation.navigate('SignInEmail')
            }
          />
        )}
      </>
    );
  }
}

export default withApollo(SignInChoicesPage);
