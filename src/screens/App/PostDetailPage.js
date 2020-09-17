/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';
import {Icon} from 'react-native-elements';
import shortid from 'shortid';
import MenuModal from '../../Components/MenuModal';
import {Query, Mutation} from 'react-apollo';
import {COMMENT, LIKE_COMMENT} from '../../QueryAndMutation';
import moment from 'moment';
import {HeaderLeft} from '../../Components/HeaderLeft';
import FastImage from 'react-native-fast-image';
import {onShare} from './MyPostsPage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  cardBodyText: {
    color: '#000',
    fontFamily: 'muli-regular',
    fontSize: 18,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
  },
  cardHeaderTime: {
    color: '#555',
    fontFamily: 'muli-regular',
    fontSize: 14,
  },
  imageIcon: {
    maxHeight: 65,
    maxWidth: 65,
    width: 65,
    height: 65,
    alignSelf: 'center',
  },
  bottomIcon: {
    maxHeight: 18,
    maxWidth: 18,
    alignSelf: 'center',
    marginRight: 5,
  },
  commentBottomIcon: {
    maxHeight: 15,
    maxWidth: 15,
    alignSelf: 'center',
    marginRight: 5,
  },
  careCard: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 10,
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
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 5,
  },
  tagText: {
    fontSize: 15,
    color: '#0066F5',
    fontFamily: 'Muli-Bold',
  },
  countText: {
    color: '#828282',
    fontSize: 15,
    fontFamily: 'muli-regular',
  },
  countCommentText: {
    color: '#828282',
    fontSize: 13,
    fontFamily: 'muli-regular',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Muli-Bold',
    marginTop: 5,
    marginBottom: 15,
    marginHorizontal: 15,
    color: '#555555',
  },
  commentContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#D5D5D5',
    borderBottomColor: '#D5D5D5',
    paddingVertical: 15,
    marginHorizontal: 15,
  },
  commentImage: {
    maxHeight: 25,
    maxWidth: 25,
    width: 25,
    height: 25,
    alignSelf: 'center',
  },
  commentImageContainer: {
    width: 25,
    height: 25,
    borderRadius: 10,
    marginRight: 10,
    overflow: 'hidden',
  },
  commentNameText: {
    color: '#353535',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
  },
  commentTimeText: {
    color: 'rgba(85, 85, 85, 0.75)',
    fontFamily: 'muli-regular',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 3,
  },
  commentCommentText: {
    color: '#555555',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default class PostDetailPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerRightContainerStyle: {
        paddingRight: 10,
        justifyContent: 'center',
      },
      headerLeft: <HeaderLeft navigation={navigation} />,
      headerRight: (
        <Icon
          type="material-community"
          name="dots-vertical"
          color="#DADADA"
          onPress={params.openModal}
        />
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      openModal: this.openModal,
    });
  }

  openModal = () => {
    this.setState({
      moreOptionsModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      moreOptionsModal: false,
    });
  };

  reportPost = () => {
    this.setState({
      moreOptionsModal: false,
    });
    this.props.navigation.navigate('ReportPost');
  };

  constructor(props) {
    super(props);
    this.state = {
      menuOptions: [
        {
          title: 'Share',
          icon: (
            <Icon type="material-community" name="share-variant" color="#555" />
          ),
          onPress: () => {},
        },
        {
          title: 'Report',
          icon: (
            <Icon type="material-community" name="flag-outline" color="#555" />
          ),
          onPress: this.reportPost,
        },
      ],
      comment: {
        name: 'Dr Bankole Kuti',
        time: '26min',
        // image: require('../../assets/forum-1.png'),
        description:
          "If you want to help your heart remain healthy, here are a few thigs you can do: \n1. Don't sit around for too long, keep moving. \n2. Eat healthy fats \n3. Get enough sleep. \n4. Avoid smoking, this includes secondhand smoke. \n5. Monitor your blood pressure regularly",
        tag: 'General',
        likes: 124,
      },
      moreOptionsModal: false,
      user_comments: [
        {
          name: 'Dr. Raymond Brown',
          time: '26min',
          // image: require('../../assets/comment-image.png'),
          comment: 'Thank you for this',
          likes: 20,
        },
        {
          name: 'Dr. Raymond David',
          time: '16min',
          // image: require('../../assets/comment-image.png'),
          comment: 'Thank you for this and this is moving fine here',
          likes: 1,
        },
      ],
    };
  }

  render() {
    const {
      body,
      id,
      createdAt,
      owner,
      commentsCount,
      likesCount,
      tag,
      timestamp,
      repliesCount,
      comment,
      isAnonymous,
    } = this.props.navigation.state.params.createPost
      ? this.props.navigation.state.params.createPost
      : this.props.navigation.state.params.createComment
      ? this.props.navigation.state.params.createComment
      : this.props.navigation.state.params;
    const comments =
      commentsCount >= '1' ? (
        <Query query={COMMENT} variables={{forumId: id}}>
          {({loading, data, refetch}) => {
            return loading ? (
              <ActivityIndicator />
            ) : (
              data.getComments.map((result, id) => (
                <View style={styles.commentContainer} key={shortid.generate()}>
                  {console.log(data, 'dataa')}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <View style={styles.commentImageContainer}>
                      {!result.isAnonymous &&
                      result.owner.profile.photo &&
                      result.owner.profile.photo.original ? (
                        <>
                          <FastImage
                            style={styles.commentImage}
                            source={{
                              uri: result.owner.profile.photo.thumbnail,
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        </>
                      ) : (
                        <Image
                          style={styles.commentImage}
                          source={require('../../assets/user-default.png')}
                        />
                      )}
                    </View>
                    <View>
                      <View style={{flexDirection: 'row', paddingBottom: 5}}>
                        <Text style={styles.commentNameText}>
                          {result.isAnonymous
                            ? 'Anonymous'
                            : owner.profile.firstName +
                              ' ' +
                              owner.profile.lastName}
                        </Text>
                        <Text style={styles.commentTimeText}>
                          {/* -{new Date(result.timestamp).toUTCString()} */}-{' '}
                          {moment(result.timestamp).fromNow()}
                        </Text>
                      </View>
                      <Text styles={styles.commentCommentText}>
                        {result.comment}
                      </Text>

                      <View
                        style={{
                          paddingTop: 10,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                        }}>
                        <LikeComment
                          comment={result}
                          refetch={() => refetch()}
                        />
                        <View>
                          <Text style={styles.countCommentText}>Reply</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            );
          }}
        </Query>
      ) : (
        <Text style={{textAlign: 'center'}}>
          {commentsCount != null ? 'No Comments' : 'No Replies'}
        </Text>
      );

    return (
      <View style={styles.container}>
        <ScrollView
          style={{marginHorizontal: 5}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.careCard}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                flexDirection: 'row',
                paddingHorizontal: 10,
                paddingVertical: 15,
              }}>
              <View style={styles.cardImageContainer}>
                {!isAnonymous &&
                owner.profile.photo &&
                owner.profile.photo.original ? (
                  <FastImage
                    style={styles.imageIcon}
                    source={{
                      uri: owner.profile.photo.thumbnail,
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
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingLeft: 15,
                }}>
                <Text style={styles.cardHeaderText}>
                  {isAnonymous
                    ? 'Anonymous'
                    : owner.profile.firstName + ' ' + owner.profile.lastName}
                </Text>
                <Text style={styles.cardHeaderTime}>
                  {createdAt
                    ? moment(parseInt(createdAt))
                        .utc()
                        .fromNow()
                    : new Date(timestamp).toISOString()}
                </Text>
              </View>
            </View>

            <View style={styles.cardText}>
              <View>
                <Text style={styles.cardBodyText}>{body ? body : comment}</Text>
                <View
                  style={{
                    paddingTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
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
                    <Text style={styles.tagText}>{tag.replace('_', ' ')}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.bottomIcon}
                      source={require('../../assets/forum-comment.png')}
                    />
                    <Text style={styles.countText}>{commentsCount}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.bottomIcon}
                      source={require('../../assets/forum-love.png')}
                    />
                    <Text style={styles.countText}>{likesCount}</Text>
                  </View>
                  <TouchableHighlight
                    underlayColor="rgba(0,0,0,0.01)"
                    key={shortid.generate()}
                    onPress={() => onShare(id)}
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
          <Text style={styles.sectionHeader}>
            {commentsCount != null
              ? `COMMENTS (${commentsCount})`
              : `Replies (${repliesCount})`}
          </Text>
          {comments}
        </ScrollView>
        <MenuModal
          isVisible={this.state.moreOptionsModal}
          onBackdropPress={this.closeModal}
          title="Post options"
          cancelFunction={this.closeModal}
          options={this.state.menuOptions}
        />
      </View>
    );
  }
}

export function LikeComment({comment, refetch}) {
  return (
    <Mutation mutation={LIKE_COMMENT}>
      {(addCommentLike, {data, loading}) => (
        <TouchableHighlight
          underlayColor="rgba(0,0,0,0.01)"
          key={shortid.generate()}
          onPress={async () => {
            var response = await addCommentLike({
              variables: {
                commentId: comment.id,
              },
            });
            console.log(response);
            refetch();
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.bottomIcon}
              source={require('../../assets/forum-love.png')}
            />
            <Text style={styles.countText}>{comment.likesCount}</Text>
          </View>
        </TouchableHighlight>
      )}
    </Mutation>
  );
}
