/* eslint-disable global-require */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'rgba(196, 196, 196, 0.9)',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
  },
  cardBodyText: {
    color: '#828282',
    fontFamily: 'Muli-Regular',
    fontSize: 12,
  },
  imageIcon: {
    alignSelf: 'center',
  },
  careCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 10,
    ...elevationShadowStyle(5),
    marginHorizontal: 1,
  },
  careCardInner: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  cardImageContainer: {
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardText: {
    flex: 3.5,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  selectedIcon: {
    height: 20,
    width: 20,
  },
});

const CardIconViewSelect = props => {
  return (
    <View style={styles.careCard}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={styles.careCardInner}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <View
              style={[
                styles.cardImageContainer,
                {
                  height: props.imageSize,
                  width: props.imageSize,
                  backgroundColor: props.imageBackgroundColor,
                  borderRadius: props.cardImageBorderRadius,
                },
              ]}>
              {props.icon && props.icon.thumbnail ? (
                <FastImage
                  style={{width: 65, height: 65, borderRadius: 150}}
                  source={{
                    uri: props.icon.thumbnail,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : props.image ? (
                <Image
                  style={[
                    styles.imageIcon,
                    {
                      height: props.isImage ? props.imageSize : 35,
                      width: props.isImage ? props.imageSize : 35,
                    },
                  ]}
                  source={props.image}
                />
              ) : (
                <Image
                  style={[
                    styles.imageIcon,
                    {
                      height: props.isImage ? props.imageSize : 35,
                      width: props.isImage ? props.imageSize : 35,
                    },
                  ]}
                  source={require('../assets/user-default.png')}
                />
              )}
              {/* {props.iconComponent ? (
                props.iconComponent
              ) : props.icon ? (
                <FastImage
                  style={{
                    height: 65,
                    width: 65,
                    borderRadius: 100 / 2,
                  }}
                  source={{
                    uri: isURLFromAegle(props.icon)
                      ? `${IMAGE_URL}${props.icon.split('/')[4]}`
                      : props.icon,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <Image
                  source={require('../assets/user-default.png')}
                  style={{height: 55, width: 55}}
                />
              )
              // <Image
              //   style={[
              //     styles.imageIcon,
              //     {
              //       height: props.isImage ? props.imageSize : 35,
              //       width: props.isImage ? props.imageSize : 35,
              //     },
              //   ]}
              //   source={props.icon}
              // />
              } */}
            </View>
          </View>

          <View style={styles.cardText}>
            <View>
              <Text style={styles.cardHeaderText}>{props.headText}</Text>
              {props.subText ? (
                <Text style={styles.cardBodyText}>{props.subText}</Text>
              ) : null}
            </View>
          </View>

          <View style={{justifyContent: 'center', width: 22}}>
            {props.selected ? (
              <Image
                source={require('../assets/icon-selected.png')}
                style={styles.selectedIcon}
              />
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

CardIconViewSelect.propTypes = {
  headText: PropTypes.string.isRequired,
  subText: PropTypes.string,
  iconComponent: PropTypes.any,
  icon: PropTypes.any.isRequired,
  image: PropTypes.any,
  imageBackgroundColor: PropTypes.string,
  isImage: PropTypes.bool,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  imageSize: PropTypes.number,
  cardImageBorderRadius: PropTypes.number,
};

CardIconViewSelect.defaultProps = {
  subText: null,
  iconComponent: null,
  imageBackgroundColor: '#0066F5',
  onPress: () => {},
  selected: false,
  isImage: false,
  imageSize: 65,
  cardImageBorderRadius: 10,
};

export default CardIconViewSelect;
