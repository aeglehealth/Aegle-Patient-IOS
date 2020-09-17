import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {styles} from './styles';
import {currencyFormat} from '../../../Utils/currencyFormat';
import {
  capitalize,
  capitalizeEachWord,
} from '../../../Utils/capitalizeFirstLetter';
import {dateFormatter2} from '../../../Utils/dateFormater';
import {
  CANCEL_SUBSCRIPTION,
  ACTIVE_SUBSCRIPTION,
} from '../../../QueryAndMutation';
import ShowMessage, {type} from '../../../Components/toster/ShowMessage';
import {withApollo} from 'react-apollo';

class HasPlan extends Component {
  state = {
    loading: false,
  };

  render() {
    const {price, expiresIn, entity, name, navigation, renew} = this.props;
    const {loading} = this.state;
    return (
      <>
        {renew && (
          <View>
            <View style={styles.hasPlanContainer}>
              <View style={styles.view1}>
                <View>
                  <Image
                    source={require('../../../assets/v1.png')}
                    style={styles.img}
                  />
                  <Image
                    source={require('../../../assets/v2.png')}
                    style={styles.img2}
                  />
                  <Image
                    source={require('../../../assets/v2.png')}
                    style={{...styles.img2, top: -21}}
                  />
                </View>
                <View style={{...styles.eachTab, ...styles.dateEnd}}>
                  <Text style={{color: '#fff'}}>{`Ends ${dateFormatter2(
                    expiresIn,
                  )}`}</Text>
                </View>
              </View>

              <View>
                <Text
                  style={{
                    ...styles.subAmountText,
                    textAlign: 'left',
                    color: '#fff',
                  }}>
                  {' '}
                  {'\u20A6'}
                  {currencyFormat(price)}
                </Text>
                <Text
                  style={{
                    ...styles.smallHeaderSubText,
                    textAlign: 'left',
                    marginLeft: 12,
                  }}>
                  {' '}
                  {`${capitalize(entity)} ${capitalizeEachWord(name)} Plan`}
                </Text>
              </View>
              <TouchableOpacity
                disabled={loading}
                style={{
                  ...styles.buttonSolidStyle,
                  ...styles.btnStyleAdjust,
                }}
                onPress={async () => {
                  console.log(this.props, 'press');
                  this.setState({loading: true});
                  try {
                    const cancel = await this.props.client.mutate({
                      mutation: CANCEL_SUBSCRIPTION,
                      variables: {data: {entity: entity.toUpperCase()}},
                      awaitRefetchQueries: true,
                      refetchQueries: [
                        {
                          query: ACTIVE_SUBSCRIPTION,
                        },
                      ],
                    });
                    console.log(cancel, 'cancel');
                    if (cancel && cancel.data.cancelSubscription.name == name) {
                      ShowMessage(type.DONE, 'Subscription cancelled');
                      setTimeout(() => {
                        navigation.navigate('Subscription');
                      }, 3000);
                    }
                    this.setState({loading: false});
                  } catch (err) {
                    this.setState({loading: false});
                    ShowMessage(type.ERROR, err);
                  }
                }}>
                {loading ? (
                  <ActivityIndicator style={{padding: 3}} color={'#fff'} />
                ) : (
                  <Text style={styles.buttonSolidTitleStyle}>CANCEL</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    );
  }
}

export default withApollo(HasPlan);
