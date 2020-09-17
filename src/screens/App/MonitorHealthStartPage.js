/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import shortid from 'shortid';
import {HeaderLeft} from '../../Components/HeaderLeft';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  bodyText: {
    color: '#000',
    fontFamily: 'muli-regular',
    fontSize: 16,
    textAlign: 'left',
    marginVertical: 20,
  },
  bodySlideText: {
    color: '#000',
    fontFamily: 'muli-regular',
    fontSize: 15,
    textAlign: 'center',
  },
  headerText: {
    color: '#000',
    fontFamily: 'muli-bold',
    fontSize: 18,
    marginBottom: 5,
    marginHorizontal: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'muli-bold',
  },
  wrapper: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  slides: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  gifImage: {
    maxHeight: 340,
    maxWidth: 340,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  slideHeaderContent: {
    marginHorizontal: 30,
  },
});

export default class MonitorHealthStartPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      title: 'Monitor your health',
      headerTitleStyle: {
        fontFamily: 'Muli-ExtraBold',
        fontSize: 22,
        textAlign: 'center',
        flex: 1,
      },
      headerRight: <View />,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      display_views: [
        {
          title: 'Chat with a digital doctor',
          body: 'Get a full assessment of your health using our AI chatbot',
          image: require('../../assets/monitor-chat.png'),
        },
        {
          title: 'Explore your digital twin',
          body:
            'Create your own 3D digital twin to get to know your body better',
          image: require('../../assets/monitor-twin.png'),
        },
        {
          title: 'Predict your future health',
          body:
            'See what impact your life has on your health to help you make decisions',
          image: require('../../assets/monitor-graph.png'),
        },
      ],
    };
  }

  render() {
    const swipeviews = this.state.display_views.map(v => {
      return (
        <View style={styles.slides} key={shortid.generate()}>
          <View style={styles.slideHeaderContent}>
            <Text style={styles.headerText}>{v.title}</Text>
            <Text style={styles.bodySlideText}>{v.body}</Text>
          </View>

          <Image style={styles.gifImage} source={v.image} />
        </View>
      );
    });
    return (
      <View style={styles.container}>
        <Text style={styles.bodyText}>
          Monitor your health is for information purposes only. It is not a
          substitute for a medical diagnosis or advice
        </Text>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          autoplay
          autoplayTimeout={4}
          removeClippedSubviews={false}>
          {swipeviews}
        </Swiper>
        <View style={{marginBottom: 40}}>
          <Button
            type="solid"
            title="GET STARTED"
            buttonStyle={styles.buttonSolidStyle}
            titleStyle={styles.buttonSolidTitleStyle}
            onPress={() =>
              this.props.navigation.navigate('MonitorHealthAssessment')
            }
          />
        </View>
      </View>
    );
  }
}
