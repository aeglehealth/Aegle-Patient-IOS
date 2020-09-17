import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

class ActivityIndicatorPage extends React.Component {
  static navigationOptions = {headerShown: false};

  render() {
    return (
      <View style={styles.main}>
        <ActivityIndicator size={this.props.size || 'large'} color="#1B2CC1" />
      </View>
    );
  }
}

export default ActivityIndicatorPage;

const styles = StyleSheet.create({
  main: {
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
