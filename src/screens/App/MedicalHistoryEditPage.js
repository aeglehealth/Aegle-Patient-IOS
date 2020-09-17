/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, View, Image, TouchableHighlight, Text} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import CommonEditView from '../../Components/CommonEditView';
import {Mutation} from 'react-apollo';
import ActivityIndicator from '../App/ActivityIndicatorPage';
import {
  UPDATE_MEDICAL_HISTORY,
  GET_MEDICAL_HISTORY,
} from '../../QueryAndMutation';

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

export default class MedicalHistoryEditPage extends React.Component {
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
          mutation={UPDATE_MEDICAL_HISTORY}
          awaitRefetchQueries={true}
          refetchQueries={[
            {
              query: GET_MEDICAL_HISTORY,
            },
          ]}>
          {(updateMedicalHistory, {loading, error}) => (
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
                params.handleUpdateMedicalHistory(updateMedicalHistory, loading)
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
      medicalHistory: {
        title: '',
        description: '',
        medicalHistoryId: '',
      },
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const medicalHistory = navigation.getParam('medicalHistory', null);

    if (medicalHistory == null) {
      this.setState({
        medicalHistory: {
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
        medicalHistory,
        isEdit: false,
      });
      this.props.navigation.setParams({
        isEdit: false,
        editData: this.editData,
      });
    }
    this.props.navigation.setParams({
      handleUpdateMedicalHistory: this.handleUpdateMedicalHistory,
    });
  }

  handleUpdateMedicalHistory = async (updateMedicalHistory, loading) => {
    const {title, description, id} = this.state.medicalHistory;
    const data = {
      title,
      description,
    };
    medicalHistoryId = id;
    console.log(title, description, medicalHistoryId, 'jj');
    await updateMedicalHistory({
      variables: {data, medicalHistoryId},
    })
      .then(res => {
        console.log(res);
        this.props.navigation.navigate('CompletedAction', {
          title: 'Updated!',
          subTitle: 'Voila! You have successfully Updated that medical history',
          onCompleted: () => {
            this.props.navigation.goBack();
          },
        });
      })
      .catch(err => <Text>{err}</Text>);
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
    const {medicalHistory} = this.state;
    console.log(medicalHistory.id, 'medicalHistory');
    return (
      <View style={styles.container}>
        <CommonEditView
          titlePlaceholder="Title"
          descriptionPlaceholder="Describe your medical history"
          title={medicalHistory.title}
          description={medicalHistory.description}
          editable={true}
          onChangeDescriptionText={text =>
            this.setState(prevState => ({
              medicalHistory: {
                ...prevState.medicalHistory,
                description: text,
              },
            }))
          }
          onChangeTitleText={text =>
            this.setState(prevState => ({
              medicalHistory: {...prevState.medicalHistory, title: text},
            }))
          }
        />
      </View>
    );
  }
}
