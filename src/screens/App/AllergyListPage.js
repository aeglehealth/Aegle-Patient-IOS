/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import shortid from 'shortid';
import {FloatingAction} from 'react-native-floating-action';
import {Icon} from 'react-native-elements';
import ListScrollView from '../../Components/ListScrollView';
import CommonListItemNoImage from '../../Components/CommonListItemNoImage';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {Query} from 'react-apollo';
import {GET_ALLERGIES} from '../../QueryAndMutation';
import ActivityIndicatorPage from '../../screens/App/ActivityIndicatorPage';
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class AllergyListPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      listOptions: [
        // {
        // 	title: "Malaria treatment",
        // 	description:
        // 		"Took 3 tablets of amatem and paracetamol for 3 days and you would feel better after taking it."
        // }
      ],
    };
  }

  // makeid = length => {
  // 	let result = "";
  // 	const characters =
  // 		"AB CD EFGH IJKLMNOPQRSTUVWXY Zabcd efghijk lmnop qrstuvwx yz01234 56789";
  // 	const charactersLength = characters.length;
  // 	for (let i = 0; i < length; i += 1) {
  // 		result += characters.charAt(Math.floor(Math.random() * charactersLength));
  // 	}
  // 	return result;
  // };

  render() {
    const cards = data =>
      data.map(d => {
        return (
          <CommonListItemNoImage
            key={shortid.generate()}
            title={d.title}
            description={d.description}
            onPress={() => {
              this.props.navigation.navigate('AllergyEdit', {
                allergy: d,
              });
            }}
          />
        );
      });

    return (
      <Query query={GET_ALLERGIES} fetchPolicy="cache-and-network">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return <Text>There was an error</Text>;

          return (
            <View style={{flex: 1, justifyContent: 'space-between'}}>
              <ListScrollView
                emptyIcon={require('../../assets/empty-allergy.png')}
                emptyMessage="You do not have any allergy. Tap the round button at the buttom of your screen to create one."
                title="Allergies"
                listItems={cards(data.getAllPatientAllergies)}
              />
              <FloatingAction
                color="#1B2CC1"
                onPressItem={() => {
                  this.props.navigation.navigate('AllergyAdd');
                }}
                distanceToEdge={20}
                overrideWithAction
                actions={[
                  {
                    text: 'Create',
                    name: 'bt_create',
                    icon: (
                      <Icon
                        type="material-community"
                        name="plus"
                        color="#fff"
                      />
                    ),
                    position: 1,
                  },
                ]}
              />
            </View>
          );
        }}
      </Query>
    );
  }
}
