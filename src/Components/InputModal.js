/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {Button, Input} from 'react-native-elements';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

const styles = StyleSheet.create({
  optionsModalView: {
    marginTop: 22,
    maxHeight: 300,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'flex-start',
    marginHorizontal: 20,
  },
  modalHeaderText: {
    color: '#000',
    fontFamily: 'muli-bold',
    fontSize: 20,
    marginBottom: 5,
  },
  modalFooterText: {
    color: '#1B2CC1',
    fontFamily: 'muli-bold',
    fontSize: 16,
    marginLeft: 15,
  },
  textCount: {
    fontFamily: 'Muli-Regular',
    fontSize: 10,
  },
  rightText: {
    fontFamily: 'Muli-Regular',
    fontSize: 18,
  },
});

export default class InputModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputSize: 0,
    };
  }

  componentDidMount() {
    this.setState({
      inputSize: this.props.maxLength,
    });
  }

  render() {
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;

    return (
      <Modal
        isVisible={this.props.isVisible}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
        onBackdropPress={this.props.onBackdropPress}>
        <View style={styles.optionsModalView}>
          <Text style={styles.modalHeaderText}>{this.props.title}</Text>
          <Input
            placeholder={this.props.placeholder}
            value={this.props.value}
            rightIcon={
              <Text style={styles.rightText}>{this.props.rightText}</Text>
            }
            keyboardType={this.props.keyboardType}
            onChangeText={text => {
              this.setState({
                inputSize: this.props.maxLength - text.length,
              });

              this.props.onChangeText(text);
            }}
            maxLength={this.props.maxLength}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingHorizontal: 10,
            }}>
            <Text style={styles.textCount}>{this.state.inputSize}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Button
              type="clear"
              title="OK"
              titleStyle={styles.modalFooterText}
              onPress={this.props.okFunction}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

InputModal.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  okFunction: PropTypes.func.isRequired,
  onBackdropPress: PropTypes.func,
  rightText: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  keyboardType: PropTypes.oneOf(['default', 'numeric', 'number-pad']),
  isVisible: PropTypes.bool.isRequired,
};

InputModal.defaultProps = {
  onBackdropPress: () => {},
  value: '',
  rightText: '',
  keyboardType: 'default',
  placeholder: '',
  maxLength: 150,
};
