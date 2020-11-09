/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Header} from 'react-native-elements';
import shortid from 'shortid';
import {Query, withApollo} from 'react-apollo';
import ActivityIndicatorPage from '../../screens/App/ActivityIndicatorPage';
import {
  NOTIFICATION,
  MARK_NOTIFICATION_AS_READ,
  UNREAD_NOTIFICATION_COUNT,
} from '../../QueryAndMutation';
import moment from 'moment';
import {NavigationActions} from 'react-navigation';
import EmptyContent from '../../Components/EmptyContent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    width: '90%',
    alignSelf: 'center',
  },
  headerStyle: {
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
    paddingTop: 0,
    paddingBottom: 0,
    height:
      Platform.select({
        android: 56,
        default: 50,
      }) + 20,
    width: '100%',
  },
  headerLeftContainerStyle: {
    flex: 10,
    paddingTop: 20,
    width: '100%',
  },
  cardBodyText: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontFamily: 'muli-regular',
    fontSize: 14,
  },
  cardBodyText_read: {
    color: '#C4C4C4',
    fontFamily: 'muli-regular',
    fontSize: 14,
  },

  cardTimeText: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontFamily: 'muli-regular',
    fontSize: 12,
  },
  cardHeaderText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 18,
    marginBottom: 5,
  },
  cardHeaderText_read: {
    color: '#C4C4C4',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 18,
    marginBottom: 5,
  },
  imageIcon: {
    maxHeight: 30,
    maxWidth: 30,
    alignSelf: 'center',
  },
  careCard: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: 'rgba(196, 196, 196, 0.4)',
    borderBottomWidth: 2,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
    // backgroundColor: '#E1E3F6',
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#0066F5',
    width: 65,
    height: 65,
    borderRadius: 40,
  },
  cardText: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginVertical: 10,
  },
  headerText1: {
    fontFamily: 'Muli-Regular',
    textAlign: 'left',
    flex: 10,
    fontSize: 30,
    marginTop: 10,
    lineHeight: 38,
    fontWeight: 'bold',
    padding: 5,
    width: '100%',
  },
  emptyIcon: {
    alignSelf: 'center',
    maxWidth: 200,
    maxHeight: 200,
    marginTop: 20,
  },
});

class Notification extends React.PureComponent {
  state = {
    refresh: this.props.refresh,
  };
  render() {
    const {appointmentIcon, client, item, navigation} = this.props;
    return (
      <TouchableOpacity
        onPress={async () => {
          if (!item.isRead) {
            try {
              let res = await client.mutate({
                mutation: MARK_NOTIFICATION_AS_READ,
                variables: {
                  data: {ids: item.id},
                },
                awaitRefetchQueries: true,
                refetchQueries: [
                  {
                    query: NOTIFICATION,
                  },
                  {
                    query: UNREAD_NOTIFICATION_COUNT,
                  },
                ],
              });
            } catch (err) {
              console.log(err);
            }
          }

          (await item.type) == 'Referral' ||
          item.type == 'Report' ||
          item.type == 'Prescription'
            ? navigation.navigate(
                'DoctorNote',
                {
                  appointmentId: item.appointment.id,
                },
                NavigationActions.navigate({
                  routeName: item.type,
                }),
              )
            : item.type == 'Appointment'
            ? navigation.navigate('CompletedAction', {
                title: 'Oops!',
                subTitle: 'This appointment has been completed or expired',
                onCompleted: () => {
                  navigation.navigate('Notifications');
                },
              })
            : null;
        }}>
        <View style={styles.careCard} key={shortid.generate()}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <View style={styles.cardImageContainer}>
              <Image style={styles.imageIcon} source={appointmentIcon} />
            </View>
          </View>

          <View style={styles.cardText}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={
                    item.isRead
                      ? styles.cardHeaderText_read
                      : styles.cardHeaderText
                  }>
                  Appointment
                </Text>
                <Text style={styles.cardTimeText}>
                  {moment(item.createdAt).fromNow()}
                </Text>
              </View>

              <Text
                style={
                  item.isRead ? styles.cardBodyText_read : styles.cardBodyText
                }>
                {item.message}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

class NotificationPage extends React.Component {
  state = {
    appointmentIcon: require('../../assets/notification-appointment.png'),
    forumIcon: require('../../assets/notification-forum.png'),
    refresh: false,
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevState.refresh != this.state.refresh) {
      console.log('happenstance');
    }
  }

  render() {
    return (
      <Query query={NOTIFICATION} fetchPolicy="network-and-cache">
        {({loading, error, data}) => {
          if (loading) return <ActivityIndicatorPage />;
          if (error) return <Text>error occured!</Text>;
          return (
            <View style={styles.container}>
              <FlatList
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <Header
                    containerStyle={styles.headerStyle}
                    leftComponent={
                      <Text style={styles.headerText1}>Notification</Text>
                    }
                    leftContainerStyle={styles.headerLeftContainerStyle}
                  />
                }
                keyExtractor={() => shortid.generate()}
                data={data.getNotifications}
                renderItem={({item}) => {
                  return (
                    <Notification
                      item={item}
                      navigation={this.props.navigation}
                      client={this.props.client}
                      appointmentIcon={this.state.appointmentIcon}
                      refresh={this.state.refresh}
                    />
                  );
                }}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                  <EmptyContent text="You do not have any notifications yet" />
                }
              />
            </View>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(NotificationPage);
