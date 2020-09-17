/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import shortid from 'shortid';
import ListScrollView from '../../Components/ListScrollView';
import CommonListItemNoImage from '../../Components/CommonListItemNoImage';
import {HeaderLeft} from '../../Components/HeaderLeft';

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

export default class ChatListPage extends React.Component {
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
      listOptions: [
        // {
        // 	title: "Malaria treatment",
        // 	description:
        // 		"Took 3 tablets of amatem and paracetamol for 3 days and you would feel better after taking it."
        // }
      ],
    };
  }

  render() {
    const cards = this.state.listOptions.map(d => {
      return (
        <CommonListItemNoImage
          key={shortid.generate()}
          title={d.title}
          description={d.description}
          onPress={() => {}}
        />
      );
    });

    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <ListScrollView
          emptyIcon={require('../../assets/empty-chat.png')}
          emptyMessage="No Chat history yet."
          title="Chats"
          listItems={cards}
        />
      </View>
    );
  }
}
