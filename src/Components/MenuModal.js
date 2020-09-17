/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import shortid from 'shortid';

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
    fontFamily: 'Muli-Bold',
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  modalBodyText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 18,
    marginLeft: 10,
    marginVertical: 0,
  },
  modalFooterText: {
    color: '#1B2CC1',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    marginLeft: 15,
  },
});

const MenuModal = props => {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const options = props.options.map(d => {
    return (
      <Button
        key={shortid.generate()}
        type="clear"
        title={d.title}
        containerStyle={{
          alignSelf: 'flex-start',
          marginVertical: 5,
        }}
        titleStyle={styles.modalBodyText}
        icon={d.icon}
        onPress={d.onPress}
      />
    );
  });
  return (
    <Modal
      isVisible={props.isVisible}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      onBackdropPress={props.onBackdropPress}>
      <View style={styles.optionsModalView}>
        <Text style={styles.modalHeaderText}>{props.title}</Text>
        {options}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Button
            type="clear"
            title="CANCEL"
            titleStyle={styles.modalFooterText}
            onPress={props.cancelFunction}
          />
        </View>
      </View>
    </Modal>
  );
};

MenuModal.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  cancelFunction: PropTypes.func.isRequired,
  onBackdropPress: PropTypes.func,
  isVisible: PropTypes.bool.isRequired,
};

MenuModal.defaultProps = {
  onBackdropPress: () => {},
};

export default MenuModal;
