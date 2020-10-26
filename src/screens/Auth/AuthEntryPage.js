import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import shortid from 'shortid';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingEnd: 10,
    justifyContent: 'space-between',
  },
  bodyText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonStyle: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#1B2CC1',
    borderRadius: 5,
    borderWidth: 1,
  },
  buttonTitleStyle: {
    color: '#1B2CC1',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
  },

  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
  },
  wrapper: {
    marginTop: 20,
  },
  slides: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gifImage: {
    maxHeight: 270,
    maxWidth: 270,
  },
});

export default class AuthEntryPage extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      display_views: [
        {
          title: 'Healthcare but better',
          body:
            'No more waiting in line. See a Doctor on your phone or book a private Doctor visit.',
          image: require('../../assets/screen-1.gif'),
        },
        {
          title: 'Talk to Aegle',
          body:
            'Aegle AI pal helps you stay on top of your health, gives you info across the breadth of your mental health and general wellbeing.',
          image: require('../../assets/screen-2.gif'),
        },
        {
          title: 'Join a supportive circle',
          body:
            'Post updates, ask questions, learn from people with your condition how they manage their symptoms and see if it works for you.',
          image: require('../../assets/screen-3.gif'),
        },
      ],
    };
  }

  render() {
    const swipeviews = this.state.display_views.map(v => {
      return (
        <View style={styles.slides} key={shortid.generate()}>
          <View>
            <Text style={styles.headerText}>{v.title}</Text>
            <Text style={styles.bodyText}>{v.body}</Text>
          </View>

          <Image style={styles.gifImage} source={v.image} />
        </View>
      );
    });
    return (
      <View style={[styles.container]}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          autoplay
          autoplayTimeout={10}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          paginationStyle={{position: 'absolute', bottom: 50}}>
          {swipeviews}
        </Swiper>
        <View style={{marginBottom: 40}}>
          <Button
            type="solid"
            title="SIGN UP"
            buttonStyle={styles.buttonSolidStyle}
            titleStyle={styles.buttonSolidTitleStyle}
            // onPress={() => this.props.navigation.navigate('SignUpChoices')}
            onPress={() => this.props.navigation.navigate('SignUpEmail')}
          />
          <Button
            type="outline"
            title="LOG IN"
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            // onPress={() => this.props.navigation.navigate('SignInChoices')}
            onPress={() => this.props.navigation.navigate('SignInEmail')}
          />
        </View>
      </View>
    );
  }
}
