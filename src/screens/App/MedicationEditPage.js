/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, View, Image, TouchableHighlight} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import CommonEditView from '../../Components/CommonEditView';
import {Mutation} from 'react-apollo';
import {UPDATE_MEDICATION, GET_MEDICATION} from '../../QueryAndMutation';
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
    fontFamily: 'muli-bold',
    fontSize: 16,
  },
  floatingButtonIcon: {
    height: 25,
    width: 25,
  },
});

export default class MedicationEditPage extends React.Component {
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
          mutation={UPDATE_MEDICATION}
          awaitRefetchQueries={true}
          refetchQueries={[
            {
              query: GET_MEDICATION,
            },
          ]}>
          {(updateMedication, {loading}) => (
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
                params.handleEditMedication(updateMedication, loading)
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
      medication: {
        title: '',
        description: '',
      },
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const medication = navigation.getParam('medication', null);

    if (medication == null) {
      this.setState({
        medication: {
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
        medication,
        isEdit: false,
      });
      this.props.navigation.setParams({
        isEdit: false,
        editData: this.editData,
      });
    }
    this.props.navigation.setParams({
      handleEditMedication: this.handleEditMedication,
    });
  }

  editData = () => {
    this.setState({
      isEdit: true,
    });
    this.props.navigation.setParams({
      isEdit: true,
    });
  };
  handleEditMedication = async (updateMedication, loading) => {
    const {title, description} = this.state.medication;
    const data = {
      title,
      description,
    };
    const medicationId = this.state.medication.id;
    await updateMedication({
      variables: {data, medicationId},
    })
      .then(res => {
        console.log(res);
        this.props.navigation.navigate('CompletedAction', {
          title: 'Updated!',
          subTitle: 'Voila! You have successfully Updated that Medication',
          onCompleted: () => {
            this.props.navigation.goBack();
          },
        });
      })
      .catch(err => console.log(err, 'There was an error'));
  };
  render() {
    const {medication} = this.state;
    return (
      <View style={styles.container}>
        <CommonEditView
          titlePlaceholder="Title"
          descriptionPlaceholder="Enter your medication"
          title={medication.title}
          description={medication.description}
          editable={true}
          onChangeDescriptionText={text =>
            this.setState(prevState => ({
              medication: {
                ...prevState.medication,
                description: text,
              },
            }))
          }
          onChangeTitleText={text =>
            this.setState(prevState => ({
              medication: {...prevState.medication, title: text},
            }))
          }
        />
      </View>
    );
  }
}
