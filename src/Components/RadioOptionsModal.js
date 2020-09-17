/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {StyleSheet, Text, View, Dimensions, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import RadioGroup from './RadioGroup';

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
});

const RadioOptionsModal = props => {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const options = props.options.map(d => {
    return {
      label: d,
      size: 24,
      selected: d === props.value,
    };
  });

  return (
    <Modal
      isVisible={props.isVisible}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      onBackdropPress={props.onBackdropPress}>
      <View style={styles.optionsModalView}>
        <Text style={styles.modalHeaderText}>{props.title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <RadioGroup radioButtons={options} onPress={props.onSelectOption} />
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Button
            type="clear"
            title="OK"
            titleStyle={styles.modalFooterText}
            onPress={props.okFunction}
          />
        </View>
      </View>
    </Modal>
  );
};

RadioOptionsModal.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  options: PropTypes.array,
  okFunction: PropTypes.func.isRequired,
  onBackdropPress: PropTypes.func,
  onSelectOption: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

RadioOptionsModal.defaultProps = {
  onBackdropPress: () => {},
  value: '',
  options: [],
};

export default RadioOptionsModal;
