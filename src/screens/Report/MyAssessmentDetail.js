/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import shortid from 'shortid';
import DialogModal from '../../Components/DialogModal';
import MenuModal from '../../Components/MenuModal';
import ActivityIndicatorPage from '../App/ActivityIndicatorPage';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {nhsData} from '../../nhsData';
import {
  DELETE_ASSESSMENT,
  GET_ALL_ASSESSMENTS,
  UPLOAD,
} from '../../QueryAndMutation';
import ViewShot from 'react-native-view-shot';
import {Mutation, withApollo} from 'react-apollo';
import {ReactNativeFile} from 'apollo-upload-client';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
import Toast from '../../Components/toster/Alert';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.8,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  smallText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 12,
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
    fontSize: 18,
    marginVertical: 10,
  },
  cardBodyText: {
    color: '#888',
    fontFamily: 'Muli-Regular',
    fontSize: 12,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  card: {
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    ...elevationShadowStyle(3),
    shadowColor: 'rgba(196, 196, 196, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-around',
    width: '98%',
    alignSelf: 'center',
  },
  cardText: {
    alignSelf: 'center',
    fontSize: 30,
  },
  cardInner: {
    paddingHorizontal: 10,
    width: '80%',
    alignSelf: 'center',
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#03CCAA',
    width: 50,
    height: 50,
    borderRadius: 40,
    overflow: 'hidden',
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginVertical: 20,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Muli-Regular',
  },
  symptomHeader: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  symptomBody: {
    color: '#555',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  collapseStyle: {
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
    borderBottomWidth: 1,
    paddingBottom: 35,
    marginBottom: 30,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

class ItemCard extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        underlayColor="rgba(0, 0, 0, 0.03)"
        onPress={this.props.onPress}>
        <View style={styles.card} key={this.props.id}>
          <View style={styles.cardImageContainer}>
            <Text style={styles.cardText}>{this.props.index + 1}</Text>
          </View>
          <View style={styles.cardInner}>
            <Text style={styles.cardHeaderText}>{this.props.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

class MyAssessmentDetail extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
      headerTitle: (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[styles.headerText, {textAlign: 'center'}]}>
            Assessment Report
          </Text>
        </View>
      ),
      headerRight: (
        <Icon
          type="material-community"
          name="dots-vertical"
          color="#000000"
          onPress={params.openModal}
        />
      ),
      headerRightContainerStyle: {
        paddingRight: 10,
        justifyContent: 'center',
      },
      headerLeftContainerStyle: {
        justifyContent: 'center',
      },
    };
  };

  async UNSAFE_componentWillMount() {
    let {symptomArr, causes} = this.props.navigation.state.params;

    this.setState({symptomArr});

    let illnessTitle = symptomArr.toString();
    illnessTitle = illnessTitle
      .split(',')
      .map(w => w.charAt(0) + w.slice(1))
      .join(', ');
    console.log(illnessTitle);
    this.setState({illnessTitle});

    this.props.navigation.setParams({
      openModal: this.openModal,
    });

    const arr = causes.map(symptom => symptom.toLowerCase());
    console.log(causes, 'causess');

    let conditions = nhsData.filter(condition =>
      arr.includes(condition.name.toLowerCase()),
    );
    console.log(conditions, 'conditions');
    this.setState({conditions});
  }

  componentDidMount() {
    setTimeout(() => this.setState({loading: false}), 3000);
  }

  onCapture = async uri => {
    const fileUrl = new ReactNativeFile({
      uri,
      type: 'image/jpg',
      name: 'Assessment image',
    });
    this.setState({fileUrl});
  };

  openModal = () => {
    this.setState({
      moreOptionsModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      moreOptionsModal: false,
    });
  };

  showDeleteModal = () => {
    this.setState({
      moreOptionsModal: false,
    });
    setTimeout(() => {
      this.setState({
        deleteModal: true,
      });
    }, 500);
  };

  onShare = async () => {
    const {fileUrl} = this.state;
    Toast(`Processing...please wait`);
    try {
      const file = await this.props.client.mutate({
        mutation: UPLOAD,
        variables: {file: fileUrl},
      });

      if (file) {
        this.closeModal();
        const {original} = file.data.uploadFile;
        console.log(file, 'fileeee');

        let imagePath = null;
        RNFetchBlob.config({
          fileCache: true,
        })
          .fetch('GET', original)
          // the image is now dowloaded to device's storage
          .then(resp => {
            // the image path you can use it directly with Image component
            imagePath = resp.path();
            return resp.readFile('base64');
          })
          .then(async base64Data => {
            var base64Data = `data:image/png;base64,` + base64Data;
            // here's base64 encoded image
            await Share.open({url: base64Data});
            // remove the file from storage
            return fs.unlink(imagePath);
          })
          .catch(err => {
            console.log(err);
            this.closeModal();
          });
      }
    } catch (err) {
      console.log(err);
      this.closeModal();
      ShowMessage(type.ERROR, 'An error occured');
    }
  };

  state = {
    moreOptionsModal: false,
    deleteModal: false,
    collapseIcon: 'chevron-down',
    illnessTitle: '',
    loading: true,
    menuOptions: [
      {
        title: 'Share',
        icon: (
          <Icon type="material-community" name="share-variant" color="#555" />
        ),
        onPress: this.onShare,
      },
      {
        title: 'Delete',
        icon: (
          <Icon
            type="material-community"
            name="trash-can-outline"
            color="#555"
          />
        ),
        onPress: this.showDeleteModal,
      },
    ],
    conditions: [],
    symptomArr: [],
    user: this.props.navigation.state.params.me.profile,
    absentSymptoms: this.props.navigation.state.params.absentSymptoms,
    collapsed: true,
    fileUrl: {},
  };

  render() {
    console.log(this.state.conditions);
    const listOptions = this.state.conditions.map(data => ({
      title: data.name.split('(')[0],
      onPress: async () => {
        this.props.navigation.navigate('ConditionLibraryDetail', {
          title: data.name.split('(')[0],
          url: data.url,
        });
      },
    }));

    let absentSymptoms = this.state.absentSymptoms;

    return (
      <>
        {this.state.loading ? (
          <ActivityIndicatorPage />
        ) : (
          <>
            <View style={styles.container}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <ViewShot onCapture={this.onCapture} captureMode="mount">
                  <View
                    style={{backgroundColor: 'white', paddingHorizontal: 15}}>
                    <Text
                      style={[
                        styles.headerText,
                        {
                          textAlign: 'center',
                          width: '85%',
                          alignSelf: 'center',
                          fontSize: 16,
                        },
                      ]}>
                      {this.state.illnessTitle}
                    </Text>
                    <Text style={[styles.smallText, {textAlign: 'center'}]}>
                      {this.state.user.firstName}
                      {this.state.user.gender
                        ? `, ${this.state.user.gender.toLowerCase()}`
                        : ''}
                      {this.state.user.age ? `, ${this.state.user.age}` : ''}
                    </Text>
                    <View>
                      <Text style={styles.headerText}>Summary</Text>
                      <Text style={styles.bodyText}>
                        People with symptoms similar to yours may require urgent
                        medical care. If you think this is an urgent problem you
                        should seek advice from a doctor straight away.
                      </Text>
                      {this.state.conditions.length > 0 ? (
                        <>
                          <Text style={styles.headerText}>Possible causes</Text>
                          {listOptions.map((item, index) => {
                            return (
                              <>
                                {item.title && (
                                  <ItemCard
                                    id={shortid.generate()}
                                    title={item.title}
                                    onPress={item.onPress}
                                    index={index}
                                  />
                                )}
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <View style={{flex: 1, marginVertical: 20}}>
                          <Text style={styles.headerText}>Possible causes</Text>
                          <Text style={styles.bodyText}>
                            Unfortunately, your symptoms were not enough to
                            provide a comprehensive assessment
                          </Text>
                        </View>
                      )}
                    </View>
                    <Collapse
                      isCollapsed={this.state.collapsed}
                      onToggle={isCollapsed =>
                        this.setState({
                          collapseIcon: isCollapsed
                            ? 'chevron-up'
                            : 'chevron-down',
                        })
                      }
                      style={styles.collapseStyle}>
                      <CollapseHeader>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                            alignItems: 'center',
                          }}>
                          <Text style={styles.headerText}>Symptoms</Text>
                          <Icon
                            type="material-community"
                            name={this.state.collapseIcon}
                            color="#000000"
                          />
                        </View>
                      </CollapseHeader>
                      <CollapseBody>
                        <Text style={styles.symptomHeader}>Present</Text>
                        {this.state.symptomArr &&
                          this.state.symptomArr.map(symptom => (
                            <Text style={styles.symptomBody}>-{symptom}</Text>
                          ))}
                        <Text style={styles.symptomHeader}>Absent</Text>
                        {absentSymptoms.map(symptom => (
                          <Text style={styles.symptomBody}>-{symptom}</Text>
                        ))}
                      </CollapseBody>
                    </Collapse>
                    <Text />
                    <Text style={styles.cardBodyText}>
                      This list includes conditions that Aegle has identified as
                      possible causes for your symptoms. This is not a diagnosis
                      and is also not an exhaustive list. You might have a
                      condition that is not suggested here. Please consult a
                      doctor if you are concerned about your health.
                    </Text>
                  </View>
                </ViewShot>
              </ScrollView>
            </View>

            <MenuModal
              isVisible={this.state.moreOptionsModal}
              onBackdropPress={this.closeModal}
              title={this.state.illness}
              cancelFunction={this.closeModal}
              options={this.state.menuOptions}
            />

            <Mutation
              mutation={DELETE_ASSESSMENT}
              awaitRefetchQueries={true}
              refetchQueries={[
                {
                  query: GET_ALL_ASSESSMENTS,
                  variables: {data: this.props.navigation.state.params.me.id},
                },
              ]}>
              {(deletePatientAssesmentRecord, {loading: loadingMutation}) => (
                <DialogModal
                  loadingProp={loadingMutation}
                  isVisible={this.state.deleteModal}
                  onBackdropPress={() => {
                    this.setState({
                      deleteModal: false,
                    });
                  }}
                  question="Are you sure you want to delete this assessment?"
                  title="Delete assessment"
                  NoFunction={() => {
                    this.setState({
                      deleteModal: false,
                    });
                  }}
                  YesFunction={async () => {
                    await deletePatientAssesmentRecord({
                      variables: {
                        id: this.props.navigation.state.params.id,
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
          </>
        )}
      </>
    );
  }
}

export default withApollo(MyAssessmentDetail);
