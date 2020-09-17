/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import {Icon} from 'react-native-elements';
import shortid from 'shortid';
import DialogModal from '../../Components/DialogModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    marginHorizontal: 15,
  },
  bodyText: {
    color: '#555555',
    fontFamily: 'muli-regular',
    fontSize: 20,
    marginBottom: 30,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 30,
    marginBottom: 20,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  listInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
  },
  listTitle: {
    color: '#000',
    fontFamily: 'muli-bold',
    fontSize: 18,
    marginTop: 5,
  },
});

function Item({id, title, onPress}) {
  return (
    <TouchableHighlight
      key={id}
      underlayColor="rgba(0, 0, 0, 0.03)"
      onPress={onPress}>
      <View style={styles.listInner}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <Text style={styles.listTitle}>{title}</Text>
        </View>
        <Icon type="material-community" name="chevron-right" color="#A6A4A4" />
      </View>
    </TouchableHighlight>
  );
}

export default class ReportPostPage extends React.Component {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
  };

  closeReportModal = () => {
    this.setState({
      reportModal: false,
    });
  };

  openReportModal = () => {
    this.setState({
      reportModal: true,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      reportModal: false,
      listOptions: [
        {
          title: "I'm not interested in this post",
          onPress: this.openReportModal,
        },
        {
          title: 'It’s suspicious or spam',
          onPress: this.openReportModal,
        },
        {
          title: 'It’s abusive or harmful',
          onPress: this.openReportModal,
        },
      ],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <View style={{marginHorizontal: 5}}>
              <Text style={styles.headerText}>Report a post</Text>
              <Text style={styles.bodyText}>
                Help us understand the problem. What is wrong with this post?
              </Text>
            </View>
          }
          data={this.state.listOptions}
          keyExtractor={() => shortid.generate()}
          style={{marginHorizontal: 5}}
          renderItem={({item}) => {
            return (
              <Item
                id={shortid.generate()}
                title={item.title}
                onPress={item.onPress}
              />
            );
          }}
          ListFooterComponent={
            <DialogModal
              isVisible={this.state.reportModal}
              onBackdropPress={this.closeReportModal}
              question="Are you sure you want to report this post?"
              title="Report Post"
              NoFunction={this.closeReportModal}
              YesFunction={this.closeReportModal}
            />
          }
        />
      </View>
    );
  }
}
