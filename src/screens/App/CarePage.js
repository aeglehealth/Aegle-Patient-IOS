import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Header} from 'react-native-elements';
import shortid from 'shortid';
import {Query} from 'react-apollo';
import {MEPOST} from '../../QueryAndMutation';
import ActivityIndicatorPage from './ActivityIndicatorPage';

function elevationShadowStyle(elevation) {
  return {
    shadowColor: 'rgba(196, 196, 196, 0.4)',
    shadowOpacity: 0.5,
    shadowRadius: elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  bodyText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 5,
  },
  cardBodyText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
  },
  imageIcon: {
    maxHeight: 35,
    maxWidth: 35,
    alignSelf: 'center',
  },
  headerImageIcon: {
    maxHeight: 25,
    maxWidth: 25,
    alignSelf: 'center',
    marginStart: 30,
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
  },
  careCardIOS: {
    borderColor: 'rgba(196, 196, 196, 0)',
    borderWidth: 2,
    borderRadius: 20,
    marginVertical: 10,
    ...elevationShadowStyle(20),
  },
  careCardAndroid: {
    borderColor: 'rgba(196, 196, 196, 0.4)',
    borderWidth: 2,
    borderRadius: 6,
    marginVertical: 10,
  },
  careCardInner: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#0066F5',
    width: 65,
    height: 65,
    borderRadius: 40,
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
});

const CARD_STYLE =
  Platform.OS === 'ios' ? styles.careCardIOS : styles.careCardAndroid;

export default class CarePage extends React.Component {
  state = {
    careOptions: [
      {
        title: 'Talk to a doctor',
        description: 'Schedule a Chat or a Call with a Doctor',
        image: require('../../assets/care-icon-phone.png'),
        onPress: () => {
          this.props.navigation.navigate('TalkToDoctor');
        },
      },
      {
        title: 'Monitor your health',
        description: 'Track your clinical records',
        image: require('../../assets/care-icon-heartbeat.png'),
        onPress: () => {
          this.props.navigation.navigate('MonitorHealthStart');
        },
      },
      // {
      //   title: 'My Prescriptions',
      //   description: 'Manage your prescription',
      //   image: require('../../assets/care-icon-prescription.png'),
      //   onPress: () => {
      //     this.props.navigation.navigate('PrescriptionsList');
      //   },
      // },
      {
        title: 'Condition Library',
        description: 'Read more about different conditions',
        image: require('../../assets/care-icon-library.png'),
        onPress: () => {
          this.props.navigation.navigate('ConditionLibrary');
        },
      },
      {
        title: 'My Assessments',
        description: 'Manage your assessments',
        image: require('../../assets/care-icon-assessment.png'),
        onPress: data => {
          this.props.navigation.navigate('MyAssessments', {data});
        },
      },
    ],
  };

  render() {
    return (
      // <UserContext.Consumer>
      //   {({data}) => {
      <Query query={MEPOST}>
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return console.log('error');
          const profile = data && data.me.profile;
          return (
            <View style={styles.container}>
              <Header
                containerStyle={styles.headerContainer}
                barStyle="dark-content"
                centerContainerStyle={{marginLeft: -5}}
                rightComponent={
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('MentalAssessment', {
                        me: data.me,
                      });
                    }}
                    underlayColor="rgba(0,0,0,0.01)">
                    <Image
                      style={styles.headerImageIcon}
                      source={require('../../assets/brain.png')}
                    />
                  </TouchableOpacity>
                }
              />
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{marginHorizontal: 15}}>
                <View>
                  <Text style={styles.headerText}>Care</Text>
                  <Text style={styles.bodyText}>
                    Hello {data && profile.firstName},{'\n'}What would you like
                    to do today?
                  </Text>
                </View>
                <View style={{marginBottom: 50}}>
                  {this.state.careOptions.map(d => {
                    return (
                      <View style={CARD_STYLE} key={shortid.generate()}>
                        <TouchableOpacity
                          underlayColor="rgba(0, 0, 0, 0.03)"
                          onPress={() => d.onPress(data)}>
                          <View style={styles.careCardInner}>
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                              }}>
                              <View style={styles.cardImageContainer}>
                                <Image
                                  style={styles.imageIcon}
                                  source={d.image}
                                />
                              </View>
                            </View>

                            <View style={styles.cardText}>
                              <View>
                                <Text style={styles.cardHeaderText}>
                                  {d.title}
                                </Text>
                                <Text style={styles.cardBodyText}>
                                  {d.description}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          );
        }}
      </Query>
      //   }}
      // </UserContext.Consumer>
    );
  }
}
