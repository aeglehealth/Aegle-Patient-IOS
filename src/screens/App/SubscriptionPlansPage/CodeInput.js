import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {HeaderLeft} from '../../../Components/HeaderLeft';
import {APPLY_PROMOTION, ACTIVE_SUBSCRIPTION} from '../../../QueryAndMutation';
import {withApollo} from 'react-apollo';
import ShowMessage, {type} from '../../../Components/toster/ShowMessage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    width: '100%',
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
    paddingVertical: 15,
  },
  buttonSolidStyleDisabled: {
    backgroundColor: '#cccccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingVertical: 15,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    alignSelf: 'center',
    // paddingVertical: 18,
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

class CardPaymentPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    code: '',
    loader: false,
  };

  confirm = async () => {
    const {route} = this.props.navigation.state.params;

    this.setState({loader: true});
    try {
      const res = await this.props.client.mutate({
        mutation: APPLY_PROMOTION,
        variables: {
          code: this.state.code,
        },
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: ACTIVE_SUBSCRIPTION,
          },
        ],
      });
      if (res) {
        const {
          applyPromotion: {status},
        } = res.data;
        if (status == 'success') {
          ShowMessage(type.DONE, 'Transaction Successful');
          setTimeout(
            () =>
              this.props.navigation.navigate(
                `${route == 'app' ? 'Subscription' : 'Home'}`,
              ),
            3000,
          );
        }
      }
    } catch (err) {
      this.setState({loader: false});
    }
  };

  render() {
    const {
      navigation: {
        state: {
          params: {title},
        },
      },
    } = this.props;
    const {code, loader} = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <View style={{width: '80%', alignSelf: 'center', marginTop: 50}}>
          <TextInput
            value={this.state.code}
            onChangeText={text => {
              this.setState({
                code: text,
              });
            }}
            style={{
              borderBottomColor: '#1B2CC1',
              borderBottomWidth: 1,
              fontSize: 32,
              textAlign: 'center',
            }}
            placeholder={title}
          />
        </View>
        <Text
          style={{
            width: '80%',
            alignSelf: 'center',
            textAlign: 'center',
            marginVertical: 40,
            color: '#575757',
          }}>
          Enter the code and it will be applied to your next appointment.
        </Text>
        <View>
          <TouchableOpacity disabled={loader || !code} onPress={this.confirm}>
            <View
              style={
                loader || !code
                  ? styles.buttonSolidStyleDisabled
                  : styles.buttonSolidStyle
              }>
              {loader ? (
                <ActivityIndicator size={'small'} color="#fff" />
              ) : (
                <Text style={styles.buttonSolidTitleStyle}>APPLY</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withApollo(CardPaymentPage);
