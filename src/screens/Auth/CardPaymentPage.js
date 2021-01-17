import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CustomIconInput from '../../Components/CustomIconInput';
import StackedLabelInput from '../../Components/StackedLabelInput';
import {HeaderLeft} from '../../Components/HeaderLeft';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 5,
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    alignSelf: 'center',
    paddingVertical: 18,
  },
  paystackText: {
    color: '#28B446',
    fontSize: 14,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class CardPaymentPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  };

  confirm = () => {
    const {cardNumber, expiryDate, cvv} = this.state;
    if ((cardNumber, expiryDate, cvv)) {
      let cardDetails = {};
      let expiryMonth = expiryDate.split('/')[0];
      let expiryYear = expiryDate.split('/')[1];

      cardDetails.cardNumber = cardNumber;
      cardDetails.expiryMonth = expiryMonth;
      cardDetails.expiryYear = expiryYear;
      cardDetails.cvv = cvv;

      AsyncStorage.setItem('cardDetails', JSON.stringify(cardDetails));
    } else {
      return;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.headerText}>Add Card</Text>
        </View>
        <View>
          <CustomIconInput
            label="Card Number"
            value={this.state.cardNumber}
            onChangeText={text => {
              this.setState({
                cardNumber: text,
              });
            }}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <StackedLabelInput
              label="Expiry Date"
              placeholder="MM/YY"
              value={this.state.expiryDate}
              onChangeText={text => {
                this.setState({
                  expiryDate: text,
                });
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <CustomIconInput
              label="CVV"
              value={this.state.cvv}
              onChangeText={text => {
                this.setState({
                  cvv: text,
                });
              }}
            />
          </View>
        </View>

        <View style={{marginTop: 40}}>
          <TouchableOpacity
            style={styles.buttonSolidStyle}
            onPress={this.confirm}>
            <Text style={styles.buttonSolidTitleStyle}>CONFIRM</Text>
          </TouchableOpacity>
          <Text style={styles.paystackText}>*Powered by Paystack</Text>
        </View>
      </View>
    );
  }
}
