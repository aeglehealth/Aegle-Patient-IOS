// /* eslint-disable react/prop-types */
// /* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable global-require */
// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   Platform,
//   TouchableOpacity,
//   PermissionsAndroid,
// } from 'react-native';
// import {Header, Button, Overlay} from 'react-native-elements';
// import {UserContext} from '../../store/context/UserContext';
// import {Query, Mutation, withApollo} from 'react-apollo';
// import {
//   MEPOST,
//   VIDEO_CALL_SUBSCRIPTION,
//   JOIN_VIDEO_CALL,
//   CHAT_START_SUBSCRIPTION,
//   JoinChatMutation,
// } from '../../QueryAndMutation';
// import AsyncStorage from '@react-native-community/async-storage';
// import Aegle from '../../assets/aegle-black.svg';
// import FastImage from 'react-native-fast-image';
// import ActivityIndicatorPage from './ActivityIndicatorPage';
// import {
//   PERMISSIONS,
//   checkMultiple,
//   RESULTS,
//   request,
// } from 'react-native-permissions';
// import {IMAGE_URL} from '../../store/constants/Api';

// function elevationShadowStyle(elevation) {
//   return {
//     elevation,
//     shadowColor: 'black',
//     shadowOffset: {width: 0, height: 0.5 * elevation},
//     shadowOpacity: 0.3,
//     shadowRadius: 0.8 * elevation,
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'space-between',
//   },
//   bodyText: {
//     fontFamily: 'Muli-Regular',
//     fontSize: 20,
//     justifyContent: 'center',
//   },
//   symptomButtonStyle: {
//     backgroundColor: 'rgba(130, 130, 130, 0.07);',
//     marginVertical: 10,
//     paddingVertical: 15,
//     marginTop: 20,
//   },
//   symptomButtonTitleStyle: {
//     color: '#C4C4C4',
//     fontSize: 14,
//     fontFamily: 'Muli-Regular',
//   },
//   headerImageIcon: {
//     height: 25,
//     width: 25,
//     alignSelf: 'center',
//     borderRadius: 25 / 2,
//   },
//   headerImageIcon1: {
//     maxHeight: 25,
//     maxWidth: 25,
//     alignSelf: 'center',
//     paddingEnd: 20,
//   },
//   headerContainer: {
//     backgroundColor: '#fff',
//     paddingTop: 0,
//     height: Platform.select({
//       android: 50,
//       default: 50,
//     }),
//     borderBottomColor: '#fff',
//     // ...elevationShadowStyle(2),
//   },
//   navText: {
//     fontFamily: 'Muli-Regular',
//     fontSize: 16,
//     textAlign: 'left',
//     alignSelf: 'flex-start',
//     marginLeft: -25,
//   },
//   exploreText: {
//     fontFamily: 'muli-bold',
//     fontSize: 16,
//     marginTop: 5,
//     marginBottom: 15,
//   },
//   doctorHeaderText: {
//     fontFamily: 'muli-bold',
//     fontSize: 18,
//     textAlign: 'center',
//     color: '#fff',
//   },
//   doctorSubText: {
//     fontFamily: 'Muli-Regular',
//     fontSize: 14,
//     textAlign: 'center',
//     color: '#fff',
//   },
//   doctorCard: {
//     backgroundColor: '#0066F5',
//     borderRadius: 10,
//     overflow: 'hidden',
//     flex: 1,
//   },
//   doctorImage: {
//     height: 180,
//     maxWidth: 300,
//     alignSelf: 'center',
//   },
//   doctorHeader: {
//     backgroundColor: '#0462E7',
//     padding: 8,
//   },
//   healthPicture: {
//     ...elevationShadowStyle(2),
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     marginVertical: 15,
//     borderRadius: 5,
//   },
//   healthPictureInner: {
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     justifyContent: 'center',
//     minHeight: 110,
//   },
//   healthPictureText: {
//     fontFamily: 'muli-bold',
//     fontSize: 18,
//     textAlign: 'left',
//     color: '#0066F5',
//   },
//   headerStyle: {
//     backgroundColor: '#fff',
//     shadowColor: '#fff',
//     elevation: 0,
//     borderBottomColor: '#fff',
//     shadowOpacity: 0,
//   },
//   logo: {
//     alignSelf: 'center',
//     marginTop: 100,
//     marginBottom: 50,
//   },
//   title: {
//     paddingHorizontal: 15,
//     alignSelf: 'center',
//     textAlign: 'center',
//     marginVertical: 50,
//   },
//   buttonDiv: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 50,
//   },
//   accept: {
//     backgroundColor: '#28A745',
//     padding: 10,
//     borderRadius: 5,
//   },
//   decline: {
//     backgroundColor: '#C11B1B',
//     padding: 10,
//     borderRadius: 5,
//   },
//   button: {
//     color: 'white',
//     fontFamily: 'Muli-Regular',
//     fontSize: 16,
//     fontWeight: 'bold',
//     paddingHorizontal: 20,
//   },
// });

