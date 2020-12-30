import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
  Alert,
  ActivityIndicator,
  AppState,
  Dimensions,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {Header, Overlay} from 'react-native-elements';
import {Query, Mutation, withApollo} from 'react-apollo';
import {
  MEPOST,
  JOIN_VIDEO_CALL,
  JOIN_VOICE_CALL,
  JoinChatMutation,
  GetAppointmentById,
  ADD_DEVICE,
  CANCEL_APPOINTMENT,
  UPDATE_DEVICE,
  START_VIDEO_CALL,
  NOTIFICATION as NOTIFICATIONS,
} from '../../QueryAndMutation';
import AsyncStorage from '@react-native-community/async-storage';
import Aegle from '../../assets/aegle-black.svg';
import FastImage from 'react-native-fast-image';
import {NavigationActions} from 'react-navigation';
import ActivityIndicatorPage from './ActivityIndicatorPage';
import {
  check,
  PERMISSIONS,
  checkMultiple,
  RESULTS,
  request,
} from 'react-native-permissions';
import SymptomImg from '../../assets/symptom.svg';
import MentalImg from '../../assets/mental.svg';
import MonitorImg from '../../assets/healthMonitor.svg';
import ForumImg from '../../assets/forum.svg';
import DoctorImg from '../../assets/doctor.svg';
import ShowMessage, {type} from '../../Components/toster/ShowMessage';
import DeviceInfo from 'react-native-device-info';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import {utcDateToString, timeConversion} from '../../Utils/dateFormater';
import {
  FCM_TOKEN,
  UNIQUE_ID,
  NOTIFICATION,
  FIRST_NAME,
  SYMPTOMS,
  SYMPTOMS_QUESTIONS,
  AUTH_TOKEN,
} from 'react-native-dotenv';
import FastStorage from 'react-native-fast-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import GradientButton from '../../Components/GradientButton';

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
    // justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: hp('6%'),
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  bodyText: {
    fontFamily: 'Muli-Regular',
    fontSize: 20,
    justifyContent: 'center',
  },
  symptomButtonStyle: {
    backgroundColor: 'rgba(130, 130, 130, 0.07);',
    marginVertical: 10,
    paddingVertical: 15,
    marginTop: 20,
  },
  symptomButtonTitleStyle: {
    color: '#C4C4C4',
    fontSize: 14,
    fontFamily: 'Muli-Regular',
  },
  headerImageIcon: {
    height: wp('8%'),
    width: wp('8%'),
    alignSelf: 'center',
    borderRadius: wp('8%') / 2,
  },
  headerContainer: {
    backgroundColor: '#fff',
    height: hp('10%'),
    borderBottomColor: '#fff',
  },
  navText: {
    fontFamily: 'Muli-Regular',
    fontSize: 20,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  nameText: {
    fontFamily: 'Muli-Regular',
    fontSize: 30,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginTop: -8,
  },
  exploreText: {
    fontFamily: 'Muli-Regular',
    fontSize: 18,
    marginBottom: 15,
    lineHeight: 23,
    fontWeight: 'bold',
  },
  doctorHeaderText: {
    fontFamily: 'muli-bold',
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
  doctorSubText: {
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
  },
  flexBar: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: -50,
    alignContent: 'center',
  },
  doctorImage: {
    height: 180,
    maxWidth: 300,
    alignSelf: 'center',
  },
  doctorHeader: {
    backgroundColor: '#0462E7',
    padding: 8,
  },
  card: {
    ...elevationShadowStyle(2),
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 18.9,
    width: wp('70%'),
    minHeight: hp('20%'),
  },
  cardTitle: {
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#1B2CC1',
    marginLeft: 20,
    marginTop: -20,
  },
  cardBodyText: {
    margin: 20,
    fontFamily: 'Muli-Regular',
    fontSize: 13,
    lineHeight: 17,
    color: '#262626',
  },
  cardBtn: {
    padding: 10,
    fontFamily: 'Muli-Regular',
    fontSize: 13,
    color: '#0066F5',
  },
  cardBtnView: {
    backgroundColor: 'rgba(0, 102, 245, 0.1)',
    alignSelf: 'flex-end',
    margin: 15,
    borderRadius: 5,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  logo: {
    alignSelf: 'center',
  },
  title: {
    paddingHorizontal: 15,
    alignSelf: 'center',
    textAlign: 'center',
  },
  buttonDiv: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignSelf: 'center',
  },
  accept: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
  },
  decline: {
    backgroundColor: '#C11B1B',
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  button: {
    color: 'white',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  iconImage: {
    height: 95,
    width: 95,
    alignSelf: 'center',
  },
  iconCircle: {
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20,
    height: 95,
    width: 95,
    ...elevationShadowStyle(3),
  },
  headText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 24,
    marginBottom: 10,
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
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Muli-Bold',
  },
});

