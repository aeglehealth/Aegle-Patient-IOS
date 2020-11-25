import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

const Phone = () => {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View>
        <SafeAreaView>
          {showMessage && (
            <View>
              <Text>Value : {value}</Text>
              <Text>Formatted Value : {formattedValue}</Text>
              <Text>Valid : {valid ? 'true' : 'false'}</Text>
            </View>
          )}
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="DM"
            onChangeText={text => {
              setValue(text);
            }}
            onChangeFormattedText={text => {
              setFormattedValue(text);
            }}
            withDarkTheme
            withShadow
            autoFocus
          />
          <TouchableOpacity
            onPress={() => {
              const checkValid = phoneInput.current?.isValidNumber(value);
              setShowMessage(true);
              setValid(checkValid ? checkValid : false);
            }}>
            <Text>Check</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </>
  );
};

export const numberFormatter = (formattedValue, country) => {
  const arr = [...formattedValue];
  if (arr[4] == 0 && country == 'NG') {
    arr.splice(4, 1);
    return arr.join('');
  }
  return formattedValue;
};

export default Phone;
