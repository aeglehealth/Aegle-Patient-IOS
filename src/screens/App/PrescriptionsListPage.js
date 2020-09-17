/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight} from 'react-native';
import shortid from 'shortid';
import ListScrollView from '../../Components/ListScrollView';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {UserContext} from '../../store/context/UserContext';
import {Query} from 'react-apollo';
import {GET_ALL_PATIENT_PRESCRIPTIONS} from '../../QueryAndMutation';
import ActivityIndicatorPage from '../../screens/App/ActivityIndicatorPage';
import EmptyContent from '../../Components/EmptyContent';
import {date2} from '../../Utils/dateFormater';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  cardBodyText: {
    color: '#555555',
    fontFamily: 'Muli-Bold',
    fontSize: 14,
  },
  cardTimeText: {
    color: 'rgba(85, 85, 85, 0.8)',
    fontFamily: 'muli-regular',
    fontSize: 12,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 18,
    marginBottom: 1,
  },
  imageIcon: {
    maxHeight: 30,
    maxWidth: 30,
    alignSelf: 'center',
  },
  careCard: {
    ...elevationShadowStyle(5),
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: 'rgba(196, 196, 196, 0.8)',
  },
  careCardInner: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#03CCAA',
    width: 65,
    height: 65,
    borderRadius: 40,
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class PrescriptionListPage extends React.Component {
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
      listOptions: [
        {
          title: 'Emzor paracetamol',
          doctor: 'Dr. Ayo Ajayi',
          time: '07/07/2019 13:30am',
          onPress: this.onPressList,
        },
        {
          title: 'Gestid Suspension 200ml',
          doctor: 'Dr. Ayo Ajayi',
          time: '07/07/2019 13:30am',
          onPress: this.onPressList,
        },
      ],
    };
  }

  onPressList = prescriptionInfo => {
    this.props.navigation.navigate('PrescriptionDetail', {
      prescriptionInfo,
    });
  };

  render() {
    const cards = prescriptions =>
      prescriptions.map(d => {
        const {date, time} = d.appointment;
        const formatDate = date2(date);
        const {firstName, lastName} = d.appointment.approvedBy.profile;
        const doctorName = `${firstName} ${lastName}`;
        // console.log(d.id, 'iddd');
        const prescriptionInfo = JSON.stringify({
          title: d.title,
          description: d.description,
          doctorName,
          formatDate,
          time,
        });
        console.log(prescriptionInfo, 'LL');
        return (
          <View style={styles.careCard} key={shortid.generate()}>
            <TouchableHighlight
              underlayColor="rgba(0, 0, 0, 0.03)"
              onPress={() => this.onPressList(prescriptionInfo)}>
              <View style={styles.careCardInner}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <View style={styles.cardImageContainer}>
                    <Image
                      style={styles.imageIcon}
                      source={require('../../assets/drugs.png')}
                    />
                  </View>
                </View>

                <View style={styles.cardText}>
                  <View>
                    <Text style={styles.cardHeaderText}>{d.title}</Text>
                    <Text style={styles.cardBodyText}>By Dr. {doctorName}</Text>
                    <Text style={styles.cardTimeText}>
                      {`${formatDate}, ${time}`}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        );
      });

    return (
      <Query
        query={GET_ALL_PATIENT_PRESCRIPTIONS}
        variables={{userId: data.me.id}}
        fetchPolicy="cache-and-network">
        {({loading, error, data: prescriptionData}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return <EmptyContent text={`${error}`} />;
          const {getAllPatientPrescriptions} = prescriptionData;
          return (
            <ListScrollView
              emptyIcon={require('../../assets/empty-prescription.png')}
              emptyMessage="You do not have any prescribed drugs"
              title="My Prescriptions"
              listItems={cards(getAllPatientPrescriptions)}
            />
          );
        }}
      </Query>
    );
  }
}
