/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {Form, Item, Input, Label} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import RadioGroupExpInv from '../../Components/RadioGroupExpInv';
import {Mutation} from 'react-apollo';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {ADD_FAMILY_MEMBER, MEPOST, UPLOAD} from '../../QueryAndMutation';
import {UserContext} from '../../store/context/UserContext';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import {ReactNativeFile} from 'apollo-upload-client';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  subText: {
    color: '#828282',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    marginVertical: 20,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 32,
    marginBottom: 10,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  input: {
    paddingLeft: 5,
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  item: {
    paddingBottom: 10,
    paddingLeft: 0,
    marginLeft: 0,
    marginEnd: 10,
  },

  clearButtonTitle: {
    color: '#000',
    fontFamily: 'muli-bold',
    fontSize: 16,
  },
  profileImageView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 30,
  },
  smallText: {
    fontFamily: 'Muli-Regular',
    fontSize: 12,
    color: '#C4C4C4',
    marginTop: 10,
  },
});

export default class FamilyQuestionsPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerRightContainerStyle: {
        paddingRight: 10,
      },
      headerLeft: <HeaderLeft navigation={navigation} />,
      headerRight: (
        <Button
          type="clear"
          title="NEXT"
          titleStyle={styles.clearButtonTitle}
          onPress={params.nextPage}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      picture: {
        thumbnail: '',
        original: '',
      },
      file: null,
      isDateTimePickerVisible: false,
      user: {
        name: '',
        dob: '',
        gender: 'Male',
      },
      fetchingImage: false,
      photo: '',
      index: 0,
      genderOptions: [
        {
          label: 'Male',
          size: 25,
        },
        {
          label: 'Female',
          size: 25,
        },
      ],
      questions: [
        {
          question: 'What is his/her \nname?',
          subText:
            'Note: For children under that age of 16, all consultations must be via video with the presence of a guardian or parent.',
          value: '',
        },
        {
          question: 'What is his/her \ngender?',
          subText:
            'Please specify his/her gender type for better understanding',
          value: '',
        },
        {
          question: 'What is his/her \ndate of birth?',
          subText: 'Please select his/her date of birth',
          value: '',
        },
        {
          question: 'Upload Profile picture',
          subText: 'Upload his or her profile picture now or do it later.',
          value: '',
        },
      ],
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      nextPage: this.nextPage,
    });
  }

  nextPage = () => {
    const {questions, index} = this.state;

    if (questions.length <= index + 1) {
      this.props.navigation.navigate('FamilyList');
    } else {
      this.setState({
        index: index + 1,
      });
    }
  };

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    this.hideDateTimePicker();
    this.setState(prevState => ({
      user: {...prevState.user, dob: date.toLocaleDateString()},
    }));
  };

  // update state
  onPress = (data, selected) => {
    this.setState(prevState => ({
      genderOptions: data,
      user: {...prevState.user, gender: selected.label},
    }));
  };

  handleAddFamilyMember = async (uploadFile, addfamily) => {
    const {name, dob} = this.state.user;
    const splitName = name.split(' ');
    let firstName;
    let lastName;
    if (splitName.length === 1) {
      firstName = splitName[0];
      lastName = '-';
    } else {
      firstName = splitName[0];
      lastName = splitName[1];
    }

    const dateOfBirth = dob;
    const gender = this.state.user.gender.toUpperCase();
    const famData1 = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
    };
    if (this.state.file === null) {
      return await addfamily({
        variables: {famData: famData1},
      })
        .then(res => {
          this.props.navigation.navigate('CompletedAction', {
            title: 'Added!',
            subTitle: 'Voila! You have successfully added a family member',
            onCompleted: () => {
              this.props.navigation.goBack();
            },
          });
        })
        .catch(err => console.log(err, 'error'));
    } else {
      return await uploadFile({
        variables: {file: this.state.file},
      })
        .then(async res => {
          if (res) {
            const {thumbnail, original} = res.data.uploadFile;
            const {picture} = {...this.state};
            const pictureObj = picture;
            pictureObj.original = original;
            pictureObj.thumbnail = thumbnail;

            console.log(pictureObj, 'photo');
            const famData = {
              firstName,
              lastName,
              gender,
              dateOfBirth,
              photo: pictureObj,
            };

            await addfamily({
              variables: {famData},
            })
              .then(res => {
                this.props.navigation.navigate('CompletedAction', {
                  title: 'Added!',
                  subTitle:
                    'Voila! You have successfully added a family member',
                  onCompleted: () => {
                    this.props.navigation.goBack();
                  },
                });
              })
              .catch(err => console.log(err, 'error'));
          }
        })
        .catch(err => console.log(err, 'error'));
    }
  };

  render() {
    const {questions, index} = this.state;
    const {name, dob, gender} = this.state.user;
    const nameInputView = (
      <Form>
        <Item floatingLabel style={styles.item}>
          <Label>Full name</Label>
          <Input
            style={styles.input}
            onChangeText={text => {
              this.setState(prevState => ({
                user: {...prevState.user, name: text},
              }));
            }}
            value={this.state.user.name}
          />
        </Item>
      </Form>
    );

    const dateInputView = (
      <View>
        <Form>
          <Item floatingLabel style={styles.item}>
            <Label>Date of birth</Label>
            <Input
              style={styles.input}
              onChangeText={text => {
                this.setState(prevState => ({
                  user: {...prevState.user, dob: text},
                }));
              }}
              value={this.state.user.dob}
              onFocus={this.showDateTimePicker}
            />
          </Item>
        </Form>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
      </View>
    );

    const genderInputOptions = (
      <RadioGroupExpInv
        radioButtons={this.state.genderOptions}
        onPress={this.onPress}
      />
    );

    const profilePicture = (
      <View style={styles.profileImageView}>
        {this.state.fetchingImage ? (
          <ActivityIndicator color="#1B2CC1" style={{height: 80, width: 80}} />
        ) : (
          <TouchableOpacity
            onPress={() => {
              const options = {
                noData: true,
                rotation: 360,
              };

              ImagePicker.showImagePicker(options, response => {
                if (response.uri) {
                  const {uri, type, fileName} = response;
                  this.setState({
                    fetchingImage: true,
                    photo: uri,
                  });
                  const fileUrl = new ReactNativeFile({
                    uri,
                    type: type || 'image/jpg',
                    name: fileName || 'family_member_photo',
                  });
                  this.setState({
                    file: fileUrl,
                    fetchingImage: false,
                  });
                }
              });
            }}>
            {this.state.photo ? (
              <FastImage
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 100 / 2,
                }}
                source={{
                  uri: this.state.photo,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <Image
                source={require('../../assets/user-default.png')}
                style={{height: 80, width: 80}}
              />
            )}
          </TouchableOpacity>
        )}

        <Text style={styles.smallText}>Tap to upload picture</Text>
      </View>
    );

    const views = [
      nameInputView,
      genderInputOptions,
      dateInputView,
      profilePicture,
    ];
    return (
      <UserContext.Consumer>
        {({data, renewState}) => {
          return (
            <Mutation
              mutation={ADD_FAMILY_MEMBER}
              awaitRefetchQueries={true}
              refetchQueries={[
                {
                  query: MEPOST,
                },
              ]}>
              {(addfamily, {error, loading}) => (
                <Mutation mutation={UPLOAD}>
                  {(uploadFile, {error: error1, loading: loading1}) => (
                    <View style={styles.container}>
                      <ScrollView
                        style={{marginHorizontal: 20}}
                        showsVerticalScrollIndicator={false}>
                        <View>
                          <Text style={styles.headerText}>
                            {questions[index].question}
                          </Text>
                        </View>
                        <View>{views[index]}</View>
                        <View>
                          <Text style={styles.subText}>
                            {questions[index].subText}
                          </Text>
                        </View>
                        {index === 3 && name && gender && dob ? (
                          <Button
                            title="SAVE"
                            onPress={() =>
                              this.handleAddFamilyMember(uploadFile, addfamily)
                            }
                            disabled={loading || loading1}
                            loading={loading || loading1}
                          />
                        ) : (
                          index === 3 && (
                            <Button
                              title="Please go back and fill in all fields"
                              onPress={() => this.props.navigation.goBack()}
                              disabled={true}
                              // loading={loading}
                            />
                          )
                        )}
                        {/* <Button
                          title="SAVE"
                          onPress={() =>
                            this.handleAddFamilyMember(uploadFile, addfamily)
                          }
                          disabled={loading || loading1}
                          loading={loading || loading1}
                        /> */}
                      </ScrollView>
                    </View>
                  )}
                </Mutation>
              )}
            </Mutation>
          );
        }}
      </UserContext.Consumer>
    );
  }
}
