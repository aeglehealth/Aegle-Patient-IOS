/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  FlatList,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import shortid from 'shortid';
import {Icon, Header} from 'react-native-elements';
import {Query} from 'react-apollo';
import {MEPOST} from '../../QueryAndMutation';
import ActivityIndicatorPage from './ActivityIndicatorPage';
import FastImage from 'react-native-fast-image';
function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

function Item({id, title, icon, onPress}) {
  return (
    <TouchableHighlight
      key={id}
      underlayColor="rgba(0, 0, 0, 0.03)"
      onPress={onPress}>
      <View style={styles.listInner}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <View style={styles.cardImageContainerSmall}>
            <Image style={styles.imageIconSmall} source={icon} />
          </View>
          <Text style={styles.listTitle}>{title}</Text>
        </View>
        <Icon type="material-community" name="chevron-right" color="#A6A4A4" />
      </View>
    </TouchableHighlight>
  );
}

export default class AccountsPage extends React.Component {
  state = {
    query: '',
    listOptions: [
      {
        title: 'Clinical Records',
        icon: require('../../assets/accounts-records.png'),
        onPress: () => {
          this.props.navigation.navigate('ClinicalRecords');
        },
      },
      {
        title: 'Family',
        icon: require('../../assets/accounts-family.png'),
        onPress: () => {
          this.props.navigation.navigate('FamilyList');
        },
      },
      {
        title: 'Subscription',
        icon: require('../../assets/accounts-subscription.png'),
        onPress: () => {
          this.props.navigation.navigate('Subscription');
        },
      },
      {
        title: 'Membership',
        icon: require('../../assets/accounts-membership.png'),
        onPress: () => {
          // this.props.navigation.navigate('MembershipType');
        },
      },
      {
        title: 'About Aegle',
        icon: require('../../assets/accounts-about.png'),
        onPress: () => {
          this.props.navigation.navigate('About');
        },
      },
    ],
  };

  handleRenderItem = item => {
    return (
      <Item
        id={shortid.generate()}
        title={item.title}
        icon={item.icon}
        onPress={item.onPress}
      />
    );
  };

  render() {
    return (
      <Query query={MEPOST} fetchPolicy="network-only">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return console.log('error');
          const me = data.me ? data.me : null;
          const {
            profile: {photo},
          } = me;
          console.log(photo, 'jjjjj');
          return (
            <>
              <View style={{flex: 1}}>
                <Header
                  containerStyle={styles.headerContainer}
                  barStyle="dark-content"
                  rightComponent={
                    <TouchableHighlight
                      onPress={() => {
                        this.props.navigation.navigate('Settings');
                      }}
                      underlayColor="rgba(0,0,0,0.02)">
                      <Image
                        style={styles.headerImageIcon1}
                        source={require('../../assets/accounts-cog.png')}
                      />
                    </TouchableHighlight>
                  }
                />

                <View style={styles.profileCard}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.props.navigation.navigate('ShowImage', {
                        image: photo.thumbnail,
                      });
                    }}>
                    <View>
                      {photo && photo.original ? (
                        <FastImage
                          style={styles.headerImageIcon}
                          source={{
                            uri: photo.thumbnail,
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      ) : (
                        <Image
                          style={styles.headerImageIcon}
                          source={require('../../assets/user-default-white.png')}
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                  <Text style={styles.profileName}>
                    {me.profile.lastName + ' ' + me.profile.firstName}
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.props.navigation.navigate('Profile', {
                        user: me,
                      });
                    }}>
                    <View style={styles.profileButton}>
                      <Text style={styles.profileButtonText}>EDIT PROFILE</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>

                <FlatList
                  style={{flex: 1}}
                  data={this.state.listOptions}
                  keyExtractor={() => shortid.generate()}
                  renderItem={({item}) => this.handleRenderItem(item)}
                />
              </View>
            </>
          );
        }}
      </Query>
    );
  }
}

const styles = StyleSheet.create({
  imageIconSmall: {
    maxHeight: 25,
    maxWidth: 25,
    alignSelf: 'center',
  },
  cardImageContainerSmall: {
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  listInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
  },
  listTitle: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    marginTop: 5,
    marginLeft: 20,
    lineHeight: 20,
  },
  headerImageIcon: {
    height: 80,
    width: 80,
    borderRadius: 80 / 2,
    alignSelf: 'center',
  },
  headerImageIcon1: {
    maxHeight: 25,
    maxWidth: 25,
    alignSelf: 'center',
    marginRight: 20,
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    margin: -10,
  },
  profileImage: {
    height: 75,
    width: 75,
  },
  profileName: {
    color: '#fff',
    fontFamily: 'muli-regular',
    fontSize: 20,
    marginVertical: 10,
  },
  profileCard: {
    marginHorizontal: 15,
    marginVertical: 15,
    paddingTop: 30,
    paddingBottom: 25,
    paddingHorizontal: 15,
    backgroundColor: '#0066F5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevationShadowStyle(4),
    maxHeight: 175,
  },
  profileButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  profileButtonText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 12,
  },
});