// class HomePage extends React.Component {
//   state = {
//     firstName: '',
//     roomId: '1',
//     sessionId: '2',
//     open: false,
//     openChat: false,
//     id: '',
//     token: '',
//     room: '',
//     time: '',
//     identity: '',
//     appointmentId: '',
//   };

//   requestPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         {
//           title: 'Audio Permission',
//           message: 'Aegle wants access to your microphone',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('You can use the camera');
//       } else {
//         console.log('Camera permission denied');
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: 'Camera Permission',
//           message: 'Aegle wants access to your camera',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('You can use the camera');
//       } else {
//         console.log('Camera permission denied');
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

//   checkIosPermissions = () => {
//     checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]).then(
//       statuses => {
//         statuses[PERMISSIONS.IOS.CAMERA] != RESULTS.GRANTED &&
//           request(PERMISSIONS.IOS.CAMERA);
//         statuses[PERMISSIONS.IOS.MICROPHONE] != RESULTS.GRANTED &&
//           request(PERMISSIONS.IOS.MICROPHONE);
//       },
//     );
//   };

//   async componentDidMount() {
//     // (await AsyncStorage.clear()) &&
//     //   this.props.navigation.navigate('SignInChoices');

//     if (Platform.OS === 'ios') {
//       this.checkIosPermissions();
//     } else {
//       this.requestPermission();
//     }

//     let that = this;

//     const {client} = this.props;
//     const res = await client.query({query: MEPOST, fetchPolicy: 'no-cache'});
//     const {id, profile, isPhoneVerified} = res.data.me;

//     await AsyncStorage.setItem('aegle_firstName', profile.firstName);

//     // if (!isPhoneVerified) {
//     //   AsyncStorage.removeItem('aegle_patient_token') &&
//     //     this.props.navigation.navigate('SignInChoices');
//     // }

//     client.subscribe({query: VIDEO_CALL_SUBSCRIPTION}).subscribe({
//       next({data}) {
//         const {
//           Time,
//           RoomId,
//           SessionId,
//         } = data.emitNotificationWhenConsultIsStartedByDoctor;
//         console.log(Time, RoomId, SessionId);
//         that.setState({
//           roomId: RoomId,
//           sessionId: SessionId,
//           open: true,
//           id,
//           time: Time,
//         });
//       },
//     });

//     client.subscribe({query: CHAT_START_SUBSCRIPTION}).subscribe({
//       next({data}) {
//         const {
//           Time,
//           SessionId,
//         } = data.emitNotificationWhenTextChatConsultIsStartedByDoctor;
//         console.log(Time, SessionId);
//         that.setState({
//           sessionId: SessionId,
//           openChat: true,
//           id,
//           time: Time,
//         });
//       },
//     });

//     if (AsyncStorage.getItem('symptomArr')) {
//       await AsyncStorage.removeItem('symptomArr');
//     }

//     if (AsyncStorage.getItem('symptomQuestions')) {
//       await AsyncStorage.removeItem('symptomQuestions');
//     }
//   }

//   handleOnCompleted = (data, renewState) => {
//     renewState(data);
//   };

//   decline = () => {
//     this.setState({open: false, openChat: false});
//   };

//   openVideo = () => {
//     this.props.navigation.navigate('VideoChat', {
//       roomName: this.state.room,
//       token: this.state.token,
//     });
//   };

//   openChat = () => {
//     this.props.navigation.navigate('Chat', {
//       identity: this.state.identity,
//       token: this.state.token,
//       appointmentId: this.state.appointmentId,
//       sessionId: this.state.sessionId,
//     });
//   };

