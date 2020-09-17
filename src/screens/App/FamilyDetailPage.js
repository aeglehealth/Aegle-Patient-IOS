/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import DialogModal from '../../Components/DialogModal';
import {age} from '../../Utils/calculateAge';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
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
  itemView: {
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
    borderBottomWidth: 1,
    paddingVertical: 15,
    marginVertical: 5,
  },
  labelText: {
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    color: '#000',
    marginVertical: 2,
  },
  valueText: {
    fontFamily: 'Muli-Bold',
    fontSize: 16,
    color: '#B4B4B4',
    marginVertical: 2,
  },
  buttonStyle: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginBottom: 15,
    borderColor: '#1B2CC1',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonTitleStyle: {
    color: '#1B2CC1',
    fontSize: 18,
    fontFamily: 'Muli-Bold',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 32,
    marginBottom: 10,
  },
});

export default class FamilyDetailPage extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      dialogModal: false,
      user: {
        name: '',
        gender: '',
        dob: '',
      },
      membership: 'Monthly subscription',
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const user = navigation.getParam('user', null);

    if (user == null) {
      this.setState({
        user: {
          name: '',
          gender: '',
          dob: '',
        },
      });
    } else {
      this.setState({
        user,
      });
    }
  }

  closeModal = () => {
    this.setState({
      dialogModal: false,
    });
  };

  openModal = () => {
    this.setState({
      dialogModal: true,
    });
  };

  render() {
    const {user} = this.state;
    const {firstName, lastName, dateOfBirth, gender, id, photo} = user;
    const fullName = `${firstName} ${lastName}`;

    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginHorizontal: 20}}>
          <View>
            <Text style={styles.headerText}>Family</Text>
          </View>
          <TouchableOpacity
            style={styles.profileImageView}
            // onPress={() =>
            //   this.props.navigation.navigate('FamilyMemberUpdate', {
            //     user,
            //   })
            // }
          >
            {photo && photo.original ? (
              <FastImage
                style={{width: 65, height: 65, borderRadius: 150}}
                source={{
                  uri: photo.thumbnail,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <Image
                source={require('../../assets/user-default.png')}
                style={{height: 80, width: 80}}
              />
            )}

            {/* <Text style={styles.smallText}>Tap to change picture</Text> */}
          </TouchableOpacity>
          <View style={styles.itemView}>
            <Text style={styles.labelText}>Full name</Text>
            <Text style={styles.valueText}>{fullName}</Text>
          </View>
          <View style={styles.itemView}>
            <Text style={styles.labelText}>Gender</Text>
            <Text style={styles.valueText}>{gender}</Text>
          </View>
          <View style={styles.itemView}>
            <Text style={styles.labelText}>Date of birth</Text>
            <Text style={styles.valueText}>{age(dateOfBirth)}</Text>
          </View>
          <View style={styles.itemView}>
            <Text style={styles.labelText}>Membership</Text>
            <Text style={styles.valueText}></Text>
          </View>
          <View style={{marginBottom: 40}}>
            <Button
              type="outline"
              title="REMOVE"
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={this.openModal}
            />
          </View>
        </ScrollView>
        <DialogModal
          id={id}
          removeFamily
          isVisible={this.state.dialogModal}
          onBackdropPress={this.closeModal}
          question="Are you sure you want to remove this member?"
          title="Remove Family Member"
          NoFunction={this.closeModal}
          YesFunction={() => {}}
        />
      </View>
    );
  }
}
