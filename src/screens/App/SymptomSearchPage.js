/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Keyboard,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import shortid from 'shortid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {debounce} from 'throttle-debounce';
import {searchResult} from '../../Utils/symptomQuestions/SymptomQuestions';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {SYMPTOMS, PREDICT_URL, SERVER_KEY} from 'react-native-dotenv';
import Tts from 'react-native-tts';
import TtsToggleSwitch from '../../Components/TtsToggleSwitch';
import Context from '../../../Context/Context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  headerView: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  buttonStyle: {
    borderColor: '#1B2CC1',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonTitleStyle: {
    fontSize: 18,
    fontFamily: 'Muli-Regular',
  },
  MainContainer: {
    borderColor: 'gray',
    borderTopColor: 'gray',
    borderBottomColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignSelf: 'stretch',
  },
  searchInputContainer: {
    backgroundColor: '#fff',
  },
  searchInput: {
    fontFamily: 'Muli-Regular',
    fontSize: 16,
    color: '#000',
  },
  searchItem: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#1B2CC1',
  },
  searchItemDescription: {
    fontFamily: 'Muli',
    fontSize: 14,
    color: 'gray',
  },
  searchDiv: {
    padding: 10,
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
    borderBottomWidth: 1,
    width: '100%',
  },
});

export default class SymptomSearchPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerRight: <TtsToggleSwitch position={true} />,
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
      headerLeftContainerStyle: {
        justifyContent: 'center',
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      introText:
        'Now, tell me the symptom bothering you. Type in the box below to continue.',
      searchTerm: '',
      symptomsArr: [],
      queryMatches: [],
      title: '',
      profile: this.props.navigation.state.params.me,
    };
    this.check = debounce(1300, this.mapperItems);
  }

  mapperItems = query => {
    console.log(query);
    if (query) {
      let symptomsArr = this.state.symptomsArr;
      const queryMatches =
        symptomsArr.length > 0 &&
        symptomsArr.filter(
          el =>
            el.symptomsName.toLowerCase().indexOf(query.toLowerCase()) !== -1,
        );
      this.setState({queryMatches});
      console.log(queryMatches, 'matches');
    }
  };

  handleBackButton = () => {
    this.props.navigation.popToTop();
    return true;
  };

  componentDidMount() {
    this.context.display &&
      setTimeout(() => {
        Tts.setDefaultPitch(1.1);
        Tts.setDefaultRate(0.4);
        Tts.setDucking(true);
        Tts.speak(
          `Now, tell me the symptom bothering you. Type in the box below to continue`,
        );
      }, 1000);

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    fetch(PREDICT_URL, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Server-Key': SERVER_KEY,
      },
    })
      .then(res => res.json())
      .then(symptom => {
        console.log(symptom.data, 'symppppp');
        // let symptomsArr = symptom.data.map(sym => sym.symptomsName);
        this.setState({symptomsArr: symptom.data});
      });
  }

  componentWillUnmount = () => {
    Tts.stop();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  };

  handleChange = searchTerm => {
    this.setState({searchTerm}, () => this.check(this.state.searchTerm));
  };

  static contextType = Context;

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>{this.state.introText}</Text>
          <SearchBar
            containerStyle={styles.MainContainer}
            inputContainerStyle={styles.searchInputContainer}
            searchIcon={null}
            inputStyle={styles.searchInput}
            placeholder="e.g. cough"
            onChangeText={data => this.handleChange(data)}
            value={this.state.searchTerm}
            onFocus={() => this.setState({introText: 'Search for a symptom'})}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingTop: 15, paddingHorizontal: 10}}
          keyboardShouldPersistTaps="handled">
          {this.state.queryMatches.length > 0 && this.state.searchTerm ? (
            this.state.queryMatches.map(query => (
              <View key={shortid.generate()}>
                <TouchableOpacity
                  onPress={async () => {
                    Tts.stop();
                    Keyboard.dismiss();
                    //synchronize these terms if the user selects the suggested symptom
                    let searchTerm = this.state.searchTerm;
                    if (searchTerm !== query.symptomsName) {
                      this.setState({searchTerm: query.symptomsName});
                    }
                    const matcher = new RegExp(query.symptomsName, 'ig');

                    //filter and get a symptom that matches a user's search keyword
                    const questionsArr = searchResult.filter(item => {
                      //gets all symptoms that match the user's search keyword
                      const {title} = item;
                      if (matcher.test(title)) {
                        return item;
                      }
                    });
                    //questions within the symptoms array if the array exists
                    const {questions} =
                      questionsArr.length > 0 && questionsArr[0];

                    if (questionsArr.length > 0) {
                      //save individual symptoms to async storage
                      if (await AsyncStorage.getItem(SYMPTOMS)) {
                        let sym = await AsyncStorage.getItem(SYMPTOMS);
                        let symptomArr = JSON.parse(sym);
                        symptomArr.push(
                          this.state.searchTerm.charAt(0).toUpperCase() +
                            this.state.searchTerm.toLowerCase().substring(1),
                        );
                        await AsyncStorage.setItem(
                          SYMPTOMS,
                          JSON.stringify(symptomArr),
                        );
                      } else {
                        let symptomArr = [];
                        symptomArr.push(
                          //capitalize the first character of the symptom
                          this.state.searchTerm.charAt(0).toUpperCase() +
                            this.state.searchTerm.toLowerCase().substring(1),
                        );
                        await AsyncStorage.setItem(
                          SYMPTOMS,
                          JSON.stringify(symptomArr),
                        );
                      }
                      this.props.navigation.navigate({
                        routeName: 'Question',
                        key: `Questions-${shortid.generate()}`,
                        params: {
                          questionsArr,
                          questions,
                          profile: this.state.profile,
                        },
                      });

                      this.setState({searchTerm: '', queryMatches: []});
                    }
                  }}>
                  <View style={styles.searchDiv}>
                    <Text style={styles.searchItem}>{query.symptomsName}</Text>
                    <Text style={styles.searchItemDescription}>
                      {query.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>{''}</Text>
          )}
        </ScrollView>
      </View>
    );
  }
}
