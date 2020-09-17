import React from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    zIndex: 10,
  },
});

class ProgressiveImage extends React.Component {
  render() {
    const {thumbnail, original, style, ...props} = this.props;
    return (
      <View style={styles.container}>
        <FastImage
          {...props}
          style={{
            style,
          }}
          source={{
            uri: thumbnail,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <FastImage
          {...props}
          style={[styles.imageOverlay, style]}
          source={{
            uri: original,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    );
  }
}
export default ProgressiveImage;
