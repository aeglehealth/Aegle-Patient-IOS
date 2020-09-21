/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Button, Icon, CheckBox} from 'react-native-elements';
import {Mutation, Query} from 'react-apollo';
import {NewCOMMENT, MEPOST, COMMENT, POSTS} from '../../QueryAndMutation';
import ActivityIndicatorPage from './ActivityIndicatorPage';
import FastImage from 'react-native-fast-image';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    ...elevationShadowStyle(2),
    shadowColor: 'rgba(196, 196, 196, 0.7)',
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 15,
    marginHorizontal: 10,
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#0066F5',
    width: 40,
    height: 40,
    overflow: 'hidden',
    borderRadius: 40,
  },
  input: {
    borderWidth: 1,
    textAlignVertical: 'top',
    borderColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingTop: 5,
    paddingRight: 10,
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    height: 200,
    minWidth: 200,
  },

  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  cardListText: {
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    color: 'rgba(85, 85, 85, 0.75)',
  },
  clearButtonTitle: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
  },
});

export default class CreatePostPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: styles.headerStyle,
      headerRightContainerStyle: {
        paddingRight: 10,
      },
      headerLeftContainerStyle: {
        paddingLeft: 10,
      },
      headerRight: (
        <Button
          type="clear"
          title="POST"
          titleStyle={styles.clearButtonTitle}
          onPress={() => console.log('Am listenng')}
        />
      ),
      headerLeft: (
        <Icon
          type="material-community"
          name="close"
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isAnonymous: false,
      comment: '',
    };
  }

  render() {
    return (
      <Query query={MEPOST}>
        {({data, loading}) => {
          let User_Data = data;
          return loading ? (
            <ActivityIndicatorPage />
          ) : (
            <Mutation
              mutation={NewCOMMENT}
              awaitRefetchQueries
              refetchQueries={[
                {
                  query: COMMENT,
                  variables: {forumId: this.props.navigation.state.params.id},
                },
              ]}>
              {(createComment, {loading, error, data}) => (
                <View style={styles.container}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: 10,
                      height: 50,
                    }}>
                    <View style={{justifyContent: 'center'}}>
                      <Icon
                        type="material-community"
                        name="close"
                        onPress={() => {
                          this.props.navigation.goBack();
                        }}
                      />
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      {loading ? (
                        <ActivityIndicator />
                      ) : (
                        <Text
                          onPress={async () => {
                            this.state.comment
                              ? await createComment({
                                  variables: {
                                    postId: this.props.navigation.state.params
                                      .id,
                                    comment: this.state.comment,
                                    isAnonymous: this.state.isAnonymous,
                                  },
                                })
                              : ShowMessage(
                                  type.ERROR,
                                  'Please fill the field',
                                );

                            this.props.navigation.state.params.refetch();
                          }}>
                          COMMENT
                        </Text>
                      )}
                      {data
                        ? this.props.navigation.goBack() //this.props.navigation.navigate('PostDetail', data)
                        : null}
                    </View>
                  </View>
                  <ScrollView
                    style={{paddingHorizontal: 10}}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                      <View style={{flexDirection: 'row', padding: 10}}>
                        <View style={styles.cardImageContainer}>
                          {User_Data.me.profile.photo &&
                          User_Data.me.profile.photo.original ? (
                            <FastImage
                              style={{width: 40, height: 40}}
                              source={{
                                uri: User_Data.me.profile.photo.thumbnail,
                                priority: FastImage.priority.normal,
                              }}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          ) : (
                            <Image
                              style={{width: 40, height: 40}}
                              source={require('../../assets/user-default.png')}
                            />
                          )}
                        </View>
                        <TextInput
                          style={styles.input}
                          multiline
                          value={this.state.comment}
                          placeholder="Type your comment"
                          onChangeText={text => this.setState({comment: text})}
                        />
                      </View>
                    </View>

                    <View style={[styles.card, {paddingHorizontal: 0}]}>
                      <View
                        style={[
                          styles.cardItem,
                          {
                            borderBottomColor: 'rgba(196, 196, 196, 0.5)',
                            borderBottomWidth: 1,
                          },
                        ]}>
                        {/* <Text style={styles.cardListText}>Select Tag</Text>
                        <Text style={[styles.cardListText, {color: '#1B2CC1'}]}>
                          General
                        </Text> */}
                      </View>
                      <View style={[styles.cardItem]}>
                        <Text style={styles.cardListText}>Make Anonymous</Text>
                        <CheckBox
                          containerStyle={{
                            padding: 0,
                            margin: 0,
                          }}
                          checked={this.state.isAnonymous}
                          onPress={() =>
                            this.setState(prevState => ({
                              isAnonymous: !prevState.isAnonymous,
                            }))
                          }
                        />
                      </View>
                    </View>
                  </ScrollView>
                </View>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
