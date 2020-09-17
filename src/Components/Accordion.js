/* eslint-disable react/prop-types */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'rgba(196, 196, 196, 0.9)',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 1.1,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  headerText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
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
    marginBottom: 0,
    borderRadius: 5,
    borderColor: 'rgba(196, 196, 196, 0.3)',
    borderWidth: 0.5,
    ...elevationShadowStyle(1),
  },
});

export default class Accordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseIcon: 'chevron-down',
    };
  }

  render() {
    return (
      <Collapse
        onToggle={isCollapsed => {
          this.setState({
            collapseIcon: isCollapsed ? 'chevron-up' : 'chevron-down',
          });
        }}
        style={styles.collapseStyle}>
        <CollapseHeader>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.headerText}>{this.props.title}</Text>
            <Icon
              type="material-community"
              name={this.state.collapseIcon}
              color="#DADADA"
            />
          </View>
        </CollapseHeader>
        <CollapseBody>
          <Text style={styles.symptomBody}>{this.props.description}</Text>
        </CollapseBody>
      </Collapse>
    );
  }
}
