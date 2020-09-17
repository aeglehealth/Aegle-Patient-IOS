/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {StyleSheet, TextInput, View, ScrollView} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  input: {
    textAlignVertical: 'top',
    borderColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingTop: 5,
    paddingRight: 10,
    fontSize: 17,
    fontFamily: 'Muli-Regular',
    height: 400,
    fontWeight: 'bold',
  },
  inputTitle: {
    borderColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingTop: 5,
    paddingRight: 10,
    fontSize: 18,
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
  },
});

const CommonEditView = props => {
  return (
    <ScrollView
      style={{paddingHorizontal: 10}}
      showsVerticalScrollIndicator={false}>
      <View style={{padding: 10}}>
        <TextInput
          style={styles.inputTitle}
          editable={props.editable}
          value={props.title}
          maxLength={40}
          placeholder={props.titlePlaceholder}
          onChangeText={props.onChangeTitleText}
        />
        <TextInput
          style={styles.input}
          editable={props.editable}
          multiline
          value={props.description}
          placeholder={props.descriptionPlaceholder}
          onChangeText={props.onChangeDescriptionText}
        />
      </View>
    </ScrollView>
  );
};

CommonEditView.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  titlePlaceholder: PropTypes.string,
  descriptionPlaceholder: PropTypes.string,
  onChangeTitleText: PropTypes.func.isRequired,
  onChangeDescriptionText: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

CommonEditView.defaultProps = {
  title: '',
  description: '',
  titlePlaceholder: '',
  descriptionPlaceholder: '',
  editable: false,
};

export default CommonEditView;
