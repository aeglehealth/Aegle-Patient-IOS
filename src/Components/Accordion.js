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
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerListStyle: {
    width: '80%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
  },
  headerListText: {
    color: '#1B2CC1',
    fontFamily: 'Muli-Bold',
    fontSize: 16,
  },
  textStyle: {
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
  collapseListStyle: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 0,
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
    const {collapseIcon} = this.state;
    const {list, title, description} = this.props;
    const {
      textStyle,
      headerText,
      headerStyle,
      collapseStyle,
      headerListText,
      headerListStyle,
      collapseListStyle,
    } = styles;
    return (
      <Collapse
        onToggle={isCollapsed => {
          this.setState({
            collapseIcon: isCollapsed ? 'chevron-up' : 'chevron-down',
          });
        }}
        style={list ? collapseListStyle : collapseStyle}>
        <CollapseHeader>
          <View style={list ? headerListStyle : headerStyle}>
            <Text style={list ? headerListText : headerText}>
              {list && collapseIcon == 'chevron-up' ? 'Collapse' : title}
            </Text>
            <Icon
              type="material-community"
              name={collapseIcon}
              color={list ? '#1B2CC1' : '#DADADA'}
            />
          </View>
        </CollapseHeader>
        <CollapseBody>
          {list ? description : <Text style={textStyle}>{description}</Text>}
        </CollapseBody>
      </Collapse>
    );
  }
}
