/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight, Image} from 'react-native';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import AssessmentPic from '../assets/Assesment_pic.svg';
import FastImage from 'react-native-fast-image';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  cardBodyText: {
    color: '#555555',
    fontFamily: 'muli-bold',
    fontSize: 14,
  },
  cardTimeText: {
    color: 'rgba(85, 85, 85, 0.8)',
    fontFamily: 'Muli-Regular',
    fontSize: 12,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 18,
    marginBottom: 1,
  },
  imageIcon: {
    maxHeight: 65,
    maxWidth: 65,
    alignSelf: 'center',
  },
  careCard: {
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    ...elevationShadowStyle(3),
  },
  careCardInner: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 15,
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: 65,
    height: 65,
    borderRadius: 40,
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});

const CommonListItem = props => {
  const {image, original} = props;
  console.log(image, 'image')
  return (
    <View
      style={{
        ...props.cardStyle,
        backgroundColor: props.disabled ? '#d1d1d1' : '#ffffff',
      }}
      key={shortid.generate()}>
      <TouchableHighlight
        underlayColor="rgba(0, 0, 0, 0.03)"
        onPress={props.onPress}>
        <View style={props.cardInnerStyle}>
          <View
            style={{
              flex: 0.9,
              justifyContent: 'center',
            }}>
            <View style={props.imageContainerStyle}>
              {image && image.original ? (
                <FastImage
                  style={{
                    height: 65,
                    width: 65,
                    borderRadius: 100 / 2,
                  }}
                  source={{
                    uri: original ? image.thumbnail: image.thumbnail,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : props.staticImage ? (
                <AssessmentPic width={25} height={25} />
              ) : (
                <Image
                  source={require('../assets/user-default.png')}
                  style={props.imageIconStyle}
                />
              )}
            </View>
          </View>

          <View style={styles.cardText}>
            <View>
              <Text style={styles.cardHeaderText}>{props.title}</Text>
              <Text
                style={{...styles.cardBodyText, textTransform: 'capitalize'}}>
                {props.firstDesc}
              </Text>
              <Text style={styles.cardTimeText}>{props.secondDesc}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

CommonListItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.any.isRequired,
  staticImage: PropTypes.bool,
  firstDesc: PropTypes.string.isRequired,
  secondDesc: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  imageContainerStyle: PropTypes.object,
  imageIconStyle: PropTypes.object,
  cardStyle: PropTypes.object,
  cardInnerStyle: PropTypes.object,
};

CommonListItem.defaultProps = {
  onPress: () => {},
  imageContainerStyle: styles.cardImageContainer,
  imageIconStyle: styles.imageIcon,
  cardStyle: styles.careCard,
  cardInnerStyle: styles.careCardInner,
};

export default CommonListItem;
