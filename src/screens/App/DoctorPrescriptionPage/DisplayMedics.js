import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import EmptyContent from '../../../Components/EmptyContent';
const DisplayMedics = ({prescriptionData}) => {
  return (
    <FlatList
      data={prescriptionData}
      ListEmptyComponent={<EmptyContent text="No Prescription" />}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text>{item.title}</Text>
          </View>

          <View style={styles.dose}>
            <Text>{item.dose}</Text>
          </View>
        </View>
      )}
    />
  );
};

export default DisplayMedics;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.999,
    borderTopColor: '#e5e5e5',
    borderBottomWidth: 0.999,
    borderBottomColor: '#e5e5e5',
    borderRadius: 5,
    width: '94%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: 60,
    marginTop: 30,
  },
  title: {
    width: '50%',
    height: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dose: {
    width: '50%',
    borderLeftWidth: 0.999,
    borderLeftColor: '#ececec',
    height: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

DisplayMedics.propTypes = {
  prescriptionData: PropTypes.array,
};
