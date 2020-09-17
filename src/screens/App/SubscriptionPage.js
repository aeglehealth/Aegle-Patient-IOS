/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ImageBackground,
  TouchableHighlight,
} from 'react-native';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {Query} from 'react-apollo';
import {ACTIVE_SUBSCRIPTION} from '../../QueryAndMutation';
import FastImage from 'react-native-fast-image';
import {
  capitalize,
  capitalizeEachWord,
} from '../../Utils/capitalizeFirstLetter';
import ActivityIndicatorPage from './ActivityIndicatorPage';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'rgba(196, 196, 196, 0.8)',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  bodyText: {
    color: '#555',
    fontFamily: 'muli-regular',
    fontSize: 16,
    marginBottom: 30,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 10,
  },
  cardBodyText: {
    color: '#000',
    fontFamily: 'muli-regular',
    fontSize: 16,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 20,
  },
  imageIcon: {
    height: 65,
    width: 65,
    alignSelf: 'center',
    borderRadius: 65 / 2,
  },
  careCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    ...elevationShadowStyle(6),
  },
  cardImageContainer: {
    alignSelf: 'center',
    maxHeight: 65,
    maxWidth: 65,
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  buttonBigStyle: {
    backgroundColor: '#0066F5',
    borderRadius: 5,
    marginBottom: 10,
    paddingVertical: 25,
    justifyContent: 'flex-start',
    paddingLeft: 20,
    overflow: 'hidden',
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 26,
    fontFamily: 'Muli-Bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

class SubscriptionPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Query query={ACTIVE_SUBSCRIPTION} fetchPolicy="cache-and-network">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return console.log('error');
          const me = data.me ? data.me : null;
          const {
            profile: {photo},
            local: {email},
          } = me;
          const {activeUserSubscriptions} = data;
          return (
            <View style={styles.container}>
              <ScrollView
                style={{marginHorizontal: 15}}
                showsVerticalScrollIndicator={false}>
                <View>
                  <Text style={styles.headerText}>Subscription</Text>
                  <Text style={styles.bodyText}>
                    We offer multiple pricing plans to ensure everyone can
                    benefit from our services. You must have an active
                    subscription to book an appointment with a doctor.
                  </Text>
                </View>
                <View>
                  <ImageBackground
                    source={require('../../assets/btn-bg.jpg')}
                    style={styles.buttonBigStyle}>
                    <TouchableHighlight
                      onPress={() => {
                        this.props.navigation.navigate('SubscriptionPlans', {
                          email,
                          activeUserSubscriptions,
                          route: 'app',
                        });
                      }}
                      underlayColor="rgba(0,0,0,0.01)">
                      <View>
                        <Text style={styles.buttonTextStyle}>
                          Tap here to upgrade subscription plan
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </ImageBackground>
                </View>
                <Text
                  style={{
                    fontFamily: 'muli-regular',
                    fontSize: 14,
                    marginVertical: 10,
                  }}>
                  MAIN ACCOUNT
                </Text>
                <View style={styles.careCard}>
                  <View style={styles.cardImageContainer}>
                    {photo && photo.original ? (
                      <FastImage
                        style={styles.imageIcon}
                        source={{
                          uri: photo.thumbnail,
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : (
                      <Image
                        style={styles.imageIcon}
                        source={require('../../assets/user-default.png')}
                      />
                    )}
                  </View>

                  <View style={styles.cardText}>
                    <Text style={styles.cardHeaderText}>
                      {me.profile.lastName + ' ' + me.profile.firstName}
                    </Text>
                    {activeUserSubscriptions.length == 0 ? (
                      <Text style={styles.cardBodyText}>No Subscription</Text>
                    ) : (
                      activeUserSubscriptions.map((subscription, i) => (
                        <>
                          {subscription.renew && (
                            <Text style={styles.cardBodyText} key={i}>
                              {'\u25CF'}
                              {`${capitalize(
                                subscription.entity,
                              )} Plan - ${capitalizeEachWord(
                                subscription.name,
                              )}`}
                              {'\n'}
                            </Text>
                          )}
                        </>
                      ))
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          );
        }}
      </Query>
    );
  }
}

export default SubscriptionPage;
