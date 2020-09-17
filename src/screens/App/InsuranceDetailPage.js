/* eslint-disable no-console */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';

import CustomIconInput from '../../Components/CustomIconInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },
  headerText: {
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 15,
  },
  buttonStyle: {
    backgroundColor: '#1B2CC1',
    marginBottom: 20,
    paddingVertical: 15,
  },
  buttonTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'muli-regular',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class InsuranceDetailPage extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.headerText}>Insurance details</Text>
        </View>
        <View>
          <CustomIconInput
            label="Choose Company"
            isFloatingLabel={false}
            rightIcon="chevron-down"
          />
        </View>
        <View>
          <CustomIconInput label="Enter Membership Number" />
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <CustomIconInput label="First name" />
          </View>
          <View style={{flex: 1}}>
            <CustomIconInput label="Last name" />
          </View>
        </View>

        <View style={{marginTop: 40}}>
          <Button
            type="solid"
            title="SAVE"
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
          />
        </View>
      </View>
    );
  }
}
