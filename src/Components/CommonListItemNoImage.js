/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';
import shortid from 'shortid';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'rgba(196, 196, 196, 0.8)',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  cardBodyText: {
    color: '#555555',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 18,
    marginBottom: 3,
  },
  careCard: {
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    ...elevationShadowStyle(5),
  },
  careCardInner: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});

const CommonListItemNoImage = props => {
  return (
    <View style={styles.careCard} key={shortid.generate()}>
      <TouchableHighlight
        underlayColor="rgba(0, 0, 0, 0.03)"
        onPress={props.onPress}>
        <View style={styles.careCardInner}>
          <View style={styles.cardText}>
            <View>
              <Text style={styles.cardHeaderText}>{props.title}</Text>
              <Text style={styles.cardBodyText}>
                {props.description.length > 85
                  ? `${props.description.substr(0, 85)}...`
                  : props.description}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

CommonListItemNoImage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

CommonListItemNoImage.defaultProps = {
  onPress: () => {},
};

export default CommonListItemNoImage;
