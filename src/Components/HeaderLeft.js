import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import Arrow from '../assets/arrow.svg';

export function HeaderLeft({navigation}) {
  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View style={{padding: 20}}>
        <Arrow height={18} width={18} />
      </View>
    </TouchableWithoutFeedback>
  );
}
