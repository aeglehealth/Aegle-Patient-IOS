/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import shortid from 'shortid';
import CardIconViewSelect from '../../Components/CardIconViewSelect';
import {UserContext} from '../../store/context/UserContext';
import {Overlay} from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {InputPicker} from '../../Components/InputPicker';
import {Mutation} from 'react-apollo';
import {ADD_FAMILY_MEMBER, MEPOST} from '../../QueryAndMutation';
import {Query} from 'react-apollo';
import ActivityIndicatorPage from './ActivityIndicatorPage';
import {HeaderLeft} from '../../Components/HeaderLeft';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 5,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
  },
  imageIcon: {
    maxHeight: 20,
    maxWidth: 20,
    alignSelf: 'center',
  },
  careCard: {
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#fff',
    ...elevationShadowStyle(3),
  },
  careCardInner: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  cardImageContainer: {
    justifyContent: 'center',
    width: 55,
    height: 55,
    overflow: 'hidden',
    borderRadius: 40,
  },
  cardText: {
    flex: 4,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  TextInputStyleClass: {
    textAlign: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    height: 150,
    marginVertical: 10,
  },
});

const genderValues = [
  {label: 'MALE', value: 'MALE'},
  {label: 'FEMALE', value: 'FEMALE'},
];

const CardIconView = props => {
  return (
    <View style={styles.careCard}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={styles.careCardInner}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <View
              style={[styles.cardImageContainer, {backgroundColor: '#0066F5'}]}>
              <Image
                style={styles.imageIcon}
                source={require('../../assets/plus.png')}
              />
            </View>
          </View>

          <View style={styles.cardText}>
            <View>
              <Text style={styles.cardHeaderText}>{props.headText}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default class AppointmentForPage extends React.Component {
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
      selected: 0,
      city: '',
      isModalVisible: false,
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      isDateTimePickerVisible: false,
      users: [
        {
          id: 1,
          name: 'Buhari Jemilu',
          icon: require('../../assets/user-default.png'),
        },
        {
          id: 2,
          name: 'Buhari Hassan',
          icon: require('../../assets/user-default.png'),
        },
      ],
      newUsers: [
        {
          id: 1,
          fullName: 'Buhari Jemilu',
          icon: require('../../assets/user-default.png'),
        },
        {
          id: 2,
          fullName: 'Buhari Hassan',
          icon: require('../../assets/user-default.png'),
        },
      ],
    };
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    this.hideDateTimePicker();
    this.setState({dateOfBirth: date.toLocaleDateString()});
  };

  toggleModal = () =>
    this.setState({isModalVisible: !this.state.isModalVisible});

  render() {
    const {firstName, lastName, gender, dateOfBirth} = this.state;
    const check = firstName && lastName && gender && dateOfBirth;
    return (
      <Query query={MEPOST}>
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return console.log('error');
          const {profile, families} = data.me;
          const {firstName: first, lastName: last, id, photo} = profile;
          const owner = {
            fullName: `${first} ${last}`,
            icon: require('../../assets/user-default.png'),
            id,
          };
          const owner1 = {
            firstName: first,
            lastName: last,
            photo: photo && photo,
            id,
          };
          console.log(photo, 'fdd');
          const all = [...families, owner1];
          return (
            <View style={styles.container}>
              <ScrollView
                style={{marginHorizontal: 5}}
                showsVerticalScrollIndicator={false}>
                <View style={{paddingHorizontal: 10}}>
                  <Text style={styles.headerText}>Appointment for</Text>
                </View>
                <View style={{paddingHorizontal: 10}}>
                  <FlatList
                    data={all}
                    renderItem={({item}) => {
                      return (
                        <CardIconViewSelect
                          key={shortid.generate()}
                          imageBackgroundColor="#fff"
                          cardImageBorderRadius={40}
                          isImage
                          imageSize={55}
                          headText={`${item.firstName} ${item.lastName}`}
                          icon={item.photo}
                          selected={this.state.selected === item.id}
                          onPress={() => {
                            this.setState({selected: item.id});
                            this.props.navigation.state.params.onChangeUser(
                              `${item.firstName} ${item.lastName} ${item.id} ${
                                item.photo ? item.photo.thumbnail : ''
                              }`,
                            );
                            this.props.navigation.goBack();
                          }}
                        />
                      );
                    }}
                    keyExtractor={item => item.id}
                  />
                  <CardIconView
                    // onPress={() => this.toggleModal()}
                    onPress={() =>
                      this.props.navigation.navigate('FamilyQuestions')
                    }
                    headText="Add Family Member"
                  />
                  <Mutation
                    mutation={ADD_FAMILY_MEMBER}
                    awaitRefetchQueries={true}
                    refetchQueries={[
                      {
                        query: MEPOST,
                      },
                    ]}>
                    {(addfamily, {loading, error}) => (
                      <Overlay
                        onBackdropPress={() =>
                          this.setState({isModalVisible: false})
                        }
                        isVisible={this.state.isModalVisible}>
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            height: '70%',
                          }}>
                          <View style={{padding: 20}}>
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: '700',
                                alignSelf: 'center',
                              }}>
                              Family member's details
                            </Text>
                            <TextInput
                              style={{
                                ...styles.TextInputStyleClass,
                                height: 50,
                              }}
                              underlineColorAndroid="transparent"
                              placeholder={'First Name'}
                              placeholderTextColor={'#9E9E9E'}
                              value={this.state.firstName}
                              onChangeText={text =>
                                this.setState({...this.state, firstName: text})
                              }
                            />
                            <TextInput
                              style={{
                                ...styles.TextInputStyleClass,
                                height: 50,
                              }}
                              underlineColorAndroid="transparent"
                              placeholder={'Last Name'}
                              placeholderTextColor={'#9E9E9E'}
                              value={this.state.lastName}
                              onChangeText={text =>
                                this.setState({...this.state, lastName: text})
                              }
                            />
                            <InputPicker
                              placeholder="Select Gender"
                              PickerOptions={genderValues}
                              selectedValue={this.state.gender}
                              onValueChange={(itemValue, itemIndex) =>
                                this.setState({
                                  ...this.state,
                                  gender: itemValue,
                                })
                              }
                              pickerContainerStyle={{
                                backgroundColor: 'transparent',
                                borderWidth: 1,
                                borderColor: '#9E9E9E',
                              }}
                            />
                            <TouchableWithoutFeedback
                              underlayColor="rgba(0, 0, 0, 0.01)"
                              onPress={this.showDateTimePicker}>
                              <View
                                style={{
                                  ...styles.TextInputStyleClass,
                                  height: 50,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text style={styles.inputText}>
                                  {dateOfBirth ? dateOfBirth : 'Date of birth'}
                                </Text>
                              </View>
                            </TouchableWithoutFeedback>
                            <DateTimePicker
                              isVisible={this.state.isDateTimePickerVisible}
                              onConfirm={this.handleDatePicked}
                              onCancel={this.hideDateTimePicker}
                            />

                            <Button
                              title="Save"
                              onPress={() => {
                                const famData = {
                                  firstName,
                                  lastName,
                                  gender,
                                  dateOfBirth,
                                };

                                addfamily({
                                  variables: {famData},
                                })
                                  .then(res => {
                                    this.setState({isModalVisible: false});
                                    this.props.navigation.navigate(
                                      'CompletedAction',
                                      {
                                        title: 'Added!',
                                        subTitle:
                                          'Voila! You have successfully added a family member',
                                        onCompleted: () => {
                                          this.props.navigation.goBack();
                                        },
                                      },
                                    );
                                  })
                                  .catch(err => console.log(err, 'error'));
                              }}
                              loading={loading}
                              disabled={!check || loading}
                            />
                          </View>
                        </View>
                      </Overlay>
                    )}
                  </Mutation>
                </View>
              </ScrollView>
            </View>
          );
        }}
      </Query>
    );
  }
}
