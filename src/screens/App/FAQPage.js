/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import shortid from 'shortid';
import {HeaderLeft} from '../../Components/HeaderLeft';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  titleText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-Regular',
    fontSize: 32,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  symptomBody: {
    color: '#555',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    marginTop: 20,
    lineHeight: 20,
  },
  collapseStyle: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderBottomColor: 'rgba(196, 196, 196, 0.3)',
    borderBottomWidth: 1,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  searchContainer: {
    borderBottomColor: '#fff',
    ...elevationShadowStyle(4),
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  searchText: {
    fontFamily: 'Muli-Regular',
    fontSize: 16,
  },
});

function Accordion({title, description}) {
  const collapseIcon = {icon: 'chevron-right'};
  return (
    <Collapse
      onToggle={isCollapsed => {
        collapseIcon.icon = isCollapsed ? 'chevron-right' : 'chevron-down';
      }}
      style={styles.collapseStyle}>
      <CollapseHeader>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.titleText}>{title}</Text>
          <Icon
            type="material-community"
            name={collapseIcon.icon}
            color="#DADADA"
          />
        </View>
      </CollapseHeader>
      <CollapseBody>
        <Text style={styles.symptomBody}>{description}</Text>
      </CollapseBody>
    </Collapse>
  );
}

export default class FAQPage extends React.Component {
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
      questions: [
        {
          question: 'How Aegle works',
          description: 'Aegle works by doing this and that',
        },
        {
          question: 'What Aegle treat',
          description: 'Aegle works by doing this and that',
        },
        {
          question: 'Prescription',
          description: 'Aegle works by doing this and that',
        },
        {
          question: 'Accounts & Payment',
          description: 'Aegle works by doing this and that',
        },
        {
          question: 'Consultation',
          description: 'Aegle works by doing this and that',
        },
        {
          question: 'Features',
          description: 'Aegle works by doing this and that',
        },
        {
          question: 'Security',
          description: 'Aegle works by doing this and that',
        },
      ],
    };
  }

  render() {
    const accordions = this.state.questions.map(d => {
      return (
        <Accordion
          title={d.question}
          description={d.description}
          key={shortid.generate()}
        />
      );
    });
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>FAQs</Text>
        <Input
          placeholder="Search"
          inputContainerStyle={styles.searchContainer}
          inputStyle={styles.searchText}
          rightIcon={
            <Icon
              type="material-community"
              name="magnify"
              color="rgba(130, 130, 130, 0.5)"
            />
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingTop: 5,
            paddingBottom: 30,
            marginTop: 25,
            borderTopColor: 'rgba(196, 196, 196, 0.5)',
            borderTopWidth: 1,
          }}>
          {accordions}
          <View style={{height: 50}} />
        </ScrollView>
      </View>
    );
  }
}
