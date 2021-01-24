/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from 'react-native';
import shortid from 'shortid';
import {Searchbar} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import {nhsData} from '../../nhsData';
import {
  CONDITION_LIBRARY_SEARCH,
  NHS_SUBSCRIPTION_KEY,
  RECENT_CONDITIONS,
} from 'react-native-dotenv';
import ActivityIndicatorPage from '../App/ActivityIndicatorPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HeaderLeft} from '../../Components/HeaderLeft';
import FastImage from 'react-native-fast-image';
import {debounce} from 'throttle-debounce';
import {IMAGE_URL} from '../../store/constants/Api';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 1.1,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginVertical: 10,
    marginHorizontal: 12,
  },
  imageIcon: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    alignSelf: 'center',
  },
  imageIconSmall: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    alignSelf: 'center',
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'muli-regular',
    marginVertical: 5,
    marginHorizontal: 15,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    paddingBottom: 20,
    textAlign: 'center',
    width: '100%',
    alignSelf: 'baseline',
  },
  card: {
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    ...elevationShadowStyle(3),
    shadowColor: 'rgba(196, 196, 196, 0.4)',
  },
  cardInner: {
    paddingTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 150,
    height: 180,
    alignItems: 'center',
  },
  cardImageContainer: {
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardImageContainerSmall: {
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  listInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 0.4)',
  },
  listTitle: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    marginTop: 5,
    marginLeft: 20,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

class ItemCard extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        underlayColor="rgba(0, 0, 0, 0.03)"
        onPress={this.props.onPress}>
        <View style={styles.card} key={this.props.id}>
          <View style={styles.cardInner}>
            <View style={styles.cardImageContainer}>
              <FastImage
                style={styles.imageIcon}
                source={{
                  uri: `${IMAGE_URL}76e81e74-908d-4838-89c6-0ec810e21982.jpeg`,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <Text style={styles.cardHeaderText}>{this.props.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

class Item extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        underlayColor="rgba(0, 0, 0, 0.03)"
        onPress={this.props.onPress}>
        <View key={this.props.id} style={styles.listInner}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <View style={styles.cardImageContainerSmall}>
              <FastImage
                style={styles.imageIconSmall}
                source={{
                  uri: `${IMAGE_URL}76e81e74-908d-4838-89c6-0ec810e21982.jpeg`,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <Text style={styles.listTitle}>{this.props.title}</Text>
          </View>
          <Icon
            type="material-community"
            name="chevron-right"
            color="#A6A4A4"
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default class ConditionLibraryPage extends React.Component {
  componentDidMount() {
    this.getAsyncData();
  }

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
      query: '',
      listOptions: nhsData.map(data => ({
        title: data.name.split('(')[0],
        icon: require('../../assets/condition.png'),
        onPress: async () => {
          //Send data to async
          this.keepAsyncData({
            title: data.name,
            url: data.url,
          });
          this.props.navigation.navigate('ConditionLibraryDetail', {
            title: data.name.split('(')[0],
            url: data.url,
          });
        },
      })),
      isFetching: false,
      queryResponse: [],
      recentlyRead: [],
      loading: false,
    };
    this.query = debounce(500, this.runQuery);
  }

  getAsyncData = async () => {
    var data = await AsyncStorage.getItem(RECENT_CONDITIONS);
    if (data) this.setState({recentlyRead: JSON.parse(data)});
    return data;
  };

  keepAsyncData = async data => {
    var current = await this.getAsyncData();
    if (current) {
      current = JSON.parse(current);
      var index = current.findIndex(x => x.title == data.title);
      if (current.length >= 6 && index === -1) current.shift();
      index === -1 ? current.push(data) : null;
      console.log(current);
      await AsyncStorage.setItem(RECENT_CONDITIONS, JSON.stringify(current));
    } else {
      await AsyncStorage.setItem(RECENT_CONDITIONS, JSON.stringify([data]));
    }
  };

  handleChange = query => {
    this.setState({query}, () => this.query(this.state.query));
  };

  runQuery = query => {
    Keyboard.dismiss();
    var myHeaders = new Headers();
    this.setState({isFetching: true, queryResponse: []});
    myHeaders.append('subscription-key', NHS_SUBSCRIPTION_KEY);
    fetch(CONDITION_LIBRARY_SEARCH + query, {
      headers: myHeaders,
    })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(({significantLink}) => {
        this.setState({queryResponse: significantLink, isFetching: false});
      })
      .catch(e => console.log(e));
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <ActivityIndicatorPage />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            nestedScrollEnabled={true}>
            <View style={{marginStart: 10, marginEnd: 10}}>
              <Text style={styles.headerText}>Condition library</Text>
              <Text style={styles.sectionHeader}>EXPLORE</Text>
              <View>
                <FlatList
                  nestedScrollEnabled={true}
                  data={this.state.listOptions}
                  initialNumToRender={5}
                  maxToRenderPerBatch={15}
                  getItemLayout={(data, index) => ({
                    length: 100,
                    offset: 50 * index,
                    index,
                  })}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{marginHorizontal: 10, marginVertical: 5}}
                  keyExtractor={() => shortid.generate()}
                  renderItem={({item}) => {
                    return (
                      <ItemCard
                        id={shortid.generate()}
                        title={item.title}
                        onPress={item.onPress}
                      />
                    );
                  }}
                />
              </View>
              <View
                style={{
                  marginHorizontal: 15,
                  marginVertical: 5,
                  paddingBottom: 10,
                }}>
                <Searchbar
                  placeholder="Search"
                  onChangeText={query => this.handleChange(query)}
                  value={this.state.query}
                />
                {this.state.query != '' ? (
                  <View>
                    {this.state.isFetching ? (
                      <ActivityIndicator style={{marginVertical: 10}} />
                    ) : (
                      <View>
                        <FlatList
                          nestedScrollEnabled={true}
                          data={this.state.queryResponse}
                          keyExtractor={() => shortid.generate()}
                          style={{marginHorizontal: 10}}
                          renderItem={({item}) => {
                            return (
                              <Item
                                id={shortid.generate()}
                                title={item.name}
                                onPress={() => {
                                  this.keepAsyncData({
                                    title: item.name,
                                    url: item.url,
                                  });
                                  return this.props.navigation.navigate(
                                    'ConditionLibraryDetail',
                                    {
                                      title: item.name,
                                      url: item.url,
                                    },
                                  );
                                }}
                              />
                            );
                          }}
                        />
                      </View>
                    )}
                  </View>
                ) : null}
              </View>
              {this.state.recentlyRead.length > 0 && (
                <Text style={styles.sectionHeader}>RECENTLY READ</Text>
              )}
              <View>
                <FlatList
                  nestedScrollEnabled={true}
                  data={this.state.recentlyRead}
                  keyExtractor={() => shortid.generate()}
                  style={{marginHorizontal: 10}}
                  renderItem={({item}) => {
                    return (
                      <Item
                        id={shortid.generate()}
                        title={item.title}
                        onPress={() =>
                          this.props.navigation.navigate(
                            'ConditionLibraryDetail',
                            {
                              title: item.title,
                              url: item.url,
                            },
                          )
                        }
                      />
                    );
                  }}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </>
    );
  }
}
