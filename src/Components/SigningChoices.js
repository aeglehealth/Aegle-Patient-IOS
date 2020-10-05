import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import PropTypes from 'prop-types';

export default class SigningChoices extends React.Component {
  static navigationOptions = {headerShown: false};
  render() {
    const googleIconComponent = () => {
      return (
        <Image
          source={require('../assets/google-btn-icon.png')}
          style={styles.iconStyle}
        />
      );
    };

    const facebookIconComponent = () => {
      return (
        <Image
          source={require('../assets/facebook-btn-icon.png')}
          style={styles.iconStyle}
        />
      );
    };
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Continue with</Text>
        </View>

        <View>
          <Button
            type="outline"
            icon={googleIconComponent}
            title={this.props.googleText}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonGoogleTitleStyle}
            onPress={this.props.googleButtonFunction}
          />
          <Button
            type="outline"
            icon={facebookIconComponent}
            title={this.props.facebookText}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonFacebookTitleStyle}
            onPress={this.props.facebookButtonFunction}
          />
          <Button
            type="solid"
            title={this.props.customText}
            buttonStyle={styles.buttonSolidStyle}
            titleStyle={styles.buttonSolidTitleStyle}
            onPress={this.props.customButtonFunction}
          />
        </View>
        <View />
      </View>
    );
  }
}

SigningChoices.propTypes = {
  googleText: PropTypes.string.isRequired,
  facebookText: PropTypes.string.isRequired,
  customText: PropTypes.string.isRequired,
  googleButtonFunction: PropTypes.func,
  facebookButtonFunction: PropTypes.func,
  customButtonFunction: PropTypes.func,
};

SigningChoices.defaultProps = {
  googleButtonFunction: () => {},
  facebookButtonFunction: () => {},
  customButtonFunction: () => {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingEnd: 10,
    paddingTop: 20,
  },
  headerView: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 87,
  },
  headerText: {
    fontFamily: 'Muli-Bold',
    fontSize: 30,
    lineHeight: 38,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  buttonStyle: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    borderColor: '#828282',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonGoogleTitleStyle: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Muli-Bold',
    textAlign: 'left',
  },
  buttonFacebookTitleStyle: {
    color: '#3B5998',
    fontSize: 18,
    fontFamily: 'Muli-Bold',
    textAlign: 'left',
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Muli-Bold',
  },
  iconStyle: {
    width: 25,
    height: 25,
    marginHorizontal: 10,
  },
});
