/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {Switch} from 'react-native-paper';
import {Button, Icon} from 'react-native-elements';
import {Query} from 'react-apollo';
import {GET_PRESCRIPTION} from '../../QueryAndMutation';
import ActivityIndicatorPage from '../../screens/App/ActivityIndicatorPage';
import EmptyContent from '../../Components/EmptyContent';
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
    fontSize: 30,
    fontFamily: 'Muli-Regular',
    marginLeft: 10,
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
  },
});

export default class PrescriptionDetailPage extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
    headerRightContainerStyle: {
      paddingRight: 10,
    },
    headerRight: (
      <Icon
        type="material-community"
        name="share-variant"
        color="#555555"
        onPress={() => {}}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      setReminder: true,
    };
  }

  render() {
    const {prescriptionInfo} = this.props.navigation.state.params;
    const details = JSON.parse(prescriptionInfo);

    const {title, description, doctorName, formatDate, time} = details;
    console.log(title, description, doctorName, formatDate, time, 'details');
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 15,
            paddingHorizontal: 15,
          }}>
          <Image
            source={require('../../assets/logo-black.png')}
            style={styles.headerImage}
          />
          <Text style={styles.headerTitle}>Prescription</Text>
        </View>
        <ScrollView
          style={{paddingHorizontal: 15}}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>MEDICINE DETAILS</Text>
          <View style={styles.card}>
            <View
              style={[
                styles.cardItem,
                {
                  borderBottomColor: 'rgba(196, 196, 196, 0.5)',
                  borderBottomWidth: 1,
                },
              ]}>
              <Text style={styles.itemLabel}>Medicine Name</Text>
              <Text style={styles.itemName}>{title}</Text>
            </View>
            <View
              style={[
                styles.cardItem,
                {
                  borderBottomColor: 'rgba(196, 196, 196, 0.5)',
                  borderBottomWidth: 1,
                },
              ]}>
              <Text style={styles.itemLabel}>Doses</Text>
              <Text style={styles.itemName}>2</Text>
            </View>
            <View style={styles.cardItem}>
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
              <Text style={styles.itemName}>{`${formatDate}, ${time}`}</Text>
            </View>
          </View>
          <View style={{marginBottom: 40}}>
            <Button
              type="solid"
              title="DOWNLOAD"
              buttonStyle={styles.buttonSolidStyle}
              titleStyle={styles.buttonSolidTitleStyle}
              onPress={() => {}}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
