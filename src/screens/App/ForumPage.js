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
  Dimensions,
} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import shortid from 'shortid';
import {Query, Mutation} from 'react-apollo';
import {POSTS, LIKE_POST, MEPOST} from '../../QueryAndMutation';
import moment from 'moment';
import ActivityIndicatorPage from './ActivityIndicatorPage';
import {onShare} from './MyPostsPage';
import Like_Active from '../../assets/forum-love-active.svg';
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
    backgroundColor: '#0066F5',
    width: 65,
    height: 65,
    overflow: 'hidden',
    borderRadius: 40,
  },
  cardText: {
    flex: 3.5,
    justifyContent: 'center',
    paddingRight: 8,
    paddingVertical: 10,
    marginStart: 10,
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
  floatingButtonIcon: {
    height: 27,
    width: 27,
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
          name: 'Dr Bankole Kuti',
          time: '26min',
          // image: require('../../assets/forum-1.png'),
          description:
            "If you want to help your heart remain healthy, here are a few thigs you can do: \n1. Don't sit around for too long, keep moving. \n2. Eat healthy fats \n3. Get enough sleep. \n4. Avoid smoking, this includes secondhand smoke. \n5. Monitor your blood pressure regularly",
          tag: 'General',
          comments: 1,
          likes: 124,
        },
        {
          name: 'Nonso Ubam',
          time: '14h',
          // image: require('../../assets/forum-2.png'),
          description:
            'Dear Husbands, understand that after delivery your wife may not want to have sex She may have had tears and still sore from delivery Spend time with her, reasure her, love her It is advised to wait for 6 weeks before attempting to sex again Let her mind and body heal',
          tag: 'Pregnancy',
          comments: 26,
          likes: 212,
        },
        {
          name: 'Doctors Magazine Ng',
          time: '1d',
          // image: require('../../assets/forum-3.png'),
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
    return (
      <>
        <View style={styles.container}>
          <ScrollView
            style={{marginHorizontal: 5}}
            showsVerticalScrollIndicator={false}>
            <Query query={POSTS}>
              {({loading, error, data, refetch}) => {
                this.state.refetch ? null : this.setState({refetch: refetch});
                if (loading)
                  return (
                    <View
                      style={{
                        marginTop: Dimensions.get('screen').height / 2.7,
                      }}>
                      <ActivityIndicatorPage />
                    </View>
                  );
                return data.getPosts.length == 0 ? (
                  <EmptyContent text="No post" />
                ) : (
                  data &&
                    data.getPosts.map(post => (
                      <View style={styles.careCard}>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                          }}>
                          <View style={styles.cardImageContainer}>
                            {!post.isAnonymous &&
                            post.owner.profile.photo &&
                            post.owner.profile.photo.thumbnail ? (
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
                                source={require('../../assets/user-default-white.png')}
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
                                this.props.navigation.navigate(
                                  'PostDetail',
                                  post,
                                );
                              }}>
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                  }}>
                                  <Text style={styles.cardHeaderText}>
                                    {post.isAnonymous
                                      ? 'Anonymous'
                                      : post.owner.profile.firstName +
                                        ' ' +
                                        post.owner.profile.lastName}
                                  </Text>
                                  <Text style={styles.cardHeaderTime}>
                                    {moment(post.createdAt).fromNow()}
                                  </Text>
                                </View>

                                <Text style={styles.cardBodyText}>
                                  {post.body}
                                </Text>
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
                                  this.props.navigation.navigate(
                                    'CreateComment',
                                    {
                                      id: post.id,
                                      refetch: this.state.refetch,
                                    },
                                  );
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

                              <LikePost
                                post={post}
                                refetch={() => this.state.refetch()}
                              />

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
          </ScrollView>
          <FloatingAction
            color="#1B2CC1"
            onPressItem={() => {
              this.props.navigation.navigate('CreatePost', {
                refresh: this.state.refetch,
              });
            }}
            distanceToEdge={20}
            overrideWithAction
            actions={[
              {
                text: 'Create',
                name: 'bt_create',
                icon: (
                  <Image
                    source={require('../../assets/icon-pen.png')}
                    style={styles.floatingButtonIcon}
                  />
                ),
                position: 1,
              },
            ]}
          />
        </View>
      </>
    );
  }
}

export function LikePost({post, refetch}) {
  let liked = false;
  return (
    <Query query={MEPOST}>
      {({data, loading}) => {
        let USER = data;
        return loading ? null : (
          <Mutation mutation={LIKE_POST}>
            {addForumLike => (
              <TouchableHighlight
                underlayColor="rgba(0,0,0,0.01)"
                key={shortid.generate()}
                onPress={async () => {
                  await addForumLike({
                    variables: {
                      forumId: post.id,
                    },
                  });
                  refetch();
                }}>
                <View style={{flexDirection: 'row'}}>
                  {post.likes ? (
                    post.likes.map((like, key) => {
                      if (like.likedBy.local.email == USER.me.local.email) {
                        liked = true;
                        return <Like_Active style={styles.bottomIcon} />;
                      }
                    })
                  ) : (
                    <Image
                      style={styles.bottomIcon}
                      source={require('../../assets/forum-love.png')}
                    />
                  )}
                  {!liked ? (
                    <Image
                      style={styles.bottomIcon}
                      source={require('../../assets/forum-love.png')}
                    />
                  ) : null}
                  <Text style={styles.countText}>{post.likesCount}</Text>
                </View>
              </TouchableHighlight>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
}
