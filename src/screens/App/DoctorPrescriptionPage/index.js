/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  Button,
} from 'react-native';
import {Query, withApollo} from 'react-apollo';
import {GET_PRESCRIPTIONS} from '../../../QueryAndMutation';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ActivityIndicatorPage from '../../../screens/App/ActivityIndicatorPage';
import EmptyContent from '../../../Components/EmptyContent';
import {dateFormatter} from '../../../Utils/dateFormater';
import {date6} from '../../../Utils/dateFormater';
import {Icon} from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import ShowMessage, {type} from '../../../Components/toster/ShowMessage';
import DisplayMedics from './DisplayMedics';
import Toast from '../../../Components/toster/Alert';
import logo from '../../../assets/logo-black.png';
import PrescriptionPDF from './PrescriptionPDF';
function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 1.1,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  headerTitle: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Muli-Regular',
    marginLeft: 10,
    lineHeight: 30,
    color: '#1B2CC1',
    fontWeight: 'bold',
  },
  headerImage: {
    height: 35,
    width: 35,
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    ...elevationShadowStyle(3),
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: 'rgba(196, 196, 196, 0.4)',
  },
  cardItem: {
    paddingVertical: 10,
  },
  itemLabel: {
    color: '#828282',
    fontSize: 12,
    fontFamily: 'Muli-Regular',
  },
  itemName: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Muli-Bold',
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Muli-Regular',
    marginVertical: 15,
    marginHorizontal: 10,
  },
  iconReminder: {
    height: 25,
    width: 25,
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Muli-Bold',
    alignSelf: 'center',
  },
});

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class DoctorPrescriptionPage extends React.Component {
  state = {
    fileUrl: {},
    loading: false,
    url: '',
    filePath: '',
    loading: false,
  };

  async createPDF(data, doctorName, times, share) {
    !share && this.setState({loading: true});

    let options = {
      html: PrescriptionPDF(data, doctorName, times),
      base64: true,
    };

    let file = await RNHTMLtoPDF.convert(options);
    const base64 = file.base64;
    const type = 'application/pdf';
    let base64Data = `data:${type};base64,` + base64;

    if (share) {
      Toast(`Processing...please wait`);
      await Share.open({
        url: base64Data,
        subject: `Aegle Prescription_${date6()}`,
      });
      return;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Aegle Storage permission',
        message: 'Aegle needs access to your Storage',
        buttonNeutral: 'Ask me later',
        buttonNegative: 'Cancel',
        buttonPositive: 'Ok',
      },
    );

    this.setState({loading: false});

    if (granted) {
      const path = `${
        RNFetchBlob.fs.dirs.DownloadDir
      }/Aegle Prescription_${date6()}.pdf`;
      try {
        const data = await RNFetchBlob.fs.writeFile(path, base64, 'base64');
        this.setState({loading: false});
        Alert.alert('Prescription saved in the Download folder');
      } catch (error) {
        this.setState({loading: false});
        Alert.alert(error.message);
      }
    }
  }

  render() {
    const {appointmentId, navigation} = this.props.screenProps;

    console.log(appointmentId, 'id');
    return (
      <Query
        query={GET_PRESCRIPTIONS}
        variables={{appointmentId}}
        fetchPolicy="cache-and-network">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error)
            return <EmptyContent text={`${String(error).split(':')[2]}`} />;
          console.log(data.getPrescriptions, 'prescriptioss');
          let doctorName = '';
          let times = '';
          if (data.getPrescriptions.length > 0) {
            const {
              appointment: {
                date,
                time,
                approvedBy: {
                  profile: {firstName, lastName},
                },
              },
            } = data.getPrescriptions && data.getPrescriptions[0];
            doctorName = `${firstName} ${lastName}` || '';
            times = `${time}, ${dateFormatter(date)}` || '';
          }
          return (
            <View style={styles.container}>
              {data.getPrescriptions.length != 0 ? (
                <View
                  style={{
                    marginTop: 15,
                    alignSelf: 'flex-end',
                    marginHorizontal: 20,
                  }}>
                  <Icon
                    type="material-community"
                    name="share-variant"
                    color="#555555"
                    onPress={() =>
                      this.createPDF(
                        data.getPrescriptions,
                        doctorName,
                        times,
                        'share',
                      )
                    }
                  />
                </View>
              ) : null}
              <ScrollView
                style={{paddingHorizontal: 15}}
                showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    backgroundColor: 'white',
                    marginTop: 10,
                  }}>
                  {data.getPrescriptions.length != 0 && (
                    <View
                      style={{
                        paddingHorizontal: 5,
                        flexDirection: 'row',
                        marginVertical: 5,
                      }}>
                      <Image
                        source={require('../../../assets/logo-black.png')}
                        style={styles.headerImage}
                      />
                      <Text style={styles.headerTitle}>
                        Aegle Prescription Note
                      </Text>
                    </View>
                  )}
                  <DisplayMedics
                    prescriptionData={data.getPrescriptions}
                    navigation={navigation}
                  />
                </View>
                {data.getPrescriptions.length != 0 ? (
                  <View style={{marginTop: 30}}>
                    <TouchableOpacity
                      style={styles.buttonSolidStyle}
                      onPress={() =>
                        this.createPDF(data.getPrescriptions, doctorName, times)
                      }>
                      {this.state.loading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.buttonSolidTitleStyle}>
                          DOWNLOAD
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(DoctorPrescriptionPage);
