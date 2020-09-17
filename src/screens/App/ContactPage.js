/* eslint-disable global-require */
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {HeaderLeft} from '../../Components/HeaderLeft';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 32,
    marginBottom: 15,
  },
  bodyText: {
    color: '#555555',
    fontFamily: 'muli-regular',
    fontSize: 20,
    textAlign: 'left',
    marginVertical: 5,
  },
  slides: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    maxHeight: 200,
  },
  gifImage: {
    maxHeight: 200,
    maxWidth: 300,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  contactLabelText: {
    color: '#555555',
    fontFamily: 'muli-regular',
    fontSize: 16,
    textAlign: 'center',
  },
  contactValueText: {
    color: '#1B2CC1',
    fontFamily: 'Muli-Bold',
    fontSize: 22,
    textAlign: 'center',
  },
  connectText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default class ContactPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  openUrl = async url => {
    await Linking.openURL(url);
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.headerText}>Contact Us</Text>
          <Text style={styles.bodyText}>You can contact us at any time.</Text>
          <View style={styles.slides}>
            <Image
              style={styles.gifImage}
              source={require('../../assets/contact-screen.gif')}
            />
          </View>
          <View
            style={{alignContent: 'center', marginBottom: 20, marginTop: 10}}>
            <Text style={styles.contactLabelText}>
              Our email is always open
            </Text>
            <Text style={styles.contactValueText}>support@aeglehealth.io</Text>
          </View>
          <View
            style={{
              alignContent: 'center',
              marginBottom: 20,
              paddingBottom: 15,
              borderBottomColor: 'rgba(196, 196, 196, 0.5)',
              borderBottomWidth: 1,
            }}>
            <Text style={styles.contactLabelText}>
              You can also give us a call on
            </Text>
            <Text style={styles.contactValueText}>+234 700 123 4511 111</Text>
          </View>
          <View>
            <Text style={styles.connectText}>Connect with us on</Text>
            <View
              style={{
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.openUrl('https://www.facebook.com/aeglehealth.io/')
                }>
                <Image
                  style={{width: 40, height: 40}}
                  source={require('../../assets/contact-facebook.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.openUrl('https://twitter.com/Aeglehealth_io')
                }>
                <Image
                  style={{width: 40, height: 40}}
                  source={require('../../assets/contact-twitter.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.openUrl('https://www.instagram.com/aeglehealth.io/')
                }>
                <Image
                  style={{width: 40, height: 40}}
                  source={require('../../assets/contact-instagram.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
