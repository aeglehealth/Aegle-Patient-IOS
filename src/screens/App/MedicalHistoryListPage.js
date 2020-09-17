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
import ActivityIndicatorPage from '../../screens/App/ActivityIndicatorPage';
import {Query} from 'react-apollo';
import {GET_MEDICAL_HISTORY} from '../../QueryAndMutation';

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class MedicalHistoryListPage extends React.Component {
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
        {
          title: 'Malaria treatment',
          description:
            'Took 3 tablets of amatem and paracetamol for 3 days and you would feel better after taking it.',
        },
        // {
        // 	title: "Typhoid treatment",
        // 	description:
        // 		"Took 3 tablets of amatem and paracetamol for 3 days and you would feel better after taking it.",
        // 	onPress: () => {
        // 		this.props.navigation.navigate("PrescriptionDetail");
        // 	}
        // }
      ],
    };
  }

  render() {
    const cards = data =>
      data.map(d => {
        return (
          <CommonListItemNoImage
            key={shortid.generate()}
            title={d.title}
            description={d.description}
            onPress={() => {
              this.props.navigation.navigate('MedicalHistoryEdit', {
                medicalHistory: d,
              });
            }}
          />
        );
      });

    return (
      <Query query={GET_MEDICAL_HISTORY} fetchPolicy="cache-and-network">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return <Text>There was an error</Text>;

          return (
            <View style={{flex: 1, justifyContent: 'space-between'}}>
              <ListScrollView
                emptyIcon={require('../../assets/empty-medical-history.png')}
                emptyMessage="You do not have any medical history. Tap the round button at the buttom of your screen to create one."
                title="Medical History"
                listItems={cards(data.getAllPatientMedicalHistory)}
              />
              <FloatingAction
                color="#1B2CC1"
                onPressItem={() => {
                  this.props.navigation.navigate('MedicalHistoryAdd');
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
