/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import shortid from 'shortid';
import {Icon} from 'react-native-elements';
import {HeaderLeft} from '../../Components/HeaderLeft';

const styles = StyleSheet.create({
  imageIconSmall: {
    maxHeight: 30,
    maxWidth: 30,
    alignSelf: 'center',
  },
  cardImageContainerSmall: {
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  listInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
  },
  listTitle: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    marginTop: 5,
    marginLeft: 20,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

function Item({id, title, icon, onPress}) {
  return (
    <TouchableHighlight
      key={id}
      underlayColor="rgba(0, 0, 0, 0.03)"
      onPress={onPress}>
      <View style={styles.listInner}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <View style={styles.cardImageContainerSmall}>
            <Image style={styles.imageIconSmall} source={icon} />
          </View>
          <Text style={styles.listTitle}>{title}</Text>
        </View>
        <Icon type="material-community" name="chevron-right" color="#A6A4A4" />
      </View>
    </TouchableHighlight>
  );
}

export default class ClinicalRecordsPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
      title: 'Clinical Records',
      headerTitleStyle: {
        fontFamily: 'Muli-ExtraBold',
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
      },
      headerRightContainerStyle: {
        paddingRight: 10,
      },
      headerRight: <View />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      listOptions: [
        {
          title: 'Appointments',
          icon: require('../../assets/cr-appointments.png'),
          onPress: () => {
            this.props.navigation.navigate('Appointments');
          },
        },
        {
          title: 'Medical History',
          icon: require('../../assets/cr-medical-history.png'),
          onPress: () => {
            this.props.navigation.navigate('MedicalHistoryList');
          },
        },
        {
          title: 'Medications',
          icon: require('../../assets/cr-pills.png'),
          onPress: () => {
            this.props.navigation.navigate('MedicationList');
          },
        },
        {
          title: 'Allergies',
          icon: require('../../assets/cr-allergy.png'),
          onPress: () => {
            this.props.navigation.navigate('AllergyList');
          },
        },
        // {
        //   title: 'Chat History',
        //   icon: require('../../assets/cr-chat.png'),
        //   onPress: () => {
        //     this.props.navigation.navigate('ChatList');
        //   },
        // },
      ],
    };
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.state.listOptions}
          keyExtractor={() => shortid.generate()}
          style={{marginHorizontal: 10, marginTop: 20}}
          renderItem={({item}) => {
            return (
              <Item
                id={shortid.generate()}
                title={item.title}
                icon={item.icon}
                onPress={item.onPress}
              />
            );
          }}
        />
      </View>
    );
  }
}
