/* eslint-disable global-require */
import React, {createRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import {Query, withApollo} from 'react-apollo';
import {GET_REFFERAL} from '../../../QueryAndMutation';
import ActivityIndicatorPage from '../ActivityIndicatorPage';
import EmptyContent from '../../../Components/EmptyContent';
import {dateFormatter} from '../../../Utils/dateFormater';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {date6} from '../../../Utils/dateFormater';
import {Icon} from 'react-native-elements';
import Toast from '../../../Components/toster/Alert';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {ReferralPDF} from './ReferralPDF';
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

class DoctorReferralPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fileUrl: {},
    };
    this.shareRef = createRef();
  }

  async createPDF(description, doctorName, times, share) {
    !share && this.setState({loading: true});

    let options = {
      html: ReferralPDF(description, doctorName, times),
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
        subject: `Aegle Referral_${date6()}`,
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
      }/Aegle Referral_${date6()}.pdf`;
      try {
        const data = await RNFetchBlob.fs.writeFile(path, base64, 'base64');
        this.setState({loading: false});
        Alert.alert('Referral saved in the Download folder');
      } catch (error) {
        this.setState({loading: false});
        Alert.alert(error.message);
      }
    }
  }

  render() {
    const {appointmentId} = this.props.screenProps;

    return (
      <Query
        query={GET_REFFERAL}
        variables={{appointmentId}}
        fetchPolicy="cache-and-network">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) {
            console.log(error, String(error).split(':')[2]);
            return <EmptyContent text={`${String(error).split(':')[2]}`} />;
          }
          const {
            title,
            description,
            appointment: {
              date,
              time,
              approvedBy: {
                profile: {firstName, lastName},
              },
            },
          } = data.getReferral;
          const doctorName = `${firstName} ${lastName}`;
          const times = `${time}, ${dateFormatter(date)}`;
          return (
            <View style={styles.container}>
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
                    this.createPDF(description, doctorName, times, 'share')
                  }
                />
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{paddingHorizontal: 15}}>
                <View
                  style={{
                    backgroundColor: 'white',
                  }}>
                  {/*<Image
                      source={require('../../assets/logo-black.png')}
                      style={styles.headerImage}
                    />
                    <Text style={styles.headerTitle}>Referral</Text>
                  </View>
                  <Text style={styles.sectionHeader}>DOCTOR REFERRAL</Text> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: 15,
                      paddingHorizontal: 15,
                    }}>
                    <Image
                      source={require('../../../assets/logo-black.png')}
                      style={styles.headerImage}
                    />
                    <Text style={styles.headerTitle}>Aegle Referral Note</Text>
                  </View>
                  {/* <View style={styles.card}> */}
                  <Text style={styles.sectionHeader}>DOCTOR REFERRAL</Text>
                  <View style={styles.card}>
                    <View
                      style={[
                        styles.cardItem,
                        {
                          borderBottomColor: 'rgba(196, 196, 196, 0.5)',
                          borderBottomWidth: 1,
                        },
                      ]}>
                      <Text style={styles.itemLabel}>Notes</Text>
                      <Text style={styles.itemName}>{description}</Text>
                    </View>
                  </View>

                  <Text style={styles.sectionHeader}>DOCTOR DETAILS</Text>
                  <View style={styles.card}>
                    <View
                      style={[
                        styles.cardItem,
                        {
                          borderBottomColor: 'rgba(196, 196, 196, 0.5)',
                          borderBottomWidth: 1,
                        },
                      ]}>
                      <Text style={styles.itemLabel}>Doctor&apos;s name</Text>
                      <Text style={styles.itemName}>Dr {doctorName}</Text>
                    </View>
                    <View style={styles.cardItem}>
                      <Text style={styles.itemLabel}>Date &amp; Time</Text>
                      <Text style={styles.itemName}>{`${time}, ${dateFormatter(
                        date,
                      )}`}</Text>
                    </View>
                  </View>
                </View>
                <View style={{marginTop: 30}}>
                  <TouchableOpacity
                    style={styles.buttonSolidStyle}
                    onPress={() =>
                      this.createPDF(description, doctorName, times)
                    }>
                    {this.state.loading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.buttonSolidTitleStyle}>DOWNLOAD</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(DoctorReferralPage);
