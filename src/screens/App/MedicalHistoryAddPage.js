/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, View, Image, TouchableHighlight} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import CommonEditView from '../../Components/CommonEditView';
import {Mutation} from 'react-apollo';
import {ADD_MEDICAL_HISTORY, GET_MEDICAL_HISTORY} from '../../QueryAndMutation';
import CompletedActionPage from '../../Components/CompletedActionPage';
import ActivityIndicator from '../App/ActivityIndicatorPage';
CompletedActionPage;
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

export default class MedicalHistoryAdd extends React.Component {
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
          mutation={ADD_MEDICAL_HISTORY}
          awaitRefetchQueries={true}
          refetchQueries={[
            {
              query: GET_MEDICAL_HISTORY,
            },
          ]}>
          {(addMedicalHistory, {loading, error}) => (
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
                params.handleAddMedicalHistory(addMedicalHistory, loading)
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
      handleAddMedicalHistory: this.handleAddMedicalHistory,
    });
  }
  handleAddMedicalHistory = async (addMedicalHistory, loading) => {
    const {title, description} = this.state.medicalHistory;
    const data = {
      title,
      description,
    };
    await addMedicalHistory({
      variables: {data},
    })
      .then(res => {
        console.log(res);
        this.props.navigation.navigate('CompletedAction', {
          title: 'Added!',
          subTitle: 'Voila! You have successfully added that medical history',
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
    const {medicalHistory} = this.state;
    // console.log(medicalHistory, 'mmmmmmmmm');
    return (
      <View style={styles.container}>
        <CommonEditView
          titlePlaceholder="Title"
          descriptionPlaceholder="Describe your medical history"
          title={medicalHistory.title}
          description={medicalHistory.description}
          editable={this.state.isEdit}
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
