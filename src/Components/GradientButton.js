import React from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { View } from 'react-native-animatable';

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 8,
  },
  gradient: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

class GradientButton extends React.PureComponent {
  render() {
    const {
      children,
      style,
      text,
      textStyle,
      gradientBegin,
      gradientEnd,
      disabledGradientBegin,
      disabledGradientEnd,
      gradientDirection,
      height,
      width,
      radius,
      onPressAction,
      disabled,
    } = this.props;

    const disabledColor = [
      disabledGradientBegin || '#D3D3D3',
      disabledGradientEnd || '#696969',
    ];

    const horizontalGradient = {
      start: {x: 0, y: 0.5},
      end: {x: 1, y: 0.5},
    };

    const verticalGradient = {
      start: {x: 0, y: 0},
      end: {x: 0, y: 1},
    };

    const diagonalGradient = {
      start: {x: 0, y: 0},
      end: {x: 1, y: 1},
    };

    return (
      <TouchableHighlight
        style={[styles.button, {height, width}, style]}
        underlayColor="rgba(0,0,0,0.01)"
        onPress={
          disabled
            ? null
            : () => {
                if (onPressAction) {
                  return onPressAction();
                }
                return null;
              }
        }>
        <LinearGradient
          style={[styles.gradient, {borderRadius: radius}]}
          colors={disabled ? disabledColor : [gradientBegin, gradientEnd]}
          start={
            gradientDirection === 'vertical'
              ? verticalGradient.start
              : gradientDirection === 'diagonal'
              ? diagonalGradient.start
              : horizontalGradient.start
          }
          end={
            gradientDirection === 'vertical'
              ? verticalGradient.end
              : gradientDirection === 'diagonal'
              ? diagonalGradient.end
              : horizontalGradient.end
          }>
          <Text style={[styles.text, textStyle]}>{text || children}</Text>
        </LinearGradient>
        {/* <View></View> */}
      </TouchableHighlight>
    );
  }
} 
GradientButton.defaultProps = {
  gradientBegin: '#00d2ff',
  gradientEnd: '#3a47d5',
  gradientDirection: 'horizontal',
  height: 75,
  radius: 25,
  textStyle: {},
  disabled: false,
  disabledGradientBegin: '#D3D3D3',
  disabledGradientEnd: '#696969',
};

export default GradientButton;
