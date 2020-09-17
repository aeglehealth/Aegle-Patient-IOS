import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Form, Icon, Item, Input, Label} from 'native-base';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
    color: '#aaa',
  },
  item: {
    paddingLeft: 0,
    marginLeft: 0,
    marginEnd: 10,
  },
  input: {
    paddingLeft: 5,
    fontSize: 16,
    fontFamily: 'Muli-Regular',
  },
  inputBottom: {
    marginBottom: -10,
  },
  textBold: {
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    paddingTop: 45,
    right: 85,
  },
  label: {
    fontSize: 16,
    color: '#B4B4B4',
    paddingLeft: 5,
    fontFamily: 'Muli-Regular',
  },
  labelFocused: {
    fontSize: 14,
    paddingLeft: 5,
    fontFamily: 'Muli-Regular',
    color: '#B4B4B4',
    marginBottom: 20,
  },
});

export default class CustomIconInput extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#fff',
      shadowColor: '#fff',
      elevation: 0,
      shadowOpacity: 0,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      leftIcon: null,
      value: '',
      isFocused: false,
    };
  }

  componentDidMount() {
    this.setState({
      leftIcon: this.props.leftBlurIcon,
      value: this.props.value,
    });
  }

  isFocused = () => {
    return this.props.isFloatingLabel
      ? this.state.isFocused ||
          (this.state.value !== null && this.state.value.length > 0)
      : false;
  };

  render() {
    const leftIcon = this.state.leftIcon ? (
      <Icon
        type={this.props.iconType}
        name={this.state.leftIcon}
        style={[
          styles.icon,
          {
            marginBottom: -15,
          },
        ]}
      />
    ) : (
      <View />
    );
    const rightIcon = this.props.rightIcon ? (
      <Icon
        type={this.props.iconType}
        name={this.props.rightIcon}
        style={[
          styles.icon,
          {
            marginBottom: -15,
          },
        ]}
        onPress={this.props.onRightIconPress}
      />
    ) : (
      <View />
    );
    const label = <Label style={styles.labelFocused}>{this.props.label}</Label>;

    return (
      <Form>
        <Item
          stackedLabel={this.props.stackedLabel}
          style={[
            styles.item,
            {
              paddingBottom: 0,
              paddingTop: 0,
              marginTop: -4,
            },
          ]}>
          {label}
          <Input
            maxLength={5}
            style={[styles.textBold, {flex: 1, height: 75, width: '100%'}]}
            placeholder={this.props.placeholder}
            onChangeText={text => {
              this.setState({value: text});
              this.props.onChangeText(text);
            }}
            value={this.state.value}
            secureTextEntry={this.props.isPassword}
          />
          {rightIcon}
        </Item>
      </Form>
    );
  }
}

CustomIconInput.propTypes = {
  isFloatingLabel: PropTypes.bool,
  isPassword: PropTypes.bool,
  iconType: PropTypes.string,
  leftBlurIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  leftFocusIcon: PropTypes.string,
  label: PropTypes.string,
  onChangeText: PropTypes.func,
  onRightIconPress: PropTypes.func,
  value: PropTypes.string || PropTypes.number,
  placeholder: PropTypes.string,
};

CustomIconInput.defaultProps = {
  isFloatingLabel: true,
  isPassword: false,
  iconType: 'MaterialCommunityIcons',
  leftBlurIcon: null,
  rightIcon: null,
  leftFocusIcon: null,
  onChangeText: () => {},
  onRightIconPress: () => {},
  value: '',
  label: '',
  placeholder: '',
};
