import React from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {Badge} from 'react-native-elements';
import {UNREAD_NOTIFICATION_COUNT} from '../QueryAndMutation';
import {Query} from 'react-apollo';

class IconWithBadge extends React.Component {
  render() {
    return (
      <Query query={UNREAD_NOTIFICATION_COUNT} fetchPolicy="network-and-cache">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicator />;
          if (error) return <Text>{error}</Text>;
          const badgeCount = data.unreadNotificationCount;
          return (
            <>
              {badgeCount ? (
                <Badge
                  value={badgeCount}
                  status="error"
                  containerStyle={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                  }}
                />
              ) : (
                <View />
              )}
            </>
          );
        }}
      </Query>
    );
  }
}

export default IconWithBadge;

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    margin: 5,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
