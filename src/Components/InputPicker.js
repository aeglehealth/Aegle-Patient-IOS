import React, {useState} from 'react';
import {StyleSheet, Picker, View} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import propTypes from 'prop-types';

export const InputPicker = ({
  PickerOptions,
  placeholder,
  pickerStyle,
  pickerContainerStyle,
  onValueChange,
  selectedValue,
  ...otherProps
}) => {
  const [val, setVal] = useState('');

  const PickerItem = PickerOptions.map(item => (
    <Picker.Item key={item.value} label={item.label} value={item.value} />
  ));
  return (
    <View style={{...styles.pickerContainerView, ...pickerContainerStyle}}>
      <Picker
        selectedValue={selectedValue}
        style={{...styles.pickerStyle, ...pickerStyle}}
        onValueChange={onValueChange}
        {...otherProps}>
        <Picker.Item label={placeholder || 'Select'} value="" />
        {PickerItem}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainerView: {
    marginBottom: 5,
    // width: "100%",
    height: 42,
    backgroundColor: '#f5f5f5',
    borderRadius: 3,
    paddingHorizontal: 1,
  },
  pickerStyle: {
    // width: "100%",
    borderRadius: 3,
    height: '100%',
  },
});

InputPicker.propTypes = {
  placeholder: propTypes.string,
  selectedValue: propTypes.string.isRequired,
  onValueChange: propTypes.func.isRequired,
  pickerContainerView: propTypes.object,
  PickerOptions: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.string.isRequired,
      value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    }),
  ).isRequired,
};
