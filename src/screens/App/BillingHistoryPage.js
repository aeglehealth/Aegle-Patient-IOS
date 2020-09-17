/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import shortid from 'shortid';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  blueText: {
    color: '#0066F5',
    fontFamily: 'muli-regular',
    fontSize: 14,
    marginBottom: 30,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 15,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  billingListItem: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomColor: '#eeeeee55',
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  billingTitle: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
  },
  billingStatus: {
    fontFamily: 'muli-regular',
    fontSize: 14,
  },
  billingDate: {
    color: '#777',
    fontFamily: 'muli-regular',
    fontSize: 12,
  },
  billingAmount: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
  },
  billingDateHeader: {
    color: '#888',
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    fontFamily: 'Muli-Bold',
  },
});

const formatNumber = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export default class BillingHistoryPage extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      billingHistory: [
        {
          date: '31 Nov, 2019',
          data: [
            {
              time: '21:30',
              amount: 500,
              title: 'Basic Plan',
              status: 1,
            },
            {
              time: '11:30',
              amount: 3000,
              title: 'Monthly Plan',
              status: 0,
            },
          ],
        },
        {
          date: '21 Oct, 2019',
          data: [
            {
              time: '10:30',
              amount: 500,
              title: 'Basic Plan',
              status: 1,
            },
          ],
        },
        {
          date: '20 Sep, 2019',
          data: [
            {
              time: '15:35',
              amount: 3000,
              title: 'Basic Plan',
              status: 1,
            },
            {
              time: '11:30',
              amount: 3000,
              title: 'Monthly Plan',
              status: 0,
            },
            {
              time: '5:30',
              amount: 3000,
              title: 'Monthly Plan',
              status: 0,
            },
          ],
        },
      ],
    };
  }

  render() {
    const cards = this.state.billingHistory.map(d => {
      const list = d.data.map(e => {
        return (
          <View style={styles.billingListItem} key={shortid.generate()}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.billingTitle}>{e.title}</Text>
              <Text
                style={[
                  styles.billingStatus,
                  {color: e.status === 1 ? 'green' : 'red'},
                ]}>
                {e.status === 1 ? 'Successfull' : 'Failed'}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.billingDate}>
                {d.date}, {e.time}
              </Text>
              <Text style={styles.billingAmount}>
                {'\u20A6'} {formatNumber(e.amount)}
              </Text>
            </View>
          </View>
        );
      });

      return (
        <View key={shortid.generate()}>
          <Text style={styles.billingDateHeader}>{d.date}</Text>
          {list}
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: 15}}>
            <Text style={styles.headerText}>Billing History</Text>
            <Text style={styles.blueText}>Billing Overview</Text>
          </View>
          {cards}
        </ScrollView>
      </View>
    );
  }
}
