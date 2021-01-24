/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler,
  FlatList,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import shortid from 'shortid';
import DialogModal from '../../Components/DialogModal';
import MenuModal from '../../Components/MenuModal';
import ActivityIndicatorPage from '../App/ActivityIndicatorPage';
import Arrow from '../../assets/arrow.svg';
import {nhsData} from '../../nhsData';
import {CREATE_ASSESSMENT, GET_ALL_ASSESSMENTS} from '../../QueryAndMutation';
import {withApollo} from 'react-apollo';
import {
  SYMPTOMS,
  SYMPTOMS_QUESTIONS,
  SERVER_KEY,
  PREDICT_VALUE,
} from 'react-native-dotenv';

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
    // paddingTop: 10,
    // marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
    // height: 50,
    // alignItems: 'center',
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
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'muli-bold',
    textAlign: 'center',
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

class ReportPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: (
        <TouchableWithoutFeedback
          onPress={async () => {
            await AsyncStorage.removeItem(SYMPTOMS);
            await AsyncStorage.removeItem(SYMPTOMS_QUESTIONS);
            params.goBack();
          }}>
          <View style={{padding: 20, paddingRight: 0}}>
            <Arrow height={18} width={18} />
          </View>
        </TouchableWithoutFeedback>
      ),
      headerTitle: (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[styles.headerText]}>Assessment Report</Text>
        </View>
      ),
      headerRight: <View />,
      headerLeftContainerStyle: {
        justifyContent: 'center',
      },
    };
  };

  async UNSAFE_componentWillMount() {
    let symptomArr;
    if (await AsyncStorage.getItem(SYMPTOMS)) {
      let sym = await AsyncStorage.getItem(SYMPTOMS);
      let parsedArr = JSON.parse(sym);
      symptomArr = [...new Set(parsedArr)];
      this.setState({symptomArr});
    }
    let symptomQuestions;
    if (await AsyncStorage.getItem(SYMPTOMS_QUESTIONS)) {
      let sym = await AsyncStorage.getItem(SYMPTOMS_QUESTIONS);
      let parsedArr = JSON.parse(sym);
      symptomQuestions = [...new Set(parsedArr)];
      this.setState({symptomQuestions});
    }

    let illnessTitle = symptomArr.toString();
    illnessTitle = illnessTitle
      .split(',')
      .map(w => w.charAt(0) + w.slice(1))
      .join(', ');
    this.setState({illnessTitle});

    this.props.navigation.setParams({
      illnessTitle: this.state.symptomArr.toString(),
      user: this.props.navigation.state.params.profile.profile,
      openModal: this.openModal,
      goBack: this.goBack,
    });

    const queryParams = ['nil', 'nil', 'nil', 'nil', 'nil', 'nil'];
    queryParams.splice(0, symptomArr.length, ...symptomArr);

    const conditionsArr = fetch(`${PREDICT_VALUE}${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Server-Key': SERVER_KEY,
      },
    })
      .then(res => res.json())
      .then(symptoms => {
        let symptomsArr = symptoms.data;

        arr = symptomsArr.map(symptom => symptom.toLowerCase());
        this.setState({conditionArr: arr});

        let conditions = nhsData.filter(condition =>
          arr.includes(condition.name.toLowerCase()),
        );
        this.setState({conditions});
      })
      .catch(err => console.log(err));

    let symptomList = this.state.symptomList;
    let absentSymptoms = symptomList.filter(x => !symptomArr.includes(x));

    if (symptomArr) {
      setTimeout(async () => {
        await this.props.client.mutate({
          mutation: CREATE_ASSESSMENT,
          variables: {
            payload: {
              Causes: this.state.conditionArr,
              AbsentSymptoms: absentSymptoms,
              PresentSymptoms: symptomArr,
              UserId: this.props.navigation.state.params.id,
            },
          },
          refetchQueries: [
            {
              query: GET_ALL_ASSESSMENTS,
              variables: {data: this.props.navigation.state.params.id},
            },
          ],
        });
      }, 2000);
    }
  }

  goBack = async () => {
    await AsyncStorage.removeItem(SYMPTOMS);
    await AsyncStorage.removeItem(SYMPTOMS_QUESTIONS);
    this.props.navigation.popToTop();
  };

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.goBack);

    setTimeout(() => this.setState({loading: false}), 3000);
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
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

  share = () => {
    this.closeModal();
    this.props.navigation.navigate('Share', {message: this.state.illnessTitle});
  };

  state = {
    moreOptionsModal: false,
    deleteModal: false,
    collapseIcon: 'chevron-down',
    illness: 'Headache',
    illnessTitle: '',
    loading: true,
    menuOptions: [
      {
        title: 'Share',
        icon: (
          <Icon type="material-community" name="share-variant" color="#555" />
        ),
        onPress: this.share,
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
    symptomArr: [],
    symptomsArr: [],
    conditions: [],
    symptomQuestions: [],
    symptomList: [
      'Headache',
      'Fever',
      'Scalp sore to touch',
      'Swollen area on the scalp',
      'Runny nose',
      'Head or neck injury',
      'Pain around the eye',
    ],
    user: this.props.navigation.state.params.profile.profile,
    absentSymptoms: [],
    conditionArr: [],
  };

  render() {
    const listOptions = this.state.conditions.map(data => ({
      title: data.name.split('(')[0],
      onPress: async () => {
        this.props.navigation.navigate('ConditionLibraryDetail', {
          title: data.name.split('(')[0],
          url: data.url,
        });
      },
    }));

    let symptomList = this.state.symptomList;
    let symptomArr = this.state.symptomArr;
    let absentSymptoms = symptomList.filter(x => !symptomArr.includes(x));

    return (
      <>
        {this.state.loading ? (
          <ActivityIndicatorPage />
        ) : (
          <>
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
            <View style={styles.container}>
              <FlatList
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View>
                    <Text style={styles.headerText}>Report</Text>
                    <Text style={styles.bodyText}>
                      Most people who present with similar symptoms may need to
                      see a doctor. To avoid complications, seek medical advice.
                      Don’t delay the care you need.
                    </Text>
                    <>
                      {this.state.conditions.length > 0 ? (
                        <Text style={styles.headerText}>
                          Conditions with similar symptoms
                        </Text>
                      ) : (
                        <View style={{flex: 1, marginVertical: 20}}>
                          <Text style={styles.headerText}>
                            Conditions with similar symptoms
                          </Text>
                          <Text style={styles.bodyText}>
                            The symptoms you entered were not enough to provide
                            a comprehensive report.
                          </Text>
                        </View>
                      )}
                    </>
                  </View>
                }
                data={listOptions}
                keyExtractor={() => shortid.generate()}
                style={{marginHorizontal: 10}}
                renderItem={({item, index}) => {
                  return (
                    <ItemCard
                      id={shortid.generate()}
                      title={item.title}
                      onPress={item.onPress}
                      index={index}
                    />
                  );
                }}
                ListFooterComponent={
                  <>
                    <Collapse
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
                      This report is not a medical diagnosis, but a
                      non-exhaustive list of possible conditions where your
                      symptoms are present. Seek medical advice if you are
                      concerned.
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('AssessmentFollowUp')
                      }>
                      <View style={styles.buttonSolidStyle}>
                        <Text style={styles.buttonSolidTitleStyle}>
                          CONTINUE
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* <View style={{marginBottom: 40}}>
                      {!this.props.navigation.isFirstRouteInParent() ? null : (
                        <Button
                          type="solid"
                          title="CONTINUE"
                          buttonStyle={styles.buttonSolidStyle}
                          titleStyle={styles.buttonSolidTitleStyle}
                          onPress={() => {
                            this.props.navigation.navigate('RatingQuestion');
                          }}
                        />
                      )}
                    </View> */}
                  </>
                }
              />

              <MenuModal
                isVisible={this.state.moreOptionsModal}
                onBackdropPress={this.closeModal}
                title={this.state.illness}
                cancelFunction={this.closeModal}
                options={this.state.menuOptions}
              />

              <DialogModal
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
                YesFunction={() => {
                  this.setState({
                    deleteModal: false,
                  });
                }}
              />
            </View>
          </>
        )}
      </>
    );
  }
}

export default withApollo(ReportPage);
