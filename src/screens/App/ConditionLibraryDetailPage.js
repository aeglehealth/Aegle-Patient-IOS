/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  Share,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Accordion from '../../Components/Accordion';
import {NHS_SUBSCRIPTION_KEY} from 'react-native-dotenv';
import ActivityIndicatorPage from './ActivityIndicatorPage';
import Arrow from '../../assets/arrow.svg';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginStart: 15,
    marginEnd: 10,
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Muli-Regular',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 25,
    display: 'flex',
    alignItems: 'flex-end',
    color: '#000000',
    maxWidth: '80%',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
});

export default class ConditionLibraryDetailPage extends React.Component {
  static navigationOptions = {headerShown: false};

  state = {
    image: '',
    collapseIcon: 'chevron-down',
    illness: 'Headache',
    overview: '',
    url: '',
    risk: [],
    symptoms: '',
    diagnosis: [],
    treatment: [],
    prevention: [],
    queryResponse: [],
    isFetching: false,
  };

  componentDidMount() {
    this.setState({queryResponse: [], isFetching: true});
    var myHeaders = new Headers();
    myHeaders.append('subscription-key', NHS_SUBSCRIPTION_KEY);
    fetch(this.props.navigation.state.params.url, {
      headers: myHeaders,
    })
      .then(response => {
        return response.json();
      })
      .then(({mainEntityOfPage}) => {
        this.setState({queryResponse: mainEntityOfPage});
        mainEntityOfPage.map(data => {
          data.mainEntityOfPage.map(subData => {
            if (subData['@type'] == 'ImageObject') {
              this.setState({image: subData.url, isFetching: false});
            }
          });
        });
        this.setState({isFetching: false});
      })
      .catch(e => this.setState({isFetching: false}));
  }

  onShare = async url => {
    try {
      const result = await Share.share({
        message: url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    const regex = /(<([^>]+)>)/gi;

    const dimensions = Dimensions.get('window');
    // const imageHeight = Math.round(dimensions.width * 9 / 16);
    const imageWidth = dimensions.width - 20;
    const {navigation} = this.props;

    let url = this.props.navigation.state.params.url;
    const regex1 = /(api)(\.nhs\.uk\/conditions)/;
    if (url.match(regex1)) {
      url = url.replace(regex1, 'www' + '$2');
    }
    return (
      <>
        <View style={styles.header}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View style={{paddingRight: 5}}>
              <Arrow height={18} width={18} />
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.headerTitle}>
            {this.props.navigation.state.params.title}
          </Text>
          <Icon
            style={{paddingLeft: 5}}
            type="material-community"
            name="share-variant"
            color="#555555"
            onPress={() => {
              this.onShare(url);
            }}
          />
        </View>
        {this.state.isFetching ? (
          <ActivityIndicatorPage />
        ) : (
          <View style={styles.container}>
            <View>
              <FastImage
                source={
                  this.state.image
                    ? {uri: this.state.image}
                    : {
                        uri:
                          'https://aeglehealthcare.s3.us-east-2.amazonaws.com/public/WhatsApp+Image+2020-05-30+at+12.24.55+AM.jpeg',
                      }
                }
                style={
                  this.state.image
                    ? {width: '100%', height: (imageWidth * 2) / 3}
                    : {
                        width: '40%',
                        height: (imageWidth * 2) / 3.7,
                        alignSelf: 'center',
                      }
                }
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{paddingTop: 20, paddingBottom: 30, marginTop: 15}}>
              <>
                {this.state.queryResponse.map((pageElement, key) => {
                  if (pageElement.position == '0') {
                    return (
                      <Accordion
                        title={
                          pageElement.text == '' ? 'Overview' : pageElement.text
                        }
                        description={
                          pageElement.mainEntityOfPage[0]
                            ? pageElement.mainEntityOfPage[0].text
                              ? pageElement.mainEntityOfPage[0].text
                                  .replace(regex, '')
                                  .replace(pageElement.text, '')
                              : ''
                            : ''
                        }
                      />
                    );
                  } else if (pageElement.text != '') {
                    return (
                      <Accordion
                        title={pageElement.text}
                        description={
                          pageElement.mainEntityOfPage[0]
                            ? pageElement.mainEntityOfPage[0].text
                              ? pageElement.mainEntityOfPage[0].text
                                  .replace(regex, '')
                                  .replace(pageElement.text, '')
                              : ''
                            : ''
                        }
                      />
                    );
                  } else {
                    return null;
                  }
                })}
              </>
              <View style={{height: 50}} />
            </ScrollView>
          </View>
        )}
      </>
    );
  }
}
