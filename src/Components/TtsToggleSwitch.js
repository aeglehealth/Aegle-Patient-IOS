import React, {Component} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import Tts from 'react-native-tts';
import Context from '../../Context/Context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class TtsToggleSwitch extends Component {
  onToggleSwitch = () => {
    this.context.toggleDisplay();
    Tts.stop();
  };

  static contextType = Context;

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onToggleSwitch}>
        <View
          style={
            this.props.position
              ? {margin: 10}
              : {position: 'absolute', right: 15, top: 0}
          }>
          {this.context.display ? (
            <FontAwesome5 name="volume-up" color="#1B2CC1" size={20} />
          ) : (
            <FontAwesome5 name="volume-mute" color="#1B2CC1" size={20} />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
