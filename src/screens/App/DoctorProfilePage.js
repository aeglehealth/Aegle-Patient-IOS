/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import ActivityIndicatorPage from './ActivityIndicatorPage';
import {capitalizeEachWord} from '../../Utils/capitalizeFirstLetter';

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
  headerStyle: {
    backgroundColor: '#2F80ED',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#2F80ED',
    shadowOpacity: 0,
  },
  headerExt: {
    backgroundColor: '#2F80ED',
    height: 80,
  },
  cardBodyText: {
    color: '#555555',
    fontFamily: 'muli-bold',
    fontSize: 14,
  },
  cardTimeText: {
    color: '#C4C4C4',
    fontFamily: 'Muli-Regular',
    fontSize: 12,
    marginRight: 5,
    flexWrap: 'wrap',
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 18,
    marginBottom: 1,
  },
  headerCard: {
    marginTop: -30,
    flexDirection: 'row',
  },
  careCard: {
    borderRadius: 5,
    marginVertical: 10,
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    ...elevationShadowStyle(5),
  },
  cardImage: {
    flex: 0.3,
    justifyContent: 'center',
    alignContent: 'center',
    marginRight: 10,
  },
  cardImageContainer: {
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 5,
    marginBottom: 20,
  },
  imageIcon: {
    height: 80,
    width: 80,
    alignSelf: 'center',
  },
  cardText: {
    flex: 0.7,
    justifyContent: 'space-between',
    paddingLeft: 5,
  },
  statsText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
  },
  statsTextLabel: {
    color: '#979797',
    fontFamily: 'Muli-Regular',
    fontSize: 11,
  },
  rateButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#1B2CC1',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  rateButtonText: {
    fontFamily: 'Muli-Regular',
    fontSize: 14,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'muli-bold',
    marginVertical: 10,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    color: '#979797',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    color: '#1B2CC1',
  },
  subValueText: {
    fontSize: 12,
    fontFamily: 'Muli-Regular',
    color: '#828282',
  },
  cardViewItem: {
    marginBottom: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  doctorsProfileText: {
    fontSize: 32,
    fontFamily: 'Muli-ExtraBold',
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: -90,
    marginLeft: 22,
    position: 'absolute',
  },
});

export default class DoctorProfilePage extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
    headerTintColor: '#fff',
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {
        medics: {},
        loading: false,
        rating: 4,
        patients: 1450,
        points: 2230,
      },
    };
  }

  componentDidMount() {
    const routeObject = this.props.navigation.getParam('medicalDetails', {});
    const medics = JSON.parse(routeObject);
    this.setState({medics, loading: true});
  }

  render() {
    const {user, medics, loading} = this.state;
    const profile = medics && medics.profile;
    const doctorFullName =
      profile && `${profile.firstName} ${profile.lastName}`;
    console.log(profile, 'prof');
    const photo = profile && profile.photo;

    const rating = (
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.cardTimeText}>{user.rating.toFixed(1)}</Text>
        <Icon
          type="material-community"
          name="star"
          size={14}
          color={user.rating > 0 ? '#FAC917' : '#DADADA'}
        />
        <Icon
          type="material-community"
          name="star"
          size={14}
          color={user.rating > 1 ? '#FAC917' : '#DADADA'}
        />
        <Icon
          type="material-community"
          name="star"
          size={14}
          color={user.rating > 2 ? '#FAC917' : '#DADADA'}
        />
        <Icon
          type="material-community"
          name="star"
          size={14}
          color={user.rating > 3 ? '#FAC917' : '#DADADA'}
        />
        <Icon
          type="material-community"
          name="star"
          size={14}
          color={user.rating > 4 ? '#FAC917' : '#DADADA'}
        />
      </View>
    );

    return (
      <>
        {!loading ? (
          <ActivityIndicatorPage />
        ) : (
          <View>
            <View style={styles.headerExt} />
            <View style={{paddingHorizontal: 25}}>
              <Text style={styles.doctorsProfileText}>
                Doctor&apos;s Profile
              </Text>
              <View style={[styles.careCard, styles.headerCard]}>
                <View style={styles.cardImage}>
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
                  {/* <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text style={styles.statsText}>1450</Text>
                  <Text style={styles.statsTextLabel}>Patients</Text>
                </View>
                <View>
                  <Text style={styles.statsText}>2230</Text>
                  <Text style={styles.statsTextLabel}>Points</Text>
                </View>
              </View> */}
                </View>

                <View style={styles.cardText}>
                  <View>
                    <Text style={styles.cardHeaderText}>{doctorFullName}</Text>
                    <Text style={[styles.cardBodyText, {color: '#1B2CC1'}]}>
                      {(profile.speciality &&
                        capitalizeEachWord(profile.speciality)) ||
                        '-'}
                    </Text>
                    {/* {rating} */}
                    <Text
                      style={[
                        styles.cardBodyText,
                        {fontSize: 12, width: '100%'},
                      ]}>
                      {profile.bio || '-'}
                    </Text>
                  </View>
                  {/* <View>
                    <Button
                      icon={
                        <Icon
                          type="material-community"
                          size={14}
                          name="star"
                          color="#fff"
                        />
                      }
                      title="Rate"
                      type="solid"
                      buttonStyle={styles.rateButton}
                      titleStyle={styles.rateButtonText}
                    />
                  </View> */}
                </View>
              </View>
            </View>
            <ScrollView
              style={{paddingHorizontal: 20, maxHeight: 550}}
              showsVerticalScrollIndicator={false}>
              <Text style={[styles.sectionHeader, {marginHorizontal: 5}]}>
                BIOGRAPHY
              </Text>
              <View style={[styles.careCard, {marginHorizontal: 5}]}>
                {/* <View style={styles.cardViewItem}>
                  <Text style={styles.labelText}>Current Place Of Work</Text>
                  <Text style={[styles.valueText]}>
                    {(profile.currentPlaceOfWork &&
                      profile.currentPlaceOfWork) ||
                      '-'}
                  </Text>
                </View> */}
                <View style={styles.cardViewItem}>
                  <Text style={styles.labelText}>Education</Text>
                  <Text style={[styles.valueText]}>
                    {profile.education || '-'}
                  </Text>
                </View>
                <View style={styles.cardViewItem}>
                  <Text style={styles.labelText}>Medical School</Text>
                  <Text style={styles.valueText}>
                    {(profile.medicalSchool && profile.medicalSchool.school) ||
                      '-'}
                  </Text>
                </View>
                {/* <View style={styles.cardViewItem}>
                  <Text style={styles.labelText}>Certification</Text>
                  <Text style={styles.valueText}>{user.certification}</Text>
                </View> */}
              </View>

              {/* <Text style={[styles.sectionHeader, {marginHorizontal: 5}]}>
            LOCATION
          </Text> */}
              {/* <View
            style={[
              styles.careCard,
              {height: 220, marginBottom: 150, marginHorizontal: 5},
            ]}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            />
          </View> */}
            </ScrollView>
          </View>
        )}
      </>
    );
  }
}
