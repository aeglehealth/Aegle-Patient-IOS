import React from 'react';
import {StyleSheet, View, Image, Text, TouchableHighlight} from 'react-native';
import shortid from 'shortid';
import {FloatingAction} from 'react-native-floating-action';
import {Icon} from 'react-native-elements';
import ListScrollView from '../../Components/ListScrollView';
import DialogModal from '../../Components/DialogModal';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {DELETE_CARD, GET_USER_CARDS} from '../../QueryAndMutation';
import {Mutation, withApollo} from 'react-apollo';
import ActivityIndicatorPage from './ActivityIndicatorPage';
import {capitalize} from '../../Utils/capitalizeFirstLetter';

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
  selectedIcon: {
    height: 20,
    width: 20,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

class CardListPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  state = {
    deleteModal: false,
    id: '',
    cardList: [
      {
        cardType: '',
        last4: '',
      },
    ],
  };

  async UNSAFE_componentWillMount() {
    const res = await this.props.client.query({query: GET_USER_CARDS});
    const {id, cardType, last4} = res.data.getUserCards[0];

    const {cardList} = {...this.state};
    cardList[0].cardType = cardType;
    cardList[0].last4 = last4;

    this.setState({cardList, id});
  }

  closeModal = () => {
    this.setState({
      deleteModal: false,
    });
  };

  openModal = () => {
    this.setState({
      deleteModal: true,
    });
  };

  render() {
    let visa, verve, masterCard;

    const cards =
      this.state.cardList[0].cardType &&
      this.state.cardList.map(d => {
        return (
          <View style={styles.careCard} key={shortid.generate()}>
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
                  d.cardType.trim(),
                )}-${d.last4}`}</Text>
              </View>
            </View>
            <View style={{justifyContent: 'center', width: 22}}>
              <TouchableHighlight
                onPress={this.openModal}
                underlayColor="rgba(0,0,0,0.01)">
                <Image
                  source={require('../../assets/icon-cancel.png')}
                  style={styles.selectedIcon}
                />
              </TouchableHighlight>
            </View>
          </View>
        );
      });

    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <ListScrollView
          emptyIcon={require('../../assets/empty-card.png')}
          emptyMessage="You have not added any cards."
          title="Cards"
          listItems={cards}
        />
        <FloatingAction
          color="#1B2CC1"
          onPressItem={() => {
            this.props.navigation.navigate('CardPayment');
          }}
          distanceToEdge={20}
          overrideWithAction
          actions={[
            {
              text: 'Create',
              name: 'bt_create',
              icon: <Icon type="material-community" name="plus" color="#fff" />,
              position: 1,
            },
          ]}
        />

        <Mutation
          mutation={DELETE_CARD}
          awaitRefetchQueries={true}
          refetchQueries={[
            {
              query: GET_USER_CARDS,
            },
          ]}>
          {(deleteUserCard, {loading: loadingMutation}) => (
            <DialogModal
              loadingProp={loadingMutation}
              isVisible={this.state.deleteModal}
              onBackdropPress={this.closeModal}
              question="Are you sure you want to delete this assessment?"
              title="Delete Card"
              NoFunction={this.closeModal}
              YesFunction={async () => {
                await deleteUserCard({
                  variables: {
                    cardId: this.state.id,
                  },
                })
                  .then(res => {
                    console.log(res);
                    this.setState({
                      deleteModal: false,
                    });
                    this.props.navigation.navigate('CompletedAction', {
                      title: 'Deleted!',
                      subTitle:
                        'Voila! You have successfully deleted this Assessment',
                      onCompleted: () => {
                        this.props.navigation.popToTop();
                      },
                    });
                  })
                  .catch(err => console.log(err, 'There was an error'));
              }}
            />
          )}
        </Mutation>
      </View>
    );
  }
}

export default withApollo(CardListPage);
