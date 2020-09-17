import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  bodyText: {
    color: '#555',
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    marginBottom: 30,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginVertical: 10,
  },
  emptyIcon: {
    alignSelf: 'center',
    maxWidth: 200,
    maxHeight: 200,
    marginTop: 20,
  },
});

export default class ListScrollView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView
        style={{paddingHorizontal: 15}}
        showsVerticalScrollIndicator={false}>
        {this.props.title ? (
          <View>
            <Text style={styles.headerText}>{this.props.title}</Text>
          </View>
        ) : null}
        <View
          style={{
            marginBottom: 50,
            justifyContent: 'flex-start',
          }}>
          {this.props.listItems.length ? (
            this.props.listItems
          ) : (
            <View>
              <Image style={styles.emptyIcon} source={this.props.emptyIcon} />
              <Text
                style={[
                  styles.bodyText,
                  {textAlign: 'center', marginHorizontal: 20},
                ]}>
                {this.props.emptyMessage}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

ListScrollView.propTypes = {
  emptyIcon: PropTypes.any.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  title: PropTypes.string,
  listItems: PropTypes.array.isRequired,
};

ListScrollView.defaultProps = {
  title: null,
};
