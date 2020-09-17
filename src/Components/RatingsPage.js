import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  TouchableWithoutFeedback,
  BackHandler,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Rate from '../assets/rate.svg';
import Rated from '../assets/rated.svg';
import {withApollo} from 'react-apollo';
import {GetAppointmentById, RATING} from '../QueryAndMutation';
import Arrow from '../assets/arrow.svg';
import ShowMessage, {type} from '../Components/toster/ShowMessage';

const styles = StyleSheet.create({
  iconCircle: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    height: 95,
    width: 95,
    borderRadius: 4,
  },
  headText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 15,
    fontWeight: 'bold',
  },
  mainBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 45,
    paddingVertical: 25,
    borderRadius: 10,
  },
  bodyText: {
    color: '#828282',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonStyle: {
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#1B2CC1',
    width: '40%',
  },
  buttonTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  backgroundImage: {
    paddingLeft: 25,
    paddingEnd: 25,
    flex: 1,
    justifyContent: 'center',
  },
  rating: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerStyle: {
    backgroundColor: '#1B2CC1',
    shadowColor: '#1B2CC1',
    elevation: 0,
    borderBottomColor: '#1B2CC1',
    shadowOpacity: 0,
  },
});

class RatingsPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.popToTop();
          }}>
          <View style={{padding: 20, paddingRight: 0}}>
            <Arrow height={18} width={18} color="#fff" />
          </View>
        </TouchableWithoutFeedback>
      ),
    };
  };

  state = {
    firstName: '',
    lastName: '',
    picture: {
      thumbnail: '',
      original: '',
    },
    rated: 0,
    doctorId: '',
    appointmentId: '',
    loading: false,
    loader: false,
  };

  async UNSAFE_componentWillMount() {
    const {navigation, client} = this.props;
    this.setState({loading: true});
    const appointmentId = navigation.state.params.appointmentId;
    const res = await client.query({
      query: GetAppointmentById,
      variables: {appointmentId},
      fetchPolicy: 'network-only',
    });

    const {
      approvedBy: {
        id,
        profile: {photo, lastName, firstName},
      },
    } = res.data.getAppointmentById;
    const {picture} = {...this.state};
    const pictureObj = picture;
    pictureObj.original = photo.original;
    pictureObj.thumbnail = photo.thumbnail;
    this.setState({
      firstName,
      lastName,
      picture: pictureObj,
      doctorId: id,
      appointmentId,
      loading: false,
    });
  }

  goBack = () => {
    this.props.navigation.popToTop();
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  };

  render() {
    const {
      firstName,
      lastName,
      picture,
      rated,
      doctorId,
      appointmentId,
      loading,
      loader,
    } = this.state;
    return (
      <ImageBackground
        source={require('../assets/completed-bg.png')}
        imageStyle={{resizeMode: 'cover'}}
        style={styles.backgroundImage}>
        {loading ? (
          <ActivityIndicator
            color="#fff"
            size="large"
            style={{alignSelf: 'center'}}
          />
        ) : (
          <View style={styles.mainBox}>
            {picture && picture.original ? (
              <View style={styles.iconCircle}>
                <FastImage
                  style={styles.iconCircle}
                  source={{
                    uri: picture.thumbnail,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            ) : (
              <Image
                source={require('../assets/user-default.png')}
                style={styles.iconCircle}
              />
            )}
            <Text
              style={
                styles.headText
              }>{`Rate your appointment with Dr ${firstName} ${lastName}`}</Text>
            <View style={styles.rating}>
              <TouchableOpacity onPress={() => this.setState({rated: 1})}>
                {rated === 1 ||
                rated === 2 ||
                rated === 3 ||
                rated === 4 ||
                rated === 5 ? (
                  <Rated />
                ) : (
                  <Rate />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({rated: 2})}>
                {rated === 2 || rated === 3 || rated === 4 || rated === 5 ? (
                  <Rated />
                ) : (
                  <Rate />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({rated: 3})}>
                {rated === 3 || rated === 4 || rated === 5 ? (
                  <Rated />
                ) : (
                  <Rate />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({rated: 4})}>
                {rated === 4 || rated === 5 ? <Rated /> : <Rate />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({rated: 5})}>
                {rated === 5 ? <Rated /> : <Rate />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={this.state.loader}
              style={styles.buttonStyle}
              onPress={async () => {
                if (rated === 0) {
                  this.props.navigation.popToTop();
                  return;
                }

                this.setState({loader: true});
                try {
                  const res = await this.props.client.mutate({
                    mutation: RATING,
                    variables: {
                      data: {
                        appointmentId,
                        doctorId,
                        rating: rated,
                      },
                    },
                  });
                  if (res) {
                    this.setState({loader: false});
                    ShowMessage(type.DONE, 'Rated Successfully');
                    setTimeout(() => this.props.navigation.popToTop(), 3000);
                  }
                } catch (err) {
                  this.setState({loader: false});
                }
              }}>
              {loader ? (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={{
                    alignSelf: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                />
              ) : (
                <Text style={styles.buttonTitleStyle}>
                  {rated !== 0 ? 'RATE' : 'SKIP'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    );
  }
}

export default withApollo(RatingsPage);
