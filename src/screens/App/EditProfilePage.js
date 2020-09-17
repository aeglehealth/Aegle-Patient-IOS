/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import shortid from 'shortid';
import DateTimePicker from 'react-native-modal-datetime-picker';
import InputModal from '../../Components/InputModal';
import RadioOptionsModal from '../../Components/RadioOptionsModal';
import {Mutation} from 'react-apollo';
import {UPDATE_PROFILE, MEPOST, UPLOAD} from '../../QueryAndMutation';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
import {ReactNativeFile} from 'apollo-upload-client';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';

function Item({id, title, value, onPress}) {
  return (
    <View style={styles.listItem} key={id}>
      <TouchableOpacity underlayColor="rgba(0, 0, 0, 0.03)" onPress={onPress}>
        <View style={styles.listItemInner}>
          <Text style={styles.listTitleText}>{title}</Text>
          <Text style={styles.listValueText}>{value}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default class EditProfilePage extends React.Component {
  // static navigationOptions = ({navigation}) => {
  // return {
  //   headerStyle: styles.headerStyle,
  //   headerRightContainerStyle: {
  //     paddingRight: 10,
  //   },
  //   headerLeftContainerStyle: {
  //     paddingLeft: 10,
  //   },
  //   headerRight: (
  //     <Button
  //       type="clear"
  //       title="POST"
  //       titleStyle={styles.clearButtonTitle}
  //     />
  //   ),
  //   headerLeft: (
  //     <Icon
  //       type="material-community"
  //       name="close"
  //       onPress={() => {
  //         navigation.goBack();
  //       }}
  //     />
  //   ),
  // };
  // };

  state = {
    isVisible: false,
    isRadioVisible: false,
    isDateTimePickerVisible: false,
    inputType: null,
    rightText: '',
    activeTitle: '',
    activeKey: null,
    comment: '',
    loading: false,
    user: {
      first_name: this.props.screenProps.user.profile.firstName,
      last_name: this.props.screenProps.user.profile.lastName,
      gender:
        this.props.screenProps.user.profile.gender &&
        this.props.screenProps.user.profile.gender
          .toLowerCase()
          .charAt(0)
          .toUpperCase() +
          this.props.screenProps.user.profile.gender.slice(1).toLowerCase(),
      address:
        this.props.screenProps.user.profile.address &&
        this.props.screenProps.user.profile.address,
      postal_code:
        this.props.screenProps.user.profile.postalCode &&
        this.props.screenProps.user.profile.postalCode,
      country:
        this.props.screenProps.user.profile.country &&
        this.props.screenProps.user.profile.country,
      date_of_birth:
        this.props.screenProps.user.profile.dateOfBirth &&
        this.props.screenProps.user.profile.dateOfBirth
          .toString()
          .slice(0, 10)
          .slice(5)
          .replace(/-/g, '/') +
          '/' +
          this.props.screenProps.user.profile.dateOfBirth
            .toString()
            .slice(0, 10)
            .slice(2)
            .split('-')[0],
      height:
        this.props.screenProps.user.profile.height &&
        this.props.screenProps.user.profile.height,
      weight:
        this.props.screenProps.user.profile.weight &&
        this.props.screenProps.user.profile.weight,
      smoker:
        this.props.screenProps.user.profile.smoker &&
        this.props.screenProps.user.profile.smoker == true
          ? 'Yes'
          : this.props.screenProps.user.profile.smoker == false
          ? 'No'
          : null,
      address:
        this.props.screenProps.user.profile.address &&
        this.props.screenProps.user.profile.address,
      country:
        this.props.screenProps.user.profile.country &&
        this.props.screenProps.user.profile.country,
      postal_code:
        this.props.screenProps.user.profile.postalCode &&
        this.props.screenProps.user.profile.postalCode,
    },
    userDataTypes: {
      first_name: String,
      last_name: String,
      gender: Array,
      address: String,
      postal_code: String,
      country: Array,
      date_of_birth: Date,
      height: Number,
      weight: Number,
      smoker: Array,
    },
    userOptions: {
      gender: ['Male', 'Female'],
      country: ['Cameroon', 'Ghana', 'Nigeria', 'Niger', 'Others'],
      smoker: ['Yes', 'No'],
    },
    photo:
      this.props.screenProps.user.profile.photo &&
      this.props.screenProps.user.profile.photo.original,
    picture: {
      original: '',
      thumbnail: '',
    },
    fetchingImage: false,
  };

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    const {user} = this.state;
    user[this.state.activeKey] = date.toLocaleDateString();
    this.setState({
      user,
    });
    this.hideDateTimePicker();
  };

  closeModal = () => {
    this.setState({
      isVisible: false,
      isRadioVisible: false,
    });
  };

  onChangeValue = text => {
    const {user} = this.state;
    user[this.state.activeKey] = text;
    this.setState({
      user,
    });
  };

  // update state
  onSelectOption = (data, selected) => {
    const {user} = this.state;
    user[this.state.activeKey] = selected.label;
    this.setState({
      user,
    });
  };

  render() {
    const users = Object.keys(this.state.user).map(d => {
      let title = d;
      title = title.replace(/_/g, ' ');
      title = title.charAt(0).toUpperCase() + title.slice(1);
      return {
        title,
        value: this.state.user[d],
        onPress: () => {
          if (this.state.userDataTypes[d] === Number) {
            this.setState({
              inputType: 'number-pad',
              isVisible: true,
              rightText: d === 'height' ? 'cm' : 'kg',
            });
          } else if (this.state.userDataTypes[d] === String) {
            this.setState({
              inputType: 'default',
              isVisible: true,
              rightText: '',
            });
          } else if (this.state.userDataTypes[d] === Date) {
            this.setState({isDateTimePickerVisible: true});
          } else {
            this.setState({
              isRadioVisible: true,
            });
          }

          this.setState({activeTitle: title, activeKey: d});
        },
      };
    });

    return (
      <Mutation
        mutation={UPDATE_PROFILE}
        awaitRefetchQueries={true}
        refetchQueries={[
          {
            query: MEPOST,
          },
        ]}>
        {updateUser => (
          <View style={styles.container}>
            <FlatList
              ListHeaderComponent={
                <Mutation mutation={UPLOAD}>
                  {uploadFile => (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom: 20,
                        paddingTop: 30,
                      }}>
                      {this.state.fetchingImage ? (
                        <ActivityIndicator
                          color="#1B2CC1"
                          style={{height: 80, width: 80}}
                        />
                      ) : (
                        <>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              // const options = {
                              //   noData: true,
                              //   rotation: 360,
                              // };
                              const options = {
                                noData: true,
                                rotation: 360,
                              };

                              ImagePicker.showImagePicker(options, response => {
                                // ImagePicker.showImagePicker(options, response => {
                                if (response.uri) {
                                  const {uri, type, fileName} = response;
                                  this.setState({
                                    fetchingImage: true,
                                    photo: uri,
                                  });
                                  console.log(uri, 'photo');
                                  const fileUrl = new ReactNativeFile({
                                    uri,
                                    type: type || 'image/jpg',
                                    name: fileName || 'profile picture',
                                  });
                                  console.log(fileUrl);

                                  uploadFile({
                                    variables: {
                                      file: fileUrl,
                                    },
                                  })
                                    .then(res => {
                                      if (res) {
                                        console.log(res, 'upload');
                                        const {
                                          original,
                                          thumbnail,
                                        } = res.data.uploadFile;
                                        const {picture} = {...this.state};
                                        const pictureObj = picture;
                                        pictureObj.original = original;
                                        pictureObj.thumbnail = thumbnail;
                                        this.setState({
                                          picture: pictureObj,
                                          fetchingImage: false,
                                        });
                                      }
                                    })
                                    .catch(err => {
                                      console.log(err, 'erthj');
                                      this.setState({
                                        fetchingImage: false,
                                      });
                                      return err;
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
                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            ) : (
                              <Image
                                source={require('../../assets/user-default.png')}
                                style={{height: 100, width: 100}}
                              />
                            )}
                          </TouchableWithoutFeedback>
                        </>
                      )}
                      <Text style={styles.smallText}>
                        Tap to change picture
                      </Text>
                    </View>
                  )}
                </Mutation>
              }
              data={users}
              keyExtractor={() => shortid.generate()}
              style={styles.listStyle}
              renderItem={({item}) => {
                return (
                  <Item
                    id={shortid.generate()}
                    title={item.title}
                    value={item.value}
                    onPress={item.onPress}
                  />
                );
              }}
              ListFooterComponent={
                <>
                  <TouchableOpacity
                    disabled={this.state.loading || this.state.fetchingImage}
                    onPress={() => {
                      this.setState({loading: true});
                      updateUser({
                        variables: {
                          firstName:
                            this.state.user.first_name &&
                            this.state.user.first_name,
                          lastName:
                            this.state.user.last_name &&
                            this.state.user.last_name,
                          gender:
                            this.state.user.gender &&
                            this.state.user.gender.toUpperCase(),
                          dateOfBirth:
                            this.state.user.date_of_birth &&
                            this.state.user.date_of_birth,
                          height:
                            this.state.user.height && this.state.user.height,
                          weight:
                            this.state.user.weight && this.state.user.weight,
                          smoker:
                            this.state.user.smoker &&
                            (this.state.user.smoker == 'Yes'
                              ? true
                              : this.state.user.smoker == 'No'
                              ? false
                              : null),
                          address:
                            this.state.user.address && this.state.user.address,
                          country:
                            this.state.user.country && this.state.user.country,
                          postalCode:
                            this.state.user.postal_code &&
                            this.state.user.postal_code,
                          photo: {
                            original:
                              this.state.picture && this.state.picture.original,
                            thumbnail:
                              this.state.picture &&
                              this.state.picture.thumbnail,
                          },
                        },
                      })
                        .then(res => {
                          if (res) {
                            this.setState({loading: false});
                            ShowMessage(type.DONE, 'Profile Updated');
                          }
                        })
                        .catch(err => {
                          this.setState({loading: false});
                          return err;
                        });
                    }}>
                    <View style={styles.buttonSolidStyle}>
                      {this.state.loading ? (
                        <ActivityIndicator size="small" color="#E5E5E5" />
                      ) : (
                        <Text style={styles.buttonSolidTitleStyle}>
                          SAVE CHANGES
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <InputModal
                    title={this.state.activeTitle}
                    isVisible={this.state.isVisible}
                    rightText={this.state.rightText}
                    onBackdropPress={this.closeModal}
                    keyBoardType={this.state.inputType}
                    okFunction={this.closeModal}
                    value={this.state.user[this.state.activeKey]}
                    onChangeText={this.onChangeValue}
                  />
                  <RadioOptionsModal
                    title={this.state.activeTitle}
                    isVisible={this.state.isRadioVisible}
                    onBackdropPress={this.closeModal}
                    options={this.state.userOptions[this.state.activeKey]}
                    okFunction={this.closeModal}
                    value={this.state.user[this.state.activeKey]}
                    onSelectOption={this.onSelectOption}
                  />
                  <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                  />
                </>
              }
            />
          </View>
        )}
      </Mutation>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
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
  smallText: {
    fontFamily: 'Muli-Regular',
    fontSize: 12,
    color: '#C4C4C4',
    marginTop: 10,
  },
  listItem: {
    borderTopColor: 'rgba(196, 196, 196, 0.5)',
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
    borderTopWidth: 1,
  },
  listItemInner: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  listTitleText: {
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listValueText: {
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    color: '#454545',
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
  listStyle: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
  },
});
