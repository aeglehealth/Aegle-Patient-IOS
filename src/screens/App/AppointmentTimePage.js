/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {Button} from 'react-native-elements';
import shortid from 'shortid';
import Arrow from '../../assets/arrow1.svg';
import {timeIntervals} from '../../Components/TimeInterval/Interval';
import {timeConversion, formatAMPM} from '../../Utils/dateFormater';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#1B2CC1',
  },

  headerStyle: {
    backgroundColor: '#1B2CC1',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#1B2CC1',
    shadowOpacity: 0,
  },
  card: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  calendarTextStyle: {
    color: '#fff',
    fontFamily: 'Muli-Regular',
  },
  cardHeader: {
    fontFamily: 'Muli',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: '#1B2CC1',
  },
  button: {
    borderColor: '#C4C4C4',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    // margin: 5,
  },
  buttonSolid: {
    borderColor: '#1B2CC1',
    backgroundColor: '#1B2CC1',
    borderRadius: 10,
    borderWidth: 1,
    // margin: 5,
    ...elevationShadowStyle(2),
  },
  buttonTitle: {
    fontFamily: 'Muli-Regular',
    fontSize: 15,
    color: '#000',
  },
  buttonSolidTitle: {
    fontFamily: 'Muli-Regular',
    fontSize: 15,
    color: '#fff',
  },
});

export default class AppointmentTimePage extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: styles.headerStyle,
      headerLeft: (
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <View style={{padding: 20}}>
            <Arrow height={18} width={18} />
          </View>
        </TouchableWithoutFeedback>
      ),
      headerTintColor: '#fff',
      headerRight: (
        <Button
          onPress={() => {
            navigation.goBack();
          }}
          title="DONE"
          buttonStyle={{backgroundColor: '#1B2CC1'}}
          titleStyle={{color: '#fff', fontSize: 14, fontFamily: 'Muli-Regular'}}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      selectedDate: null,
      selectedTime: null,
      timeOptions: [
        {
          title: 'Morning',
          rows: [],
        },
        {
          title: 'Noon',
          rows: [],
        },
        {
          title: 'Evening',
          rows: [],
        },
      ],
    };
  }

  calculateIntervals = date => {
    let now = new Date(date);

    const morning = timeIntervals(
      new Date(now.setHours(0, 0)),
      new Date(now.setHours(11, 59)),
      15,
    );

    const noon = timeIntervals(
      new Date(now.setHours(12, 0)),
      new Date(now.setHours(17, 45)),
      15,
    );

    const night = timeIntervals(
      new Date(now.setHours(18, 0)),
      new Date(now.setHours(23, 59)),
      15,
    );
    this.setState({
      timeOptions: [
        {
          title: 'Morning',
          rows: [...morning],
        },
        {
          title: 'Noon',
          rows: [...noon],
        },
        {
          title: 'Evening',
          rows: [...night],
        },
      ],
    });
  };

  componentDidMount() {
    this.calculateIntervals(Date.now());
  }

  onDateChange = date => {
    this.setState({
      selectedDate: date,
    });
    this.calculateIntervals(date);
    this.props.navigation.state.params.onChangeDate(date.toString());
    this.state.selectedTime && this.props.navigation.goBack();
  };

  render() {
    const time = new Date(new Date().getTime() + 30 * 60000);

    const timeCards = this.state.timeOptions.map(d => {
      const timeRows =
        d.rows.length > 0 &&
        d.rows.map(x => {
          const y = timeConversion(x) > timeConversion(formatAMPM(time)) && x;
          return (
            y && (
              <View
                key={shortid.generate()}
                style={{
                  marginTop: 10,
                }}>
                <View key={shortid.generate()}>
                  <Button
                    buttonStyle={
                      this.state.selectedTime === y
                        ? styles.buttonSolid
                        : styles.button
                    }
                    titleStyle={
                      this.state.selectedTime === y
                        ? styles.buttonSolidTitle
                        : styles.buttonTitle
                    }
                    type="outline"
                    title={y}
                    onPress={() => {
                      this.setState({selectedTime: y});
                      this.props.navigation.state.params.onChangeTime(y);
                      this.state.selectedDate && this.props.navigation.goBack();
                    }}
                  />
                </View>
              </View>
            )
          );
        });

      return (
        <>
          {timeRows.length > 0 && (
            <View style={styles.card} key={shortid.generate()}>
              <View>
                <Text style={styles.cardHeader}>{d.title}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'flex-start',
                  width: '100%',
                  flexWrap: 'wrap',
                }}>
                {timeRows}
              </View>
            </View>
          )}
        </>
      );
    });

    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginHorizontal: 15}}>
          <CalendarPicker
            textStyle={styles.calendarTextStyle}
            onDateChange={this.onDateChange}
            selectedDayStyle={{borderRadius: 5, backgroundColor: '#fff'}}
            selectedDayTextColor="#1B2CC1"
            minDate={new Date()}
          />
          <View />
          {timeCards}
        </ScrollView>
      </View>
    );
  }
}
