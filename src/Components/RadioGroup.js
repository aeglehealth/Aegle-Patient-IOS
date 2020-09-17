/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable max-classes-per-file */
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  border: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class RadioGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioButtons: this.validate(this.props.radioButtons),
    };
  }

  onPress = label => {
    const {radioButtons} = this.state;
    const selectedIndex = radioButtons.findIndex(e => e.selected === true);
    const selectIndex = radioButtons.findIndex(e => e.label === label);
    if (selectedIndex !== selectIndex) {
      if (typeof radioButtons[selectedIndex] !== 'undefined') {
        radioButtons[selectedIndex].selected = false;
      }
      radioButtons[selectIndex].selected = true;
      this.setState({radioButtons});
      this.props.onPress(this.state.radioButtons, radioButtons[selectIndex]);
    }
  };

  validate = data => {
    let selected = false; // Variable to check if "selected: true" for more than one button.
    const myData = data.map(e => {
      e.disabled = e.disabled ? e.disabled : false;
      e.label = e.label ? e.label : 'You forgot to give label';
      e.labelColor = e.labelColor ? e.labelColor : '#444';
      e.layout = e.layout ? e.layout : 'row';
      e.selected = e.selected ? e.selected : false;
      if (e.selected) {
        if (selected) {
          e.selected = false; // Making "selected: false", if "selected: true" is assigned for more than one button.
        } else {
          selected = true;
        }
      }
      e.size = e.size ? e.size : 24;
      e.value = e.value ? e.value : e.label;
      return e;
    });
    return myData;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: this.props.flexDirection}}>
          {this.state.radioButtons.map(data => (
            <RadioButton key={data.label} data={data} onPress={this.onPress} />
          ))}
        </View>
      </View>
    );
  }
}

class RadioButton extends Component {
  render() {
    const {data} = this.props;
    const opacity = data.disabled ? 0.2 : 1;
    let layout = {flexDirection: 'row'};
    let margin = {marginLeft: 20};
    if (data.layout === 'column') {
      layout = {alignItems: 'center'};
      margin = {marginTop: 10};
    }
    return (
      <TouchableOpacity
        style={[layout, {opacity, marginHorizontal: 10, marginVertical: 10}]}
        onPress={() => {
          return data.disabled ? null : this.props.onPress(data.label);
        }}>
        <View
          style={[
            styles.border,
            {
              borderColor: data.selected ? '#1B2CC1' : 'rgba(0, 0, 0, 0.54)',
              width: data.size,
              height: data.size,
              borderRadius: data.size / 2,
              alignSelf: 'flex-start',
            },
          ]}>
          {data.selected && (
            <View
              style={{
                backgroundColor: data.selected
                  ? '#1B2CC1'
                  : 'rgba(0, 0, 0, 0.54)',
                width: data.size / 2,
                height: data.size / 2,
                borderRadius: data.size / 2,
              }}
            />
          )}
        </View>
        <Text
          style={[
            {alignSelf: 'center', fontSize: 16, fontFamily: 'Muli-Regular'},
            margin,
            {color: data.labelColor},
          ]}>
          {data.label}
        </Text>
      </TouchableOpacity>
    );
  }
}