//   render() {
//     return (
//       <UserContext.Consumer>
//         {({data, renewState}) => {
//           const me = data && data.me;
//           return (
//             <Query
//               query={MEPOST}
//               fetchPolicy="cache-and-network"
//               onCompleted={data => this.handleOnCompleted(data, renewState)}>
//               {({loading, error, data: data1}) => {
//                 if (loading) return <ActivityIndicatorPage />;
//                 if (error)
//                   return (
//                     AsyncStorage.removeItem('aegle_patient_token') &&
//                     this.props.navigation.navigate('SignInChoices')
//                   );
//                 return (
//                   <View style={styles.container}>
//                     <Header
//                       containerStyle={styles.headerContainer}
//                       statusBarProps={{
//                         translucent: false,
//                         barStyle: 'default',
//                       }}
//                       leftComponent={
//                         <TouchableOpacity
//                           onPress={() => {
//                             this.props.navigation.navigate('Profile', {
//                               user: me,
//                             });
//                           }}
//                           style={styles.headerImageIcon1}
//                           underlayColor="rgba(0,0,0,0.01)">
//                           <View style={styles.headerImageIcon}>
//                             {me && me.profile.picture ? (
//                               <FastImage
//                                 style={styles.headerImageIcon}
//                                 source={{
//                                   uri: `${IMAGE_URL}${
//                                     me.profile.picture.split('/')[4]
//                                   }`,
//                                   priority: FastImage.priority.normal,
//                                 }}
//                                 resizeMode={FastImage.resizeMode.cover}
//                               />
//                             ) : (
//                               <Image
//                                 source={require('../../assets/user-default.png')}
//                                 style={styles.headerImageIcon}
//                               />
//                             )}
//                           </View>
//                         </TouchableOpacity>
//                       }
//                       centerContainerStyle={{marginLeft: -5}}
//                       centerComponent={
//                         <Text style={styles.navText}>
//                           Hello {me && me.profile.firstName}
//                         </Text>
//                       }
//                       rightComponent={
//                         <TouchableOpacity
//                           onPress={() => {
//                             this.props.navigation.navigate('MentalAssessment', {
//                               me,
//                             });
//                           }}
//                           underlayColor="rgba(0,0,0,0.01)">
//                           <Image
//                             style={styles.headerImageIcon1}
//                             source={require('../../assets/brain.png')}
//                           />
//                         </TouchableOpacity>
//                       }
//                     />
//                     <View
//                       style={{
//                         flex: 1,
//                         paddingHorizontal: 20,
//                         paddingVertical: 5,
//                       }}>
//                       <View style={{flex: 1.5, justifyContent: 'space-evenly'}}>
//                         <Text
//                           style={[
//                             styles.bodyText,
//                             {marginTop: 30, marginBottom: 5},
//                           ]}>
//                           I&apos;m Aegle
//                         </Text>
//                         <Text style={styles.bodyText}>How can i help you?</Text>
//                         <Button
//                           type="solid"
//                           title="Click here to start symptom assessment"
//                           buttonStyle={styles.symptomButtonStyle}
//                           titleStyle={styles.symptomButtonTitleStyle}
//                           onPress={() =>
//                             this.props.navigation.navigate('Question2', {
//                               questions: [
//                                 {
//                                   id: 1,
//                                   question: `${me &&
//                                     me.profile
//                                       .firstName} who is the assessment for?`,
//                                   options: [
//                                     {
//                                       text: 'Myself',
//                                       value: 1,
//                                     },
//                                     {
//                                       text: 'Someone else',
//                                       value: 2,
//                                     },
//                                   ],
//                                 },
//                               ],
//                               nextPage: () =>
//                                 this.props.navigation.navigate(
//                                   'SymptomSearch',
//                                   {me},
//                                 ),
//                             })
//                           }
//                         />
//                       </View>

//                       <View style={{flex: 3}}>
//                         <Text style={styles.exploreText}>Explore</Text>
//                         <View style={styles.doctorCard}>
//                           <TouchableOpacity
//                             underlayColor="rgba(0, 0, 0, 0.01)"
//                             onPress={() => {
//                               this.props.navigation.navigate('TalkToDoctor');
//                               // this.props.navigation.navigate('VideoChat');
//                             }}>
//                             <View>
//                               <View style={styles.doctorHeader}>
//                                 <Text style={styles.doctorHeaderText}>
//                                   24/7 Doctor Service
//                                 </Text>
//                                 <Text style={styles.doctorSubText}>
//                                   Click here to see if we&apos;re in your area
//                                 </Text>
//                               </View>
//                               <View
//                                 style={{
//                                   justifyContent: 'center',
//                                   alignContent: 'center',
//                                   paddingVertical: 10,
//                                 }}>
//                                 <Image
//                                   style={styles.doctorImage}
//                                   source={require('../../assets/call-doctor.gif')}
//                                 />
//                               </View>
//                             </View>
//                           </TouchableOpacity>
//                         </View>
//                       </View>

