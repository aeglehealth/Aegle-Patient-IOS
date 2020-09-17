import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import GradientButton from '../GradientButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {styles} from './styles';
import FastImage from 'react-native-fast-image';

const index = ({navigation}) => {
  const photo = navigation.getParam('image');
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff90',
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{backgroundColor: '', flex: 1, marginTop: 15, marginLeft: 10}}>
        <AntDesign name="arrowleft" size={28} />
      </TouchableOpacity>
      <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
      <View style={styles.mainBox}>
        {photo && photo ? (
          <FastImage
            style={styles.headerImageIcon}
            source={{
              uri: photo,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Image
            style={styles.headerImageIcon}
            source={require('../../assets/user-default-white.png')}
          />
        )}
      </View>
      <View style={{backgroundColor: '', flex: 1}}>
        
      </View>
    </View>
  );
};

export default index;
