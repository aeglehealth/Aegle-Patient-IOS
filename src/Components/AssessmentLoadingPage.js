import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

class ActivityIndicatorPage extends React.Component {
  static navigationOptions = {headerShown: false};

  state = {
    position: this.props.navigation.state.params.position,
  };

  componentDidMount() {
    const {position} = this.state;
    this.timeoutHandle = setTimeout(() => {
      position === 0
        ? this.props.navigation.navigate('MonitorHealthReport', {position: 0})
        : position === 1
        ? this.props.navigation.navigate('MonitorHealthReport', {position: 1})
        : position === 2
        ? this.props.navigation.navigate('MonitorHealthReport', {position: 2})
        : position === 3
        ? this.props.navigation.navigate('MonitorHealthReport', {position: 3})
        : this.props.navigation.navigate('MonitorHealthReport', {position: 4});
    }, 3500);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutHandle);
  }

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
