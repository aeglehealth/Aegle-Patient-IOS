/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import {Icon} from 'react-native-elements';
import shortid from 'shortid';
import {Query} from 'react-apollo';
import {MEPOST, GET_ALL_POSTS} from '../../QueryAndMutation';
import moment from 'moment';
import {LikePost} from './ForumPage';
import {Share} from 'react-native';
import EmptyContent from '../../Components/EmptyContent';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
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
  cardHeaderTime: {
    color: '#555',
    fontFamily: 'Muli-Regular',
    fontSize: 12,
  },
  imageIcon: {
    maxHeight: 65,
    maxWidth: 65,
    width: 65,
    height: 65,
    alignSelf: 'center',
  },
  bottomIcon: {
    maxHeight: 15,
    maxWidth: 15,
    alignSelf: 'center',
    marginRight: 5,
  },
  careCard: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  cardImageContainer: {
    justifyContent: 'center',
    width: 65,
    height: 65,
    overflow: 'hidden',
    borderRadius: 40,
  },
  cardText: {
    flex: 3.5,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 5,
  },
  tagText: {
    fontSize: 13,
    color: '#0066F5',
    fontFamily: 'Muli-Bold',
  },
  countText: {
    color: '#828282',
    fontSize: 13,
    fontFamily: 'Muli-Regular',
  },
});

export default class ForumPage extends React.Component {
  // static navigationOptions = {
  // 	header: null
  // };

  constructor(props) {
    super(props);
    this.state = {
      discussions: [
        {
          name: 'Buhari Jemilu',
          time: '26min',
          description:
            "If you want to help your heart remain healthy, here are a few thigs you can do: \n1. Don't sit around for too long, keep moving. \n2. Eat healthy fats \n3. Get enough sleep. \n4. Avoid smoking, this includes secondhand smoke. \n5. Monitor your blood pressure regularly",
          tag: 'General',
          comments: 1,
          likes: 124,
        },
        {
          name: 'Buhari Jemilu',
          time: '14h',
          description:
            'Dear Husbands, understand that after delivery your wife may not want to have sex She may have had tears and still sore from delivery Spend time with her, reasure her, love her It is advised to wait for 6 weeks before attempting to sex again Let her mind and body heal',
          tag: 'Pregnancy',
          comments: 26,
          likes: 212,
        },
        {
          name: 'Buhari Jemilu',
          time: '1d',
          description:
            'According to the World Health Organization: If you should breastfeed within one hour after your child is born, exclusively for 6 months until they are of age. You would have added your contribution to saving one million lives per year. Breastfeeding is important',
          tag: 'Childcare',
          comments: 26,
          likes: 129,
        },
      ],
    };
  }

  render() {
    const cards = (
      <Query query={GET_ALL_POSTS}>
        {({data, loading, refetch}) => {
          if (loading) return <ActivityIndicator />;
          return data.getPatientPosts.length == 0 ? (
            <EmptyContent text="No post" />
          ) : (
            data.getPatientPosts.map(post => (
              <View style={styles.careCard}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                  }}>
                  <View style={styles.cardImageContainer}>
                    {post.owner.profile.photo &&
                    post.owner.profile.photo.original ? (
                      <FastImage
                        style={styles.imageIcon}
                        source={{
                          uri: post.owner.profile.photo.thumbnail,
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
                    <TouchableHighlight
                      underlayColor="rgba(0,0,0,0.01)"
                      key={shortid.generate()}
                      onPress={() => {
                        this.props.navigation.navigate('PostDetail', post);
                      }}>
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={styles.cardHeaderText}>
                            {post.owner
                              ? post.owner.profile.firstName +
                                ' ' +
                                post.owner.profile.lastName
                              : '__ __'}
                          </Text>
                          <Text style={styles.cardHeaderTime}>
                            {moment(post.createdAt).fromNow()}
                          </Text>
                        </View>

                        <Text style={styles.cardBodyText}>{post.body}</Text>
                      </View>
                    </TouchableHighlight>
                    <View
                      style={{
                        paddingTop: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                        }}>
                        <Image
                          style={styles.bottomIcon}
                          source={require('../../assets/forum-tag.png')}
                        />
                        <Text style={styles.tagText}>
                          {post.tag.replace('_', ' ')}
                        </Text>
                      </View>
                      <TouchableHighlight
                        underlayColor="rgba(0,0,0,0.01)"
                        key={shortid.generate()}
                        onPress={() => {
                          this.props.navigation.navigate('CreateComment', {
                            id: post.id,
                          });
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            style={styles.bottomIcon}
                            source={require('../../assets/forum-comment.png')}
                          />
                          <Text style={styles.countText}>
                            {post.commentsCount}
                          </Text>
                        </View>
                      </TouchableHighlight>
                      <LikePost post={post} refetch={() => refetch()} />

                      <TouchableHighlight
                        underlayColor="rgba(0,0,0,0.01)"
                        key={shortid.generate()}
                        onPress={() => onShare(post.id)}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          <Image
                            style={styles.bottomIcon}
                            source={require('../../assets/forum-share.png')}
                          />
                        </View>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              </View>
            ))
          );
        }}
      </Query>
    );
    return (
      <View style={styles.container}>
        <ScrollView
          style={{marginHorizontal: 5}}
          showsVerticalScrollIndicator={false}>
          {cards}
        </ScrollView>
      </View>
    );
  }
}

export async function onShare(id) {
  try {
    const result = await Share.share({
      message:
        Platform.OS !== 'ios'
          ? `Check out this post. https://medical.aeglehealth.io/post/${id}`
          : 'Check out this post.',
      url: `https://medical.aeglehealth.io/post/${id}`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
}
