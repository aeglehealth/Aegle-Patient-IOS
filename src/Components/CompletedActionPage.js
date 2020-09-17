import React from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import GradientButton from './GradientButton';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2CC1',
    color: '#fff',
    justifyContent: 'center',
  },
  iconImage: {
    height: 95,
    width: 95,
    alignSelf: 'center',
  },
  iconCircle: {
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20,
    height: 95,
    width: 95,
    ...elevationShadowStyle(3),
  },
  headText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 24,
    marginBottom: 10,
  },
  mainBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 45,
    paddingVertical: 25,
    borderRadius: 10,
  },
  bodyText: {
    color: '#828282',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonStyle: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Muli-Bold',
  },
  backgroundImage: {
    paddingLeft: 25,
    paddingEnd: 25,
    flex: 1,
    justifyContent: 'center',
  },
});

class CompletedActionPage extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      subTitle: '',
      onCompleted: () => {},
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const title = navigation.getParam('title', 'Link Sent!');
    const subTitle = navigation.getParam(
      'subTitle',
      'Follow the link sent to your email to create new password',
    );
    const onCompleted = navigation.getParam('onCompleted', () => {});

    this.setState({
      title,
      subTitle,
      onCompleted,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/completed-bg.png')}
          imageStyle={{resizeMode: 'cover'}}
          style={styles.backgroundImage}>
          <View style={styles.mainBox}>
            <View style={styles.iconCircle}>
              <Image
                source={require('../assets/completed-mark.png')}
                style={styles.iconImage}
              />
            </View>
            <Text style={styles.headText}>{this.state.title}</Text>
            <Text style={styles.bodyText}>{this.state.subTitle}</Text>

            <GradientButton
              style={styles.buttonStyle}
              text="OK"
              textStyle={styles.buttonTitleStyle}
              gradientBegin="#1B2CC1"
              gradientEnd="rgba(27, 44, 193, 0.77)"
              gradientDirection="vertical"
              height={90}
              width={270}
              radius={5}
              onPressAction={this.state.onCompleted}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default CompletedActionPage;
