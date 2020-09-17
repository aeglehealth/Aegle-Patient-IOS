/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Input, Button} from 'react-native-elements';
import CardIconViewSelect from '../../Components/CardIconViewSelect';
import {HeaderLeft} from '../../Components/HeaderLeft';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 31,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  buttonStyle: {
    backgroundColor: '#1B2CC1',
    marginBottom: 20,
    marginTop: 43,
    paddingVertical: 15,
  },
  buttonTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'muli-bold',
  },
  membershipInput: {
    marginTop: 30,
    marginBottom: 20,
    borderBottomColor: '#B4B4B4',
  },
  textSmall: {
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    color: '#828282',
    marginVertical: 5,
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
  },
});

export default class MembershipTypePage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={{paddingHorizontal: 15}}
          showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.headerText}>Membership Type</Text>
          </View>
          <View style={{paddingHorizontal: 5}}>
            <CardIconViewSelect
              headText="Aegle"
              icon={require('../../assets/icon-mark.png')}
              selected
              imageBackgroundColor="#1B2CC1"
              cardImageBorderRadius={40}
            />
          </View>

          <View style={{marginVertical: 20}}>
            <Input
              placeholder="Enter membership code"
              inputContainerStyle={styles.membershipInput}
            />
            <Button
              type="solid"
              title="APPLY"
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonTitleStyle}
            />
            <Text style={styles.textSmall}>
              Note: Membership codes and promo codes are different. If you have
              a promo code, please go back to the previous menu and select
              ‘Subscription’.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
