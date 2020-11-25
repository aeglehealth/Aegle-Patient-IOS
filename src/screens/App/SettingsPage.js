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
  Linking,
} from 'react-native';
import shortid from 'shortid';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {withApollo} from 'react-apollo';
import {AUTH_TOKEN} from 'react-native-dotenv';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    marginHorizontal: 15,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 15,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  imageIconSmall: {
    maxHeight: 30,
    maxWidth: 30,
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
    marginHorizontal: 5,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
  },
  listTitle: {
    color: '#000',
    fontFamily: 'muli-bold',
    fontSize: 18,
    marginTop: 5,
  },
  buttonStyle: {
    backgroundColor: '#fff',
    marginVertical: 40,
    paddingVertical: 10,
    borderColor: '#1B2CC1',
    borderWidth: 1,
  },
  buttonTitleStyle: {
    color: '#1B2CC1',
    fontSize: 20,
    fontFamily: 'muli-bold',
  },
});

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
          <Text style={styles.listTitle}>{title}</Text>
        </View>
        <View style={styles.cardImageContainerSmall}>
          <Image style={styles.imageIconSmall} source={icon} />
        </View>
      </View>
    </TouchableHighlight>
  );
}

class SettingsPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    listOptions: [
      {
        title: 'Terms and Conditions',
        icon: require('../../assets/accounts-membership.png'),
        onPress: () => {
          this.openUrl('https://aeglehealth.io/terms-of-use');
        },
      },
      {
        title: 'Privacy Policy',
        icon: require('../../assets/accounts-membership.png'),
        onPress: () => {
          this.openUrl('https://aeglehealth.io/privacy');
        },
      },
    ],
  };

  openUrl = async url => {
    await Linking.openURL(url);
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <View>
              <Text style={styles.headerText}>Settings</Text>
            </View>
          }
          data={this.state.listOptions}
          keyExtractor={() => shortid.generate()}
          style={{
            marginTop: 10,
            borderTopColor: 'rgba(196, 196, 196, 0.5)',
          }}
          renderItem={({item}) => {
            return (
              <Item
                id={shortid.generate()}
                title={item.title}
                icon={item.icon}
                onPress={item.onPress}
              />
            );
          }}
          ListFooterComponent={
            <Button
              type="outline"
              title="LOG OUT"
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={() => {
                this.props.client.resetStore() &&
                  AsyncStorage.removeItem(AUTH_TOKEN) &&
                  this.props.navigation.navigate('SignInEmail');
              }}
            />
          }
        />
      </View>
    );
  }
}

export default withApollo(SettingsPage);
