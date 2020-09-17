/* eslint-disable react/prop-types */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  inputView: {
    paddingTop: 5,
    marginVertical: 10,
    borderBottomColor: '#B4B4B4',
    borderBottomWidth: 1,
  },
  sectionHeaderText: {
    color: '#0066F5',
    fontFamily: 'Muli-Bold',
    fontSize: 14,
    marginBottom: 15,
  },
  labelText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
    marginBottom: 1,
  },
  valueText: {
    color: '#B4B4B4',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#B4B4B4',
    borderBottomWidth: 1,
  },
});

export default class EditProfileSecurityPage extends React.Component {
  state = {
    user: {
      email: '',
      password: '',
    },
    errorMessage: '',
    hidePassword: true,
    hidePasswordIcon: 'eye',
  };

  render() {
    const {user} = this.props.screenProps;
    const {navigation} = this.props.screenProps;
    console.log(this.props.screenProps);
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.inputView}>
            <Text style={styles.sectionHeaderText}>Verified Information</Text>
            <Text style={styles.labelText}>Email Address</Text>
            <Text style={styles.valueText}>{user.local.email}</Text>
          </View>
          <View style={styles.inputView}>
            <Text style={styles.labelText}>Phone Number</Text>
            <Text style={styles.valueText}>{user.profile.phoneNumber}</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={styles.sectionHeaderText}>Password</Text>
            <TouchableOpacity
              underlayColor="rgba(0,0,0,0.02)"
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}>
              <View style={styles.optionItem}>
                <Text style={styles.labelText}>Change Password</Text>
                <Icon
                  type="material-community"
                  name="chevron-right"
                  color="#A6A4A4"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