//                       <View style={{flex: 1.5, justifyContent: 'flex-start'}}>
//                         <View style={styles.healthPicture}>
//                           <TouchableOpacity
//                             underlayColor="rgba(0, 0, 0, 0.01)"
//                             onPress={() => {
//                               this.props.navigation.navigate(
//                                 'MonitorHealthStart',
//                               );
//                             }}>
//                             <View style={styles.healthPictureInner}>
//                               <Text style={styles.healthPictureText}>
//                                 Tap here to get a picture of your current health
//                               </Text>
//                             </View>
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     </View>

//                     <Overlay
//                       isVisible={this.state.openChat}
//                       onBackdropPress={this.decline}>
//                       <View>
//                         <Aegle style={styles.logo} />
//                         <Text style={styles.title}>
//                           Dr. Chuks started your chat appointment scheduled for{' '}
//                           {this.state.time} today
//                         </Text>

//                         <View style={styles.buttonDiv}>
//                           <Mutation mutation={JoinChatMutation}>
//                             {joinChat => (
//                               <TouchableOpacity
//                                 onPress={() => {
//                                   joinChat({
//                                     variables: {
//                                       data: {
//                                         sessionId: this.state.sessionId,
//                                         patientId: this.state.id,
//                                       },
//                                     },
//                                   })
//                                     .then(res => {
//                                       if (res) {
//                                         const {
//                                           sessionId,
//                                           token,
//                                           identity,
//                                           appointmentId,
//                                         } = res.data.joinChat;
//                                         this.setState({
//                                           openChat: false,
//                                           token,
//                                           identity,
//                                           appointmentId,
//                                           sessionId,
//                                         });
//                                         this.openChat();
//                                       }
//                                     })
//                                     .catch(err => err);
//                                 }}>
//                                 <View style={styles.accept}>
//                                   <Text style={styles.button}>Accept</Text>
//                                 </View>
//                               </TouchableOpacity>
//                             )}
//                           </Mutation>

//                           <TouchableOpacity onPress={() => this.decline()}>
//                             <View style={styles.decline}>
//                               <Text style={styles.button}>Decline</Text>
//                             </View>
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     </Overlay>

//                     <Overlay
//                       isVisible={this.state.open}
//                       onBackdropPress={this.decline}>
//                       <View>
//                         <Aegle style={styles.logo} />
//                         <Text style={styles.title}>
//                           Dr. Chuks started your video call appointment
//                           scheduled for {this.state.time} today
//                         </Text>

//                         <View style={styles.buttonDiv}>
//                           <Mutation mutation={JOIN_VIDEO_CALL}>
//                             {joinVideoCall => (
//                               <TouchableOpacity
//                                 onPress={() => {
//                                   joinVideoCall({
//                                     variables: {
//                                       data: {
//                                         sessionId: this.state.sessionId,
//                                         patientId: this.state.id,
//                                         room: this.state.roomId,
//                                       },
//                                     },
//                                   })
//                                     .then(res => {
//                                       if (res) {
//                                         const {
//                                           room,
//                                           token,
//                                         } = res.data.joinVideoCall;
//                                         this.setState({
//                                           open: false,
//                                           token,
//                                           room,
//                                         });
//                                         this.openVideo();
//                                       }
//                                     })
//                                     .catch(err => err);
//                                 }}>
//                                 <View style={styles.accept}>
//                                   <Text style={styles.button}>Accept</Text>
//                                 </View>
//                               </TouchableOpacity>
//                             )}
//                           </Mutation>
//                           <TouchableOpacity onPress={() => this.decline()}>
//                             <View style={styles.decline}>
//                               <Text style={styles.button}>Decline</Text>
//                             </View>
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     </Overlay>
//                   </View>
//                 );
//               }}
//             </Query>
//           );
//         }}
//       </UserContext.Consumer>
//     );
//   }
// }

// export default withApollo(HomePage);
