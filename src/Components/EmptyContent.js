import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import propTypes from 'prop-types';
const EmptyContent = ({text}) => (
  <View>
    <Image
      style={styles.emptyIcon}
      source={require('../assets/empty-appointment.png')}
    />
    <Text
      style={[styles.bodyText, {textAlign: 'center', marginHorizontal: 20}]}>
      {text}
    </Text>
  </View>
);

export default EmptyContent;

const styles = StyleSheet.create({
  bodyText: {
    color: '#555',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    marginBottom: 30,
  },
  emptyIcon: {
    alignSelf: 'center',
    maxWidth: 200,
    maxHeight: 200,
    marginTop: 20,
  },
});

EmptyContent.propTypes = {
  text: propTypes.string.isRequired,
};
