/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import shortid from 'shortid';
import CardIconViewSelect from '../../Components/CardIconViewSelect';
import {HeaderLeft} from '../../Components/HeaderLeft';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 5,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class ConsultantTypePage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      users: [
        {
          id: 1,
          name: 'Doctor',
          description:
            'Uses medicine to treat illness and injuries to improve a patient’s health',
          icon: require('../../assets/consultant-type-doctor.png'),
        },
        {
          id: 2,
          name: 'Therapist',
          description:
            'Individuals who work with patients to clarify their feelings, mediate tense situations and provide guidance for life’s decisions.',
          icon: require('../../assets/consultant-type-therapist.png'),
        },
        {
          id: 3,
          name: 'Specialist',
          description:
            'Focused on a defined group of patient, diseases, skills or philosophy e.g children, cancer',
          icon: require('../../assets/consultant-type-specialist.png'),
        },
      ],
    };
  }

  render() {
    const users = this.state.users.map(d => {
      console.log(d);
      return (
        <CardIconViewSelect
          key={shortid.generate()}
          headText={d.name}
          subText={d.description}
          // icon={d.icon}
          image={d.icon}
          selected={this.state.selected === d.id}
          onPress={() => {
            this.setState({selected: d.id});
            // this.props.navigation.goBack();
            this.props.navigation.state.params.onChangeMedic(d.name);
            this.props.navigation.goBack();
          }}
        />
      );
    });

    return (
      <View style={styles.container}>
        <ScrollView
          style={{marginHorizontal: 5}}
          showsVerticalScrollIndicator={false}>
          <View style={{paddingHorizontal: 10}}>
            <Text style={styles.headerText}>Consultant type</Text>
          </View>
          <View style={{paddingHorizontal: 10}}>{users}</View>
        </ScrollView>
      </View>
    );
  }
}
