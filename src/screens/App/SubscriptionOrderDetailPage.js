/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import shortid from 'shortid';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {CurrencyFormat} from '../../Utils/currencyFormatter/index';
import {Mutation} from 'react-apollo';
import {capitalize} from '../../Utils/capitalizeFirstLetter';
import {SUBSCRIBE_PLAN} from '../../QueryAndMutation';

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  bodyText: {
    color: '#555',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    marginBottom: 30,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 10,
  },
  cardNumberText: {
    color: '#828282',
    fontFamily: 'Muli-Regular',
    fontSize: 18,
  },
  imageIcon: {
    maxHeight: 65,
    maxWidth: 65,
    alignSelf: 'center',
  },
  careCard: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    ...elevationShadowStyle(6),
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#FFF',
    width: 65,
    height: 65,
    overflow: 'hidden',
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  orderCard: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    ...elevationShadowStyle(6),
  },
  orderAmount: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 26,
    textAlign: 'center',
  },
  orderDescription: {
    color: '#555',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  orderTerms: {
    color: '#0066F5',
    fontFamily: 'Muli-Bold',
    fontSize: 14,
    textAlign: 'left',
  },
  addCard: {
    color: '#0066F5',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    textAlign: 'left',
    marginVertical: 15,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    borderRadius: 5,
    marginVertical: 15,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    alignSelf: 'center',
    paddingVertical: 18,
  },
  disabledBtnStyle: {
    backgroundColor: '#edeef2',
    borderRadius: 5,
    marginVertical: 15,
  },
  disabledBtnTitleStyle: {
    color: '#1B2CC1',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    alignSelf: 'center',
    paddingVertical: 18,
  },
});

export default class SubscriptionOrderDetailPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  async UNSAFE_componentWillMount() {
    const res = await this.props.client.query({query: GET_USER_CARDS});
    const {id, cardType, last4} = res.data.getUserCards[0];

    const {cardList} = {...this.state};
    cardList[0].cardType = cardType;
    cardList[0].last4 = last4;

    this.setState({cardList, id});
  }

  state = {
    id: '',
    cardList: [
      {
        cardType: '',
        last4: '',
      },
    ],
    amount: this.props.navigation.state.params.amount,
    purpose: this.props.navigation.state.params.purpose,
    email: this.props.navigation.state.params.email,
    code: this.props.navigation.state.params.code,
  };

  render() {
    let visa, verve, masterCard;

    const cards =
      this.state.cardList[0].cardType &&
      this.state.cardList.map(d => {
        return (
          <TouchableHighlight
            key={shortid.generate()}
            onPress={() => {
              this.props.navigation.navigate('CardList');
            }}
            underlayColor="rgba(0,0,0,0.01)">
            <View style={styles.careCard}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <View style={styles.cardImageContainer}>
                  <Image
                    style={styles.imageIcon}
                    source={
                      d.cardType === 'verve '
                        ? verve
                        : d.cardType === 'mastercard'
                        ? masterCard
                        : visa
                    }
                  />
                </View>
              </View>

              <View style={styles.cardText}>
                <View>
                  <Text style={styles.cardNumberText}>{`${capitalize(
                    d.cardType,
                  )}-${d.last4}`}</Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        );
      });

    const {amount, purpose, email, code} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          style={{paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.headerText}>Order Details</Text>
            <Text style={styles.bodyText}>
              Choose a subscription plan that best suits you. Note if you have
              an appointment then you’ll need to subscribe for a minimum of 3
              months. Otherwise you may cancel at any time.
            </Text>
          </View>
          <View>
            <View style={styles.orderCard}>
              <Text style={styles.orderAmount}>
                {'\u20A6'}
                {CurrencyFormat(amount)}
              </Text>
              <Text style={styles.orderDescription}>
                {purpose === 'BASIC' || purpose === 'PREMIUM'
                  ? `Monthly`
                  : 'Daily'}{' '}
                Subscription
              </Text>
              <Text style={styles.orderTerms}>Terms &amp; Conditions</Text>
            </View>
          </View>
          <Text
            style={{
              fontFamily: 'Muli-Regular',
              fontSize: 14,
              marginVertical: 10,
            }}>
            DEBIT CARDS
          </Text>
          {!this.state.cardList.cardType ? (
            <TouchableHighlight
              onPress={() => {
                this.props.navigation.navigate('CardPayment');
              }}
              underlayColor="rgba(0,0,0,0.01)">
              <View style={[styles.careCard, {paddingVertical: 10}]}>
                <View>
                  <Text style={styles.addCard}>Add Card</Text>
                </View>
              </View>
            </TouchableHighlight>
          ) : (
            cards
          )}
          <Mutation mutation={SUBSCRIBE_PLAN}>
            {initializePaymentOnMobile => (
              <TouchableOpacity
                style={
                  this.state.cardList.length === 0
                    ? styles.disabledBtnStyle
                    : styles.buttonSolidStyle
                }
                disabled={this.state.cardList.length === 0}>
                {this.state.loading ? (
                  <ActivityIndicator
                    size="small"
                    color="white"
                    style={{padding: 13}}
                  />
                ) : (
                  <Text style={styles.buttonSolidTitleStyle}>PAY</Text>
                )}
              </TouchableOpacity>
            )}
          </Mutation>
        </ScrollView>
      </View>
    );
  }
}
