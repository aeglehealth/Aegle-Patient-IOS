import 'react-native-gesture-handler';
/* eslint-disable global-require */
import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {StyleSheet, Text, View, Platform} from 'react-native';
import {Header} from 'react-native-elements';

import Discussions from './ForumPage';
import PostTags from './PostTagsPage';
import MyPosts from './MyPostsPage';

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Muli-Regular',
    textAlign: 'left',
    flex: 1,
    fontSize: 30,
    marginTop: 10,
    lineHeight: 38,
    fontWeight: 'bold',
  },
  headerStyle: {
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
    paddingTop: 0,
    paddingBottom: 0,
    height:
      Platform.select({
        android: 56,
        default: 50,
      }) + 20,
  },
  headerLeftContainerStyle: {flex: 3, paddingTop: 20},
});

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const TabNavigator = createMaterialTopTabNavigator(
  {
    Discussions,
    'Post Tags': PostTags,
    'My Posts': MyPosts,
  },
  {
    tabBarOptions: {
      activeTintColor: '#0066F5',
      inactiveTintColor: '#828282',
      indicatorStyle: {
        height: 3,
        backgroundColor: '#0066F5',
      },
      labelStyle: {
        fontSize: 12,
        marginBottom: 0,
        fontFamily: 'muli-bold',
      },
      tabStyle: {
        paddingBottom: 0,
        paddingTop: 0,
      },
      style: {
        paddingBottom: 0,
        paddingTop: 0,
        borderTopColor: '#fff',
        backgroundColor: '#fff',
        ...elevationShadowStyle(5),
      },
    },
  },
);

const AppNavigator = createStackNavigator({
  Root: {
    screen: TabNavigator,
    navigationOptions: () => ({
      header: () => {
        return (
          <View>
            <Header
              containerStyle={styles.headerStyle}
              leftComponent={<Text style={styles.headerText}>Forum</Text>}
              leftContainerStyle={styles.headerLeftContainerStyle}
            />
          </View>
        );
      },
    }),
  },
});

export default createAppContainer(AppNavigator);
