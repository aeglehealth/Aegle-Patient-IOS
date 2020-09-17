/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, View, TouchableHighlight, Image} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import CommonEditView from '../../Components/CommonEditView';
import {Mutation} from 'react-apollo';
import {UPDATE_ALLERGY, GET_ALLERGIES} from '../../QueryAndMutation';
import ActivityIndicator from '../App/ActivityIndicatorPage';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  clearButtonTitle: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
  },
  floatingButtonIcon: {
    height: 25,
    width: 25,
  },
});

export default class AllergyEditPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerRightContainerStyle: {
        paddingRight: 10,
      },
      headerLeftContainerStyle: {
        paddingLeft: 10,
      },
      headerRight: params.isEdit ? (
        <Mutation
          mutation={UPDATE_ALLERGY}
          awaitRefetchQueries={true}
          refetchQueries={[
            {
              query: GET_ALLERGIES,
            },
          ]}>
          {(updateAllergy, {loading}) => (
            <Button
              type="clear"
              title={
                loading ? (
                  <View style={{width: 3, height: 3}}>
                    <ActivityIndicator size="small" />
                  </View>
                ) : (
                  'SAVE'
                )
              }
              titleStyle={styles.clearButtonTitle}
              onPress={() =>
                params.handleUpdateAllergies(updateAllergy, loading)
              }
            />
          )}
        </Mutation>
      ) : (
        <TouchableHighlight
          onPress={params.editData}
          underlayColor="rgba(0,0,0,0.01)">
          <Image
            source={require('../../assets/icon-pen-dark.png')}
            style={styles.floatingButtonIcon}
          />
        </TouchableHighlight>
      ),
      headerLeft: (
        <Icon
          type="material-community"
          name="close"
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      allergy: {
        title: '',
        description: '',
      },
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const allergy = navigation.getParam('allergy', null);

    if (allergy == null) {
      this.setState({
        allergy: {
          title: '',
          description: '',
        },
        isEdit: true,
      });
      this.props.navigation.setParams({
        isEdit: true,
      });
    } else {
      this.setState({
        allergy,
        isEdit: false,
      });
      this.props.navigation.setParams({
        isEdit: false,
        editData: this.editData,
      });
    }
    this.props.navigation.setParams({
      handleUpdateAllergies: this.handleUpdateAllergies,
    });
  }
  handleUpdateAllergies = async (updateAllergy, loading) => {
    const {title, description} = this.state.allergy;
    const data = {
      title,
      description,
    };
    const allergyId = this.state.allergy.id;
    await updateAllergy({
      variables: {data, allergyId},
    })
      .then(res => {
        console.log(res);
        this.props.navigation.navigate('CompletedAction', {
          title: 'Updated!',
          subTitle: 'Voila! You have successfully Updated that Allergy',
          onCompleted: () => {
            this.props.navigation.goBack();
          },
        });
      })
      .catch(err => console.log(err, 'There was an error'));
  };
  editData = () => {
    this.setState({
      isEdit: true,
    });
    this.props.navigation.setParams({
      isEdit: true,
    });
  };

  render() {
    const {allergy} = this.state;
    return (
      <View style={styles.container}>
        <CommonEditView
          titlePlaceholder="Allergy title"
          descriptionPlaceholder="Describe your allergy"
          title={allergy.title}
          description={allergy.description}
          editable={true}
          onChangeDescriptionText={text =>
            this.setState(prevState => ({
              allergy: {
                ...prevState.allergy,
                description: text,
              },
            }))
          }
          onChangeTitleText={text =>
            this.setState(prevState => ({
              allergy: {...prevState.allergy, title: text},
            }))
          }
        />
      </View>
    );
  }
}
