/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight} from 'react-native';
import {Icon} from 'react-native-elements';
import {FloatingAction} from 'react-native-floating-action';
import shortid from 'shortid';
import ListScrollView from '../../Components/ListScrollView';
import {UserContext} from '../../store/context/UserContext';
import {date2} from '../../Utils/dateFormater';
import {Query} from 'react-apollo';
import {MEPOST} from '../../QueryAndMutation';
import ActivityIndicatorPage from './ActivityIndicatorPage';
import {HeaderLeft} from '../../Components/HeaderLeft';
import FastImage from 'react-native-fast-image';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
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
  cardBodyText: {
    color: '#555555',
    fontFamily: 'Muli-Bold',
    fontSize: 14,
  },
  cardTimeText: {
    color: 'rgba(85, 85, 85, 0.8)',
    fontFamily: 'Muli-Regular',
    fontSize: 12,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 18,
    marginBottom: 1,
  },
  imageIcon: {
    maxHeight: 65,
    maxWidth: 65,
    alignSelf: 'center',
  },
  careCard: {
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    ...elevationShadowStyle(4),
  },
  careCardInner: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: 65,
    height: 65,
    borderRadius: 40,
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class FamilyListPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      appointmentIcon: require('../../assets/notification-appointment.png'),
      forumIcon: require('../../assets/notification-forum.png'),
      listOptions: [
        {
          name: 'Buhari Hassan',
          gender: 'Male',
          age: '6 years old',
          dob: '11/11/2019',
          image: require('../../assets/user-default.png'),
        },
        {
          name: 'Khalid Hassan',
          gender: 'Male',
          age: '7 years old',
          image: require('../../assets/user-default.png'),
        },
      ],
    };
  }

  render() {
    const run = families =>
      families.map(d => {
        const {firstName, lastName, dateOfBirth, gender, photo} = d;
        console.log(d, 'photo')
        const fullName = `${firstName} ${lastName}`;
        return (
          <View style={styles.careCard} key={shortid.generate()}>
            <TouchableHighlight
              underlayColor="rgba(0, 0, 0, 0.03)"
              onPress={() => {
                this.props.navigation.navigate('FamilyDetail', {
                  user: d,
                  fullName,
                });
              }}>
              <View style={styles.careCardInner}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <View style={styles.cardImageContainer}>
                    {photo && photo.original ? (
                      <FastImage
                        style={{width: 65, height: 65, borderRadius: 150}}
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
                </View>

                <View style={styles.cardText}>
                  <View>
                    <Text style={styles.cardHeaderText}>{fullName}</Text>
                    <Text style={styles.cardBodyText}>{gender}</Text>
                    <Text style={styles.cardTimeText}>
                      {date2(dateOfBirth)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        );
      });

    return (
      <Query query={MEPOST}>
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return console.log('error');
          return (
            <View style={styles.container}>
              <ListScrollView
                emptyIcon={require('../../assets/empty-family.png')}
                emptyMessage="You do not have any family member added. Tap the round button at the bottom of your screen to add one."
                title="Family"
                listItems={run(data.me.families)}
              />
              <FloatingAction
                color="#1B2CC1"
                onPressItem={() => {
                  this.props.navigation.navigate('FamilyQuestions');
                }}
                distanceToEdge={20}
                overrideWithAction
                actions={[
                  {
                    text: 'Next',
                    name: 'bt_next',
                    icon: (
                      <Icon
                        type="material-community"
                        name="plus"
                        color="#fff"
                      />
                    ),
                    position: 1,
                  },
                ]}
                floatingIcon={
                  <Icon type="material-community" name="plus" color="#fff" />
                }
              />
            </View>
          );
        }}
      </Query>
    );
  }
}
