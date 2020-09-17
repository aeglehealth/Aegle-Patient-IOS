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
} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import {Icon} from 'react-native-elements';
import shortid from 'shortid';

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
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: 'Muli-Regular',
    marginLeft: 15,
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
    flex: 3,
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
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  floatingButtonIcon: {
    height: 27,
    width: 27,
  },
});

export default class ForumPage2 extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
  };

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
    const cards = this.state.discussions.map(d => {
      return (
        <View style={styles.careCard}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
            }}>
            <View style={styles.cardImageContainer}>
              <Image style={styles.imageIcon} source={d.image} />
            </View>
          </View>

          <View style={styles.cardText}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.cardHeaderText}>{d.name}</Text>
                <Text style={styles.cardHeaderTime}>{d.time}</Text>
              </View>

              <Text style={styles.cardBodyText}>{d.description}</Text>
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
                  <Text style={styles.tagText}>{d.tag}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={styles.bottomIcon}
                    source={require('../../assets/forum-comment.png')}
                  />
                  <Text style={styles.countText}>{d.comments}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={styles.bottomIcon}
                    source={require('../../assets/forum-love.png')}
                  />
                  <Text style={styles.countText}>{d.likes}</Text>
                </View>
                <View
                  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <Image
                    style={styles.bottomIcon}
                    source={require('../../assets/forum-share.png')}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    });
    return (
      <View style={styles.container}>
        <ScrollView
          style={{marginHorizontal: 5}}
          showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.headerText}>#General</Text>
            <Text style={styles.bodyText}>1,245 POSTS</Text>
          </View>
          {cards}
        </ScrollView>
        <FloatingAction
          color="#1B2CC1"
          onPressItem={() => {
            this.props.navigation.navigate('CreatePost');
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
          // floatingIcon={<Icon type="font-awesme" name="pencil" color="#fff" />}
        />
      </View>
    );
  }
}