class HomePage extends React.Component {
  state = {
    firstName: '',
    roomId: '1',
    sessionId: '2',
    open: false,
    openChat: false,
    openVoice: false,
    openVoice: false,
    openSub: false,
    id: '',
    token: '',
    appointmentId: '',
    room: '',
    time: '',
    identity: '',
    loading: false,
    declineLoading: false,
    appState: AppState.currentState,
    permissionsAndroidCamera: true,
    permissionsAndroidMicroPhone: true,
    photo: {},
  };

  unsubscribe = 0;

  handleVideo = async data => {
    const {appointmentId, sessionId, roomId} = data && data;

    await FastStorage.removeItem(NOTIFICATION);

    Platform.OS === 'ios'
      ? await this.checkIosPermissions()
      : await this.confirmRequestPermissions();

    if (
      !this.state.permissionsAndroidCamera ||
      !this.state.permissionsAndroidMicroPhone
    ) {
      return;
    }
    console.log('video reach');

    try {
      const {client} = this.props;
      const res = await client.query({
        query: GetAppointmentById,
        variables: {appointmentId},
        fetchPolicy: 'network-only',
      });

      const {
        time,
        approvedBy: {
          profile: {firstName, lastName},
        },
        session: {id, room},
      } = res.data.getAppointmentById;

      this.setState({
        roomId: roomId || room,
        sessionId: sessionId || id,
        open: true,
        time,
        doctorName: `${firstName} ${lastName}`,
        appointmentId,
      });
    } catch (err) {
      ShowMessage(type.ERROR, 'Error');
      this.setState({
        open: false,
      });
    }
  };

  handleVoice = async data => {
    const {appointmentId, sessionId, roomId} = data && data;

    await FastStorage.removeItem(NOTIFICATION);

    Platform.OS === 'ios'
      ? await this.checkIosPermissions()
      : await this.confirmRequestPermissions();

    if (
      // !this.state.permissionsAndroidCamera ||
      !this.state.permissionsAndroidMicroPhone
    ) {
      return;
    }

    try {
      const {client} = this.props;
      const res = await client.query({
        query: GetAppointmentById,
        variables: {appointmentId},
        fetchPolicy: 'network-only',
      });

      const {
        time,
        approvedBy: {
          profile: {firstName, lastName, photo},
        },
        session: {id, room},
      } = res.data.getAppointmentById;

      console.log('hurray voice');
      this.setState({
        roomId: roomId || room,
        sessionId: sessionId || id,
        openVoice: true,
        time,
        doctorName: `${firstName} ${lastName}`,
        appointmentId,
        photo,
      });
    } catch (err) {
      ShowMessage(type.ERROR, 'Error');
      this.setState({
        openVoice: false,
      });
    }
  };

  handleChat = async data => {
    console.log(data, 'chatdata');
    const {appointmentId, sessionId, roomId} = data && data;
    const {id} = this.state;

    const {client} = this.props;
    const res = await client.query({
      query: GetAppointmentById,
      variables: {appointmentId},
      fetchPolicy: 'network-only',
    });

    if (res) {
      const {
        time,
        approvedBy: {
          profile: {firstName, lastName},
        },
      } = res.data.getAppointmentById;

      console.log(roomId, 'room');

      console.log('startChat', data, id);
      // if (subject === id) {
      this.setState({
        room: roomId,
        sessionId,
        time,
        doctorName: `${firstName} ${lastName}`,
        appointmentId,
        openChat: true,
      });
      // }
    }
  };

  cancelAppointment = async () => {
    const {appointmentId} = this.state;
    this.setState({
      declineLoading: true,
    });
    await FastStorage.removeItem(NOTIFICATION);
    console.log(appointmentId, 'id');
    const {client} = this.props;
    try {
      const res = await client.mutate({
        mutation: CANCEL_APPOINTMENT,
        variables: {data: {appointmentId, reason: ''}},
      });

      if (res) {
        console.log(res, 'resss');
        this.setState({
          open: false,
          declineLoading: false,
        });
        ShowMessage(type.ERROR, 'Appointment Cancelled');
        return;
      }
    } catch (err) {
      this.setState({
        declineLoading: false,
      });
    }
  };

  requestNotificationPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  };

  requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Audio Permission',
          message: 'Aegle wants access to your microphone',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'Aegle wants access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  permissionsAndroidCheckCamera = camera => {
    const cameraPermission =
      camera == 'camera'
        ? true
        : 'no camera'
        ? false
        : this.state.permissionsAndroidCamera;
    this.setState({
      permissionsAndroidCamera: cameraPermission,
    });
  };

  permissionsAndroidCheckMic = microphone => {
    const microphonePermission =
      microphone == 'microphone'
        ? true
        : 'no microphone'
        ? false
        : this.state.permissionsAndroidMicroPhone;
    this.setState({
      permissionsAndroidMicroPhone: microphonePermission,
    });
  };

  confirmRequestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.permissionsAndroidCheckMic('microphone');
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Audio Permission',
              message: 'Aegle wants access to your microphone',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.permissionsAndroidCheckMic('microphone');
            console.log('You can use the Microphone');
          } else {
            ShowMessage(
              type.INFO,
              'Microphone permission  was denied. Please enable it from your Settings app',
            );
            this.permissionsAndroidCheckMic('no microphone');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    } catch (err) {
      console.warn(err);
    }
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        this.permissionsAndroidCheckCamera('camera');
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'Aegle wants access to your camera',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the Camera');
            this.permissionsAndroidCheckCamera('camera');
          } else {
            console.log('Camera permission denied');
            ShowMessage(
              type.INFO,
              'Camera permsission was denied. Please enable it from your Settings app',
            );
            this.permissionsAndroidCheckCamera('no camera');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  checkIosPermissions = async () => {
    await checkMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MICROPHONE,
    ]).then(statuses => {
      statuses[PERMISSIONS.IOS.CAMERA] != RESULTS.GRANTED &&
        request(PERMISSIONS.IOS.CAMERA);
      statuses[PERMISSIONS.IOS.MICROPHONE] != RESULTS.GRANTED &&
        request(PERMISSIONS.IOS.MICROPHONE);
    });
  };

  checkFirebasePermission = async () => {
    const enabled = await messaging().hasPermission();
    console.log(enabled, 'enabled');
    if (enabled == -1) {
      (await this.requestFirebasePermission()) && (await this.getFcmToken());
    } else if (enabled == 0) {
      ShowMessage(
        type.INFO,
        'Notification was denied. Please enable it from your Settings app',
      );
    } else if (enabled == 1) {
      await this.getFcmToken();
    }
  };

  requestFirebasePermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  getFcmToken = async () => {
    let that = this;
    const getUniqueId = DeviceInfo.getUniqueId();
    console.log(getUniqueId, 'id');
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      await AsyncStorage.setItem(FCM_TOKEN, fcmToken);
      await AsyncStorage.setItem(UNIQUE_ID, getUniqueId);

      try {
        const me = await that.props.client.query({
          query: MEPOST,
        });

        const {
          me: {devices},
        } = me.data;

        const fingerPrint = devices.find(
          arr => arr.fingerprint === getUniqueId,
        );

        const fcm = devices.find(arr => arr.fcmToken === fcmToken);

        if (fingerPrint === undefined || fcm === undefined) {
          console.log('result');
          try {
            const data = await that.props.client.mutate({
              mutation: ADD_DEVICE,
              variables: {
                data: {
                  fingerprint: getUniqueId,
                  fcmToken,
                },
              },
            });
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        ShowMessage(type.ERROR, err);
      }
    } else {
      console.log('fcm token error');
    }
    return;
  };

  getRefreshToken = async () => {
    let that = this;
    const token = await AsyncStorage.getItem(FCM_TOKEN);
    if (!token) {
      messaging().onTokenRefresh(async token => {
        const fcmToken = await messaging().getToken();
        const getUniqueId = await AsyncStorage.getItem(UNIQUE_ID);
        const old_fcmToken = await AsyncStorage.getItem(FCM_TOKEN);

        if (old_fcmToken !== fcmToken) {
          await AsyncStorage.setItem(FCM_TOKEN, token);
        }
        try {
          const data = await that.props.client.mutate({
            mutation: UPDATE_DEVICE,
            variables: {
              data: {
                fcmToken,
              },
              oldFingerprint: getUniqueId,
            },
          });
        } catch (err) {
          ShowMessage(type.ERROR, err);
        }
      });
    }
  };

  fcmNotifications = async () => {
    this.unsubscribe = messaging().onMessage(async remoteMessage => {
      const {
        notification: {title, body},
        data: {action, type},
        data,
      } = remoteMessage;
      console.log(data, 'data');
      if (action === 'appointment.started' && type === 'videoCall') {
        const {appointmentId, sessionId, roomId} = data;
        if (appointmentId && sessionId && roomId) {
          this.showAlertVideo(title, body, data);
        }
        return;
      } else if (action === 'appointment.started' && type === 'chat') {
        const {appointmentId, sessionId, roomId} = data;
        if (appointmentId && sessionId && roomId) {
          this.showAlertChat(title, body, data);
        }
        return;
      } else if (action === 'appointment.started' && type === 'voiceCall') {
        const {appointmentId, sessionId, roomId} = data;
        if (appointmentId && sessionId && roomId) {
          console.log('shhshsh');
          this.showAlertVoice(title, body, data);
        }
        return;
      } else if (action === 'appointment.approved') {
        const {date, time} = data;
        const militaryTime = timeConversion(time);

        if (militaryTime) {
          const time = militaryTime.trim();
          const dateToArray = [...date];
          dateToArray.splice(11, 5, time);
          const newDate = dateToArray.join('');
          this.showAlertCalendar(title, body, newDate);
        }
        return;
      } else if (action === 'subscription.created') {
        this.showAlert(title, body);
        return;
      } else {
        this.showAlert(title, body, data);
        return;
      }
    });
  };

  showAlert = (title, message, data) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: async () => {
            this.unsubscribe;
            const {navigation} = this.props;
            await FastStorage.removeItem(NOTIFICATION);
            console.log(data, 'dataaaas');
            const {action} = data;
            console.log(action.appointmentId, 'id');
            if (
              action == 'report.created' ||
              action == 'prescription.created' ||
              action == 'referral.created'
            ) {
              navigation.navigate(
                'DoctorNote',
                {
                  appointmentId: data.appointmentId,
                },
                // NavigationActions.navigate({
                //   routeName:
                //     action == 'report.created'
                //       ? 'Report'
                //       : action == 'prescription.created'
                //       ? 'Prescription'
                //       : action == 'referral.created'
                //       ? 'Referral'
                //       : '',
                // }),
              );
            }

            console.log('OK Pressed');
          },
        },
      ],
      {cancelable: false},
    );
  };

  showAlertVideo = (title, message, data) => {
    let that = this;
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: async () => {
            let notificationIdArray = [];

            if (await AsyncStorage.getItem('NOTIFICATIONID')) {
              notificationIdArray = await AsyncStorage.getItem(
                'NOTIFICATIONID',
              );
              notificationIdArray = JSON.parse(notificationIdArray);
            }

            notificationIdArray.push(data.appointmentId);
            await AsyncStorage.setItem(
              'NOTIFICATIONID',
              JSON.stringify(notificationIdArray),
            );
            console.log('reach');
            that.handleVideo(data);
            // await AsyncStorage.removeItem(NOTIFICATION);
            await FastStorage.removeItem(NOTIFICATION);
            this.unsubscribe;
            console.log('OK Pressed');
          },
        },
      ],
      {cancelable: false},
    );
  };

  showAlertVoice = (title, message, data) => {
    let that = this;
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: async () => {
            that.handleVoice(data);
            await FastStorage.removeItem(NOTIFICATION);
            console.log('OK Pressed');
          },
        },
      ],
      {cancelable: false},
    );
  };

  showAlertChat = (title, message, data) => {
    let that = this;
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: async () => {
            that.handleChat(data);
            await FastStorage.removeItem(NOTIFICATION);
            console.log('OK Pressed');
          },
        },
      ],
      {cancelable: false},
    );
  };

  showAlertCalendar = (title, message, newDate) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: async () => {
            this.unsubscribe;
            await FastStorage.removeItem(NOTIFICATION);
            // this.addToCalendar('Aegle Doctor Appointment', newDate);
          },
        },
      ],
      {cancelable: false},
    );
  };

  handleBackgroundNotifications = async () => {
    if (await FastStorage.getItem(NOTIFICATION)) {
      console.log(await FastStorage.getItem(NOTIFICATION), 'aba');
      const notification = await FastStorage.getItem(NOTIFICATION);
      // const notification = await AsyncStorage.getItem(NOTIFICATION);
      const payload = JSON.parse(notification);
      const {
        notification: {title, body},
        data: {action, type},
        data,
      } = payload;
      if (action === 'appointment.started' && type === 'videoCall') {
        const {appointmentId, sessionId, roomId} = data;
        if (appointmentId && sessionId && roomId) {
          this.showAlertVideo(title, body, data);
        }
        return;
      } else if (action === 'appointment.started' && type === 'chat') {
        const {appointmentId, sessionId, roomId} = data;
        if (appointmentId && sessionId && roomId) {
          this.showAlertChat(title, body, data);
        }
        return;
      } else if (action === 'appointment.started' && type === 'voiceCall') {
        const {appointmentId, sessionId, roomId} = data;
        if (appointmentId && sessionId && roomId) {
          console.log('shhshsh');
          this.showAlertVoice(title, body, data);
        }
        return;
      } else if (action === 'appointment.approved') {
        const {date, time} = data;
        const militaryTime = timeConversion(time);

        if (militaryTime) {
          const time = militaryTime.trim();
          const dateToArray = [...date];
          dateToArray.splice(11, 5, time);
          const newDate = dateToArray.join('');
          this.showAlertCalendar(title, body, newDate);
        }
        return;
      } else if (action === 'subscription.created') {
        this.showAlert(title, body);
        return;
      } else {
        this.showAlert(title, body, data);
        return;
      }
    }
  };

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      setTimeout(() => {
        this.handleBackgroundNotifications();
        console.log(this.state.appState, nextAppState, 'app state transition');
        PushNotificationIOS.removeAllDeliveredNotifications();
      }, 3000);
    }
    this.setState({appState: nextAppState});
  };

  videoFromNotification = async () => {
    console.log('videoFromNotification');
    // await AsyncStorage.removeItem('NOTIFICATIONID');
    const notifications = await this.props.client.query({
      query: NOTIFICATIONS,
    });
    const {getNotifications} = notifications && notifications.data;
    const latestNotification = getNotifications[0];
    console.log(latestNotification, 'gogogogo');

    if (await FastStorage.getItem(NOTIFICATION)) {
      const notification = await FastStorage.getItem(NOTIFICATION);
      const payload = JSON.parse(notification);
      const {
        data: {action},
      } = payload;
      if (action === 'appointment.started') {
        return;
      }
    }

    if (latestNotification) {
      const {
        appointment: {id: appointmentId, status},
      } = latestNotification;

      let notificationIdArray = [];
      console.log(appointmentId, status, 'status');
      if (status != 'APPROVED') {
        return;
      }

      if ((await AsyncStorage.getItem('NOTIFICATIONID')) == null) {
        notificationIdArray.push(appointmentId);
        await AsyncStorage.setItem(
          'NOTIFICATIONID',
          JSON.stringify(notificationIdArray),
        );
      } else {
        const idArray = await AsyncStorage.getItem('NOTIFICATIONID');
        notificationIdArray = JSON.parse(idArray);
        const idCheck = notificationIdArray.find(n => n == appointmentId);

        if (idCheck != undefined) {
          console.log('returenen');
          return;
        }
        console.log('returenen2');
        notificationIdArray.push(appointmentId);
        await AsyncStorage.setItem(
          'NOTIFICATIONID',
          JSON.stringify(notificationIdArray),
        );
      }

      if (
        latestNotification &&
        latestNotification.action == 'appointment.started' &&
        latestNotification.appointment.meansOfContact == 'VIDEO_CALL'
      ) {
        const {
          appointment: {
            // id: appointmentId,
            session: {id: sessionId, room: roomId},
          },
        } = latestNotification;
        console.log(appointmentId, sessionId, roomId, 'roomer');
        if (appointmentId && sessionId && roomId) {
          const data = {
            appointmentId,
            sessionId,
            roomId,
          };
          this.handleVideo(data);
        }
      } else if (
        latestNotification &&
        latestNotification.action == 'appointment.started' &&
        latestNotification.appointment.meansOfContact == 'VOICE_CALL'
      ) {
        const {
          appointment: {
            // id: appointmentId,
            session: {id: sessionId, room: roomId},
          },
        } = latestNotification;
        console.log(appointmentId, sessionId, roomId, 'roomer');
        if (appointmentId && sessionId && roomId) {
          const data = {
            appointmentId,
            sessionId,
            roomId,
          };
          this.handleVoice(data);
        }
      } else if (
        latestNotification &&
        latestNotification.action == 'appointment.started' &&
        latestNotification.appointment.meansOfContact == 'CHAT'
      ) {
        const {
          appointment: {
            // id: appointmentId,
            session: {id: sessionId, room: roomId},
          },
        } = latestNotification;
        console.log(appointmentId, sessionId, roomId, 'roomer');
        if (appointmentId && sessionId && roomId) {
          const data = {
            appointmentId,
            sessionId,
            roomId,
          };
          this.handleChat(data);
        }
      }
    }
  };

  async componentDidMount() {
    await this.videoFromNotification();

    const {client} = this.props;
    let that = this;

    PushNotificationIOS.removeAllDeliveredNotifications();

    if (Platform.OS === 'ios') {
      await this.checkIosPermissions();
    } else {
      await this.requestPermissions();
    }
    // console.log(await FastStorage.getItem('key'), 'dom');

    // this.registerAppWithFCM();
    // this.register(onRegister, onNotification, onOpenNotification);
    // localNotificationService.configure(onOpenNotification);
    // function onRegister(token) {
    //   console.log('[App] onRegister: ', token);
    // }

    // function onNotification(notify) {
    //   console.log('[App] onNotification: ', notify);
    //   const options = {
    //     soundName: 'default',
    //     playSound: true, //,
    //     // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
    //     // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
    //   };
    //   localNotificationService.showNotification(
    //     0,
    //     notify.title,
    //     notify.body,
    //     notify,
    //     options,
    //   );
    // }

    // function onOpenNotification(notify) {
    //   console.log('[App] onOpenNotification: ', notify);
    //   alert('Open Notification: ' + notify.body);
    // }

    await this.requestNotificationPermission();

    await this.checkFirebasePermission();

    await this.fcmNotifications();

    // await this.getInitialNotification();

    AppState.addEventListener('change', this._handleAppStateChange);

    // await this.getRefreshToken();

    this.handleBackgroundNotifications();

    const res = await client.query({
      query: MEPOST,
      fetchPolicy: 'network-only',
    });

    const {id, profile, isPhoneVerified} = res.data.me;
    this.setState({id});
    await AsyncStorage.setItem(FIRST_NAME, profile.firstName);

    if (!isPhoneVerified) {
      ShowMessage(type.ERROR, 'Please verify your phone number');
      setTimeout(
        () => this.props.navigation.navigate('OauthNumberPage', {route: 'app'}),
        3000,
      );
    }

    if (AsyncStorage.getItem(SYMPTOMS)) {
      await AsyncStorage.removeItem(SYMPTOMS);
    }

    if (AsyncStorage.getItem(SYMPTOMS_QUESTIONS)) {
      await AsyncStorage.removeItem(SYMPTOMS_QUESTIONS);
    }

    await FastStorage.removeItem(NOTIFICATION);
    // await AsyncStorage.removeItem(NOTIFICATION);

    setTimeout(async () => {
      if ((await AsyncStorage.getItem('freeTrial')) == null) {
        this.setState({openSub: true});
      }
    }, 5000);
  }

  async componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    // this.unRegister();
    // localNotificationService.unregister();
    this.unsubscribe;
    await FastStorage.removeItem(NOTIFICATION);
  }

  handleOnCompleted = (data, renewState) => {
    renewState(data);
  };

  decline = () => {
    this.setState({
      open: false,
      openChat: false,
      openVoice: false,
      openSub: false,
    });
  };

  openVideo = () => {
    const {room, token, appointmentId} = this.state;
    this.props.navigation.navigate('VideoChat', {
      roomName: room,
      token,
      appointmentId,
    });
  };

  openVoice = () => {
    const {room, token, appointmentId, photo} = this.state;
    this.props.navigation.navigate('VoiceChat', {
      roomName: room,
      token,
      appointmentId,
      photo,
    });
  };

  openChat = () => {
    console.log('openerrrr', this.state.room);
    const {room, token, appointmentId, id} = this.state;
    console.log(id, room, token, appointmentId, 'asfdgf');
    this.props.navigation.navigate('Chat', {
      roomId: room,
      token,
      appointmentId,
      // sessionId,
      patientId: id,
    });
  };

  addToCalendar = (title, startDateUTC) => {
    const eventConfig = {
      title,
      startDate: utcDateToString(
        moment
          .utc(startDateUTC)
          .subtract(1, 'hours')
          .add(1, 'day'),
      ),
      notes: 'appointment!',
      navigationBarIOS: {
        tintColor: 'orange',
        backgroundColor: 'green',
        titleColor: 'blue',
      },
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(({eventInfo: {calendarItemIdentifier, eventIdentifier}}) => {
        console.warn(JSON.stringify(eventInfo));
      })
      .catch(error => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };

  render() {
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    const {doctorName} = this.state;
    return (
      <Query query={MEPOST} fetchPolicy="network-only">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error)
            return (
              AsyncStorage.removeItem(AUTH_TOKEN) &&
              this.props.navigation.navigate('SignInEmail')
            );
          const me = data.me ? data.me : null;
          const {
            profile: {photo},
          } = me;
          return (
            <View style={styles.container}>
              {/* <Header
                containerStyle={styles.headerContainer}
                statusBarProps={{
                  translucent: false,
                  barStyle: 'default',
                }}
                rightContainerStyle={{alignItems: 'center', height: wp('10%')}}
                rightComponent={ */}
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Profile', {
                      user: me,
                    });
                  }}
                  underlayColor="rgba(0,0,0,0.01)">
                  <View style={styles.headerImageIcon}>
                    {photo && photo.original ? (
                      <FastImage
                        style={styles.headerImageIcon}
                        source={{
                          uri: photo.thumbnail,
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : (
                      <Image
                        source={require('../../assets/user-default.png')}
                        style={styles.headerImageIcon}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              {/* } */}
              {/* /> */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}
                nestedScrollEnabled={true}>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}>
                  <Text style={styles.navText}>Hello,</Text>
                  <Text style={styles.nameText}>
                    {me && me.profile.firstName}
                  </Text>
                  <View
                    style={{
                      marginTop: 10,
                      width: '100%',
                      alignSelf: 'center',
                      maxHeight: wp('50%'),
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Question2', {
                          questions: [
                            {
                              id: 1,
                              question: `${me &&
                                me.profile
                                  .firstName} who is the assessment for?`,
                              options: [
                                {
                                  text: 'Myself',
                                  value: 1,
                                },
                                {
                                  text: 'Someone else',
                                  value: 2,
                                },
                              ],
                            },
                          ],
                          nextPage: () =>
                            this.props.navigation.navigate('SymptomSearch', {
                              me,
                            }),
                        })
                      }>
                      <SymptomImg
                        width={'100%'}
                        height={hp('30%')}
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.flexBar}>
                    <TouchableOpacity
                      // style={{maxWidth: wp('45%'), height: hp('25%')}}
                      underlayColor="rgba(0, 0, 0, 0.01)"
                      onPress={() => {
                        this.props.navigation.navigate('TalkToDoctor');
                      }}>
                      <DoctorImg width={wp('45%')} height={hp('20%')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      // style={{maxWidth: wp('45%'), height: hp('25%')}}
                      underlayColor="rgba(0, 0, 0, 0.01)"
                      onPress={() => {
                        this.props.navigation.navigate('MentalAssessment', {
                          me,
                        });
                      }}>
                      <MentalImg width={wp('45%')} height={hp('20%')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      // style={{width: wp('45%'), marginTop: -150}}
                      underlayColor="rgba(0, 0, 0, 0.01)"
                      onPress={() => {
                        this.props.navigation.navigate('Forum');
                      }}>
                      <ForumImg width={wp('45%')} height={hp('20%')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      // style={{width: wp('45%'), marginTop: -150}}
                      underlayColor="rgba(0, 0, 0, 0.01)"
                      onPress={() => {
                        this.props.navigation.navigate('MonitorHealthStart');
                      }}>
                      <MonitorImg width={wp('45%')} height={hp('20%')} />
                    </TouchableOpacity>
                  </View>

                  <View style={{marginVertical: 50}}>
                    <Text style={styles.exploreText}>Explore</Text>
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal>
                      <TouchableOpacity
                        underlayColor="rgba(0, 0, 0, 0.01)"
                        onPress={() => {
                          this.props.navigation.navigate('ConditionLibrary');
                        }}>
                        <View style={styles.card}>
                          <View style={styles.cardBtnView}>
                            <Text style={styles.cardBtn}>Click to read</Text>
                          </View>
                          <Text style={styles.cardTitle}>
                            Condition{'\n'}Library
                          </Text>
                          <Text style={styles.cardBodyText}>
                            Discover thousands of health conditions{'\n'}
                            and their meaning here
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        underlayColor="rgba(0, 0, 0, 0.01)"
                        onPress={() => {
                          this.props.navigation.navigate('FamilyQuestions');
                        }}>
                        <View style={styles.card}>
                          <View style={styles.cardBtnView}>
                            <Text style={styles.cardBtn}>Click to read</Text>
                          </View>
                          <Text style={styles.cardTitle}>
                            Add a family{'\n'}Member
                          </Text>
                          <Text style={styles.cardBodyText}>
                            Add your family members who are below
                            {'\n'}
                            the age of 16 here
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </View>
              </ScrollView>

              <Overlay
                isVisible={this.state.openChat}
                onBackdropPress={this.decline}
                width={(deviceWidth / 4) * 3}
                height={(deviceHeight / 3) * 2}
                overlayStyle={{
                  borderColor: '#1B2CC1',
                  borderWidth: 1.5,
                  justifyContent: 'space-around',
                }}>
                <>
                  <Aegle style={styles.logo} />
                  <Text style={styles.title}>
                    Dr. {doctorName} started your chat appointment scheduled for{' '}
                    {this.state.time} today
                  </Text>
                  <View style={styles.buttonDiv}>
                    <Mutation mutation={JoinChatMutation}>
                      {joinChat => (
                        <TouchableOpacity
                          disabled={
                            this.state.loading || this.state.declineLoading
                          }
                          onPress={() => {
                            this.setState({loading: true});
                            joinChat({
                              variables: {
                                data: {
                                  sessionId: this.state.sessionId,
                                  patientId: this.state.id,
                                },
                              },
                            })
                              .then(res => {
                                if (res) {
                                  const {
                                    sessionId,
                                    token,
                                    identity,
                                    appointmentId,
                                    roomId,
                                  } = res.data.joinChat;
                                  this.setState({
                                    openChat: false,
                                    token,
                                    identity,
                                    appointmentId,
                                    sessionId,
                                    roomId,
                                    loading: false,
                                  });
                                  this.openChat();
                                }
                              })
                              .catch(err => this.setState({loading: false}));
                          }}>
                          <View style={styles.accept}>
                            {this.state.loading ? (
                              <ActivityIndicator
                                color="white"
                                style={{paddingHorizontal: 25}}
                              />
                            ) : (
                              <Text style={styles.button}>Join</Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      )}
                    </Mutation>

                    <TouchableOpacity
                      onPress={() => this.cancelAppointment()}
                      disabled={
                        this.state.declineLoading || this.state.loading
                      }>
                      <View style={styles.decline}>
                        {this.state.declineLoading ? (
                          <ActivityIndicator
                            color="white"
                            style={{paddingHorizontal: 33}}
                          />
                        ) : (
                          <Text style={styles.button}>Decline</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              </Overlay>

              <Overlay
                width={(deviceWidth / 4) * 3}
                height={(deviceHeight / 3) * 2}
                overlayStyle={{
                  borderColor: '#1B2CC1',
                  borderWidth: 1.5,
                  justifyContent: 'space-around',
                }}
                isVisible={this.state.open}
                onBackdropPress={this.decline}>
                <>
                  <Aegle style={styles.logo} />
                  <Text style={styles.title}>
                    Dr. {doctorName} is in the consulting room and has started
                    your appointment scheduled for {this.state.time} today
                  </Text>

                  <View style={styles.buttonDiv}>
                    <Mutation mutation={JOIN_VIDEO_CALL}>
                      {joinVideoCall => (
                        <TouchableOpacity
                          disabled={
                            this.state.loading || this.state.declineLoading
                          }
                          onPress={async () => {
                            await AsyncStorage.removeItem('NOTIFICATIONID');
                            const {id, roomId, sessionId} = this.state;
                            this.setState({loading: true});
                            joinVideoCall({
                              variables: {
                                data: {
                                  sessionId,
                                  patientId: id,
                                  room: roomId,
                                },
                              },
                            })
                              .then(res => {
                                if (res) {
                                  const {
                                    room,
                                    token,
                                    // appointmentId,
                                  } = res.data.joinVideoCall;
                                  this.setState({
                                    open: false,
                                    token,
                                    room,
                                    loading: false,
                                    // appointmentId,
                                  });
                                  this.openVideo();
                                }
                              })
                              .catch(err => this.setState({loading: false}));
                          }}>
                          <View style={styles.accept}>
                            {this.state.loading ? (
                              <ActivityIndicator
                                color="white"
                                style={{paddingHorizontal: 25}}
                              />
                            ) : (
                              <Text style={styles.button}>Join</Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      )}
                    </Mutation>
                    <TouchableOpacity
                      onPress={() => this.cancelAppointment()}
                      disabled={
                        this.state.declineLoading || this.state.loading
                      }>
                      <View style={styles.decline}>
                        {this.state.declineLoading ? (
                          <ActivityIndicator
                            color="white"
                            style={{paddingHorizontal: 33}}
                          />
                        ) : (
                          <Text style={styles.button}>Decline</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              </Overlay>

              <Overlay
                width={(deviceWidth / 4) * 3}
                height={(deviceHeight / 3) * 2}
                overlayStyle={{
                  borderColor: '#1B2CC1',
                  borderWidth: 1.5,
                  justifyContent: 'space-around',
                }}
                isVisible={this.state.openVoice}
                onBackdropPress={this.decline}>
                <>
                  <Aegle style={styles.logo} />
                  <Text style={styles.title}>
                    Dr. {doctorName} is in the consulting room and has started
                    your appointment scheduled for {this.state.time} today
                  </Text>

                  <View style={styles.buttonDiv}>
                    <Mutation mutation={JOIN_VOICE_CALL}>
                      {joinVoiceCallAsVideo => (
                        <TouchableOpacity
                          disabled={
                            this.state.loading || this.state.declineLoading
                          }
                          onPress={() => {
                            const {id, roomId, sessionId} = this.state;
                            this.setState({loading: true});
                            joinVoiceCallAsVideo({
                              variables: {
                                data: {
                                  sessionId,
                                  patientId: id,
                                  room: roomId,
                                },
                              },
                            })
                              .then(res => {
                                if (res) {
                                  const {
                                    room,
                                    token,
                                    // appointmentId,
                                  } = res.data.joinVoiceCallAsVideo;
                                  this.setState({
                                    openVoice: false,
                                    token,
                                    room,
                                    loading: false,
                                    // appointmentId,
                                  });
                                  this.openVoice();
                                }
                              })
                              .catch(err => this.setState({loading: false}));
                          }}>
                          <View style={styles.accept}>
                            {this.state.loading ? (
                              <ActivityIndicator
                                color="white"
                                style={{paddingHorizontal: 25}}
                              />
                            ) : (
                              <Text style={styles.button}>Join</Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      )}
                    </Mutation>
                    <TouchableOpacity
                      onPress={() => this.cancelAppointment()}
                      disabled={
                        this.state.declineLoading || this.state.loading
                      }>
                      <View style={styles.decline}>
                        {this.state.declineLoading ? (
                          <ActivityIndicator
                            color="white"
                            style={{paddingHorizontal: 33}}
                          />
                        ) : (
                          <Text style={styles.button}>Decline</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              </Overlay>

              <Overlay
                width={(deviceWidth / 4) * 3.5}
                height={deviceHeight / 1.5}
                overlayStyle={{
                  borderRadius: 10,
                }}
                isVisible={this.state.openSub}
                onBackdropPress={this.decline}>
                <>
                  <View style={styles.mainBox}>
                    <View style={styles.iconCircle}>
                      <Image
                        source={require('../../assets/completed-mark.png')}
                        style={styles.iconImage}
                      />
                    </View>
                    <Text style={styles.headText}>Congrats!</Text>
                    <Text
                      style={
                        styles.bodyText
                      }>{`You have been awarded a 7-day\nfree trial to book appointments`}</Text>

                    <GradientButton
                      style={styles.buttonStyle}
                      text="OK"
                      textStyle={styles.buttonTitleStyle}
                      gradientBegin="#1B2CC1"
                      gradientEnd="rgba(27, 44, 193, 0.77)"
                      gradientDirection="vertical"
                      height={90}
                      width={270}
                      radius={5}
                      onPressAction={async () => {
                        this.decline();
                        await AsyncStorage.setItem('freeTrial', 'true');
                      }}
                    />
                  </View>
                </>
              </Overlay>
            </View>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(HomePage);
