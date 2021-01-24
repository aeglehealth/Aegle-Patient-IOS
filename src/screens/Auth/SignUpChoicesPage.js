import React from 'react';
import SigningChoices from '../../Components/SigningChoices';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import {GOOGLE_SIGNUP, FACEBOOK_SIGNUP} from '../../QueryAndMutation';
import {withApollo} from 'react-apollo';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityIndicatorPage from '../App/ActivityIndicatorPage';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
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

class SignUpChoicesPage extends React.Component {
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
          this.setState({loading: false});
        } else {
          try {
            AccessToken.getCurrentAccessToken().then(async data => {
              const {accessToken} = data;
              // that.setState({loading: true});
              const res = await that.props.client.mutate({
                mutation: FACEBOOK_SIGNUP,
                variables: {accessToken},
              });
              if (res) {
                const {token} = res.data.signUpWithFacebook;
                await AsyncStorage.setItem(AUTH_TOKEN, token);
                that.setState({loading: false});
                that.props.navigation.navigate('OauthNumberPage', {
                  route: 'auth',
                });
              } else {
                console.log('start');
                that.setState({loading: false});
              }
            });
          } catch (err) {
            console.log('end');
            this.setState({loading: false});
          }
        }
      },
      function(error) {
        this.setState({loading: false});
        ShowMessage(type.ERROR, error);
      },
    );
  };

  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    this.setState({isLoginScreenPresented: !isSignedIn});
    console.log(isSignedIn, 'fdvbg');
  };

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo});
      const {idToken} = userInfo;
      this.setState({loading: true});
      const res = await this.props.client.mutate({
        mutation: GOOGLE_SIGNUP,
        variables: {data: {idToken}},
      });
      const {token} = res.data.signUpWithGoogle;
      await AsyncStorage.setItem(AUTH_TOKEN, token);
      this.setState({loading: false});
      this.props.navigation.navigate('OauthNumberPage', {route: 'auth'});
    } catch (error) {
      this.setState({loading: false});
      console.log(error.code);
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
            googleText="Sign up with Google    "
            googleButtonFunction={this.signIn}
            facebookText="Sign up with Facebook"
            facebookButtonFunction={this.facebookSignIn}
            customText="Sign up with email address"
            customButtonFunction={() =>
              this.props.navigation.navigate('SignUpEmail')
            }
          />
        )}
      </>
    );
  }
}

export default withApollo(SignUpChoicesPage);
