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
import {HeaderLeft} from '../../Components/HeaderLeft';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
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
    marginHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
  },
  listTitle: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    marginTop: 5,
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

export default class AboutPage extends React.Component {
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
        title: 'FAQs',
        icon: require('../../assets/accounts-about.png'),
        onPress: () => {
          this.openUrl('https://aeglehealth.io/faq');
        },
      },
      {
        title: 'Contact Us',
        icon: require('../../assets/accounts-contact.png'),
        onPress: () => {
          this.openUrl('https://aeglehealth.io/contact');
        },
      },
      {
        title: 'Rate Aegle App',
        icon: require('../../assets/accounts-star.png'),
        onPress: () => {},
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
              <Text style={styles.headerText}>About</Text>
              <Text style={styles.bodyText}>
                We’re here to make healthcare work for everyone. To learn more
                on how we strive to ensure you experience healthcare without the
                fuss, visit{' '}
                <Text
                  style={{textDecorationLine: 'underline'}}
                  onPress={() =>
                    Linking.openURL('https://aeglehealth.io/about')
                  }>
                  https://aeglehealth.io/about{' '}
                </Text>
              </Text>
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
        />
      </View>
    );
  }
}
