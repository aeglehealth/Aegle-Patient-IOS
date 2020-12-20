/* eslint-disable global-require */
import 'react-native-gesture-handler';
import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {StyleSheet, Text, View, Platform} from 'react-native';
import {Header} from 'react-native-elements';
import EditProfile from './EditProfilePage';
import EditProfileSecurity from './EditProfileSecurityPage';
import {HeaderLeft} from '../../Components/HeaderLeft';

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
    fontFamily: 'Muli-Bold',
    textAlign: 'left',
    flex: 1,
    fontSize: 32,
    marginTop: 5,
    width: '100%',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
    paddingTop: 0,
    paddingBottom: 0,
    height: Platform.select({
      android: 46,
      default: 50,
    }),
  },
  headerLeftContainerStyle: {flex: 5, paddingTop: 0, width: '100%'},
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
    const user = this.props.navigation.state.params.user;
    const {navigation} = this.props;
    class Profile extends React.Component {
      render() {
        return <EditProfile screenProps={{user}} />;
      }
    }

    class Security extends React.Component {
      render() {
        return <EditProfileSecurity screenProps={{user, navigation}} />;
      }
    }

    const TabNavigator = createMaterialTopTabNavigator(
      {
        Personal: {
          screen: Profile,
        },
        Security: {
          screen: Security,
        },
      },
      {
        tabBarOptions: {
          activeTintColor: '#0066F5',
          inactiveTintColor: '#828282',
          indicatorStyle: {
            height: 3,
            backgroundColor: '#0066F5',
          },
          labelStyle: {
            fontSize: 14,
            marginBottom: 0,
            fontFamily: 'Muli-Bold',
          },
          tabStyle: {
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
                    <Text style={styles.headerText}>Edit Profile</Text>
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
    return <AppContainer user={user} />;
  }
}
