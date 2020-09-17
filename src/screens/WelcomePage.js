import React from 'react';
import {StyleSheet, Text, View, BackHandler, Platform} from 'react-native';
import {Header, Button, Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS == 'ios' ? 'white' : '#1B2CC1',
    color: '#fff',
    paddingLeft: 10,
    paddingEnd: 10,
    justifyContent: 'space-between',
  },
  navbar: {
    backgroundColor: '#1B2CC1',
    justifyContent: 'space-around',
    borderBottomColor: '#1B2CC1',
    marginBottom: 30,
    marginTop: 20,
  },
  navbarText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Muli-Bold',
  },
  bodyText: {
    color: Platform.OS == 'ios' ? 'black' : 'white',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    justifyContent: 'center',
    marginLeft: 17,
  },
  buttonStyle: {
    backgroundColor: Platform.OS == 'ios' ? '#1B2CC1' : '#fff',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonTitleStyle: {
    color: Platform.OS == 'ios' ? '#fff' : '#1B2CC1',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
  },
  animationBox: {
    borderWidth: 2,
    borderColor: Platform.OS == 'ios' ? 'black' : '#fff',
    height: 10,
    width: 10,
    marginHorizontal: 5,
  },
});

const AnimationBoxes = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <Animatable.View
        delay={100}
        iterationDelay={100}
        animation="bounce"
        iterationCount={40}
        style={styles.animationBox}
      />
      <Animatable.View
        delay={200}
        iterationDelay={100}
        iterationCount={40}
        animation="bounce"
        style={styles.animationBox}
      />
      <Animatable.View
        delay={300}
        iterationDelay={100}
        iterationCount={40}
        animation="bounce"
        style={styles.animationBox}
      />
      <Animatable.View
        delay={400}
        iterationDelay={100}
        iterationCount={40}
        animation="bounce"
        style={styles.animationBox}
      />
    </View>
  );
};

export default class ePage extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      nextAnimation: null,
      prevAnimation: null,
    };
  }

  async componentDidMount() {
    // const token = await AsyncStorage.getItem('aegle_patient_token');
    // token && this.props.navigation.navigate('Home');
    setTimeout(() => {
      this.setState({
        nextAnimation: (
          <Animatable.View
            delay={1800}
            animation={{from: {opacity: 1}, to: {opacity: 0}}}
            style={{
              flexDirection: 'row',
              marginTop: -20,
              marginHorizontal: 20,
            }}>
            <AnimationBoxes />
          </Animatable.View>
        ),
      });
    }, 2500);

    this.setState({
      prevAnimation: (
        <Animatable.View
          delay={1300}
          animation={{from: {opacity: 1}, to: {opacity: 0}}}
          style={{
            flexDirection: 'row',
            marginTop: -10,
            marginHorizontal: 20,
          }}>
          <AnimationBoxes />
        </Animatable.View>
      ),
    });
  }

  render() {
    return (
      <>
        {Platform.OS == 'ios' ? (
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              justifyContent: 'center',
              marginBottom: 50,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: '#1B2CC1',
                fontSize: 20,
                fontFamily: 'Muli-Regular',
                fontWeight: 'bold',
              }}>
              Aegle
            </Text>
          </View>
        ) : null}
        <View style={styles.container}>
          <View>
            {Platform.OS == 'ios' ? null : (
              <Header
                barStyle="default"
                backgroundColor="#1B2CC1"
                leftComponent={
                  <Icon
                    type="material-community"
                    name="close"
                    size={30}
                    color="#fff"
                    onPress={() => BackHandler.exitApp()}
                  />
                }
                centerComponent={{text: 'Aegle', style: styles.navbarText}}
                containerStyle={styles.navbar}
              />
            )}
            <View>
              <View style={{marginBottom: 20}}>
                <Animatable.Text
                  delay={1500}
                  animation={{from: {marginLeft: -350}, to: {marginLeft: 20}}}
                  iterationCount={1}
                  style={styles.bodyText}>
                  Hi there, I&apos;m Aegle
                </Animatable.Text>
                {this.state.prevAnimation}
              </View>
              <View style={{paddingTop: 20}}>
                <Animatable.Text
                  animation={{from: {marginLeft: -350}, to: {marginLeft: 20}}}
                  delay={4700}
                  iterationCount={1}
                  style={styles.bodyText}>
                  I take care of your health so you
                </Animatable.Text>
                <Animatable.Text
                  animation={{from: {marginLeft: -350}, to: {marginLeft: 20}}}
                  delay={4700}
                  iterationCount={1}
                  style={styles.bodyText}>
                  can kick back and enjoy life
                </Animatable.Text>
                {this.state.nextAnimation}
              </View>
            </View>
          </View>

          <Animatable.View
            delay={5000}
            animation={{from: {marginBottom: -350}, to: {marginBottom: 80}}}>
            <Button
              type="outline"
              title="GET STARTED"
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={() => this.props.navigation.navigate('AuthEntry')}
            />
          </Animatable.View>
        </View>
      </>
    );
  }
}
