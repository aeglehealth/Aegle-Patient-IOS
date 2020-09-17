/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
} from 'react-native';
import shortid from 'shortid';
import {Query} from 'react-apollo';
import {POSTS} from '../../QueryAndMutation';
import ActivityIndicatorPage from './ActivityIndicatorPage';

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
  cardHeaderText: {
    color: '#fff',
    fontFamily: 'Muli-Bold',
    fontSize: 17,
    marginBottom: 1,
    textAlign: 'center',
  },
  imageIcon: {
    maxHeight: 60,
    maxWidth: 60,
    alignSelf: 'center',
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    marginTop: 15,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  card: {
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...elevationShadowStyle(4),
  },
  cardInner: {
    paddingTop: 10,
    paddingHorizontal: 10,
    width: 145,
    height: 145,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageContainer: {
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 40,
    marginBottom: 10,
  },
  cardFooter: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  cardFooterText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Muli-Regular',
    marginVertical: 8,
    textAlign: 'center',
  },
  careCard: {
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 10,
    ...elevationShadowStyle(2),
    shadowColor: 'rgba(196, 196, 196, 0.4)',
  },
  careCardInner: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cardBrowseImageContainer: {
    justifyContent: 'center',
    width: 65,
    height: 65,
    overflow: 'hidden',
    borderRadius: 10,
  },
  cardCTText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  cardCTHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 20,
  },
  imageCTIcon: {
    maxHeight: 35,
    maxWidth: 35,
    alignSelf: 'center',
  },
});

function ItemCard({id, title, icon, color, onPress, data, normalize}) {
  return (
    <View style={[styles.card, {backgroundColor: color}]} key={id}>
      <TouchableHighlight
        underlayColor="rgba(0, 0, 0, 0.03)"
        onPress={() => onPress(data, title, normalize)}>
        <View style={styles.cardInner}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.cardImageContainer}>
              <Image style={styles.imageIcon} source={icon} />
            </View>
            <Text style={styles.cardHeaderText}>{title}</Text>
          </View>
        </View>
      </TouchableHighlight>
      <View style={styles.cardFooter}>
        <Text style={styles.cardFooterText}>{data.length}</Text>
      </View>
    </View>
  );
}

const CardIconView = props => {
  return (
    <View style={styles.careCard}>
      <TouchableWithoutFeedback
        onPress={() => props.onPress(props.data, props.title, props.normalize)}>
        <View style={styles.careCardInner}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <View
              style={[
                styles.cardBrowseImageContainer,
                {backgroundColor: props.color},
              ]}>
              {props.iconComponent ? (
                props.iconComponent
              ) : (
                <Image style={styles.imageCTIcon} source={props.icon} />
              )}
            </View>
          </View>

          <View style={styles.cardCTText}>
            <View>
              <Text style={styles.cardCTHeaderText}>{props.title}</Text>
              <Text style={styles.cardCTBodyText}>{props.data.length}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default class ConditionLibraryPage extends React.Component {
  state = {
    query: '',
    popular: [
      {
        title: '#General',
        normalize: 'GENERAL',
        color: '#0066F5',
        posts: '1,234 posts',
        icon: require('../../assets/tag-general.png'),
        onPress: (data, title, normalize) => {
          this.props.navigation.navigate('TaggedPost', [
            {data, title, normalize},
          ]);
        },
      },
      {
        title: '#Mentalhealth',
        normalize: 'MENTALHEALTH',
        color: '#3C58BF',
        posts: '1,234 posts',
        icon: require('../../assets/tag-mentalhealth.png'),
        onPress: (data, title, normalize) => {
          this.props.navigation.navigate('TaggedPost', [
            {data, title, normalize},
          ]);
        },
      },
      {
        title: '#Diseases',
        normalize: 'DISEASES',
        color: '#FF6F61',
        posts: '234 posts',
        icon: require('../../assets/tag-diseases.png'),
        onPress: (data, title, normalize) => {
          this.props.navigation.navigate('TaggedPost', [
            {data, title, normalize},
          ]);
        },
      },
    ],
    allTags: [
      {
        title: '#Nutrition',
        normalize: 'NUTRITION',
        color: '#03CCAA',
        posts: '234 posts',
        icon: require('../../assets/tag-nutrition.png'),
        onPress: (data, title, normalize) => {
          this.props.navigation.navigate('TaggedPost', [
            {data, title, normalize},
          ]);
        },
      },
      {
        title: '#General',
        normalize: 'GENERAL',
        color: '#0066F5',
        posts: '1,234 posts',
        icon: require('../../assets/tag-general.png'),
        onPress: (data, title, normalize) => {
          this.props.navigation.navigate('TaggedPost', [
            {data, title, normalize},
          ]);
        },
      },
      {
        title: '#Mentalhealth',
        normalize: 'MENTALHEALTH',
        color: '#3C58BF',
        posts: '1,234 posts',
        icon: require('../../assets/tag-mentalhealth.png'),
        onPress: (data, title, normalize) => {
          this.props.navigation.navigate('TaggedPost', [
            {data, title, normalize},
          ]);
        },
      },
      {
        title: '#Environment',
        normalize: 'ENVIRONMENT',
        color: '#01A7DC',
        posts: '1,234 posts',
        icon: require('../../assets/tag-mentalhealth.png'),
        onPress: (data, title, normalize) => {
          this.props.navigation.navigate('TaggedPost', [
            {data, title, normalize},
          ]);
        },
      },
      {
        title: '#Diseases',
        normalize: 'DISEASES',
        color: '#FF6F61',
        posts: '234 posts',
        icon: require('../../assets/tag-diseases.png'),
        onPress: (data, title, normalize) => {
          this.props.navigation.navigate('TaggedPost', [
            {data, title, normalize},
          ]);
        },
      },
    ],
  };

  render() {
    return (
      <View>
        <Query query={POSTS}>
          {({loading, error, data}) => {
            if (loading) return <ActivityIndicatorPage />;
            return (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionHeader}>POPULAR</Text>
                {console.log(
                  'We out here' +
                    data.getPosts.filter(item => item.tag == 'GENERAL'),
                )}
                <ScrollView
                  horizontal
                  style={{marginHorizontal: 10, marginVertical: 5}}
                  showsHorizontalScrollIndicator={false}>
                  {this.state.popular.map((item, key) => (
                    <ItemCard
                      id={shortid.generate()}
                      title={item.title}
                      normalize={item.normalize}
                      icon={item.icon}
                      color={item.color}
                      onPress={item.onPress}
                      data={data.getPosts.filter(
                        postItem => postItem.tag == item.normalize,
                      )}
                    />
                  ))}
                </ScrollView>

                <Text style={styles.sectionHeader}>BROWSE</Text>
                <View style={{paddingHorizontal: 10}}>
                  {this.state.allTags.map((item, key) => (
                    <CardIconView
                      title={item.title}
                      normalize={item.normalize}
                      posts={item.posts}
                      icon={item.icon}
                      color={item.color}
                      onPress={item.onPress}
                      data={data.getPosts.filter(
                        postItem => postItem.tag == item.normalize,
                      )}
                    />
                  ))}
                </View>
              </ScrollView>
            );
          }}
        </Query>
      </View>
    );
  }
}
