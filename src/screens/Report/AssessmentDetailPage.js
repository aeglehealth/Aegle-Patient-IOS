/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {Card} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
// import Pie from 'react-native-pie';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.8,
    shadowRadius: 0.8 * elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingEnd: 10,
    justifyContent: 'flex-start',
  },
  cardHeaderText: {
    color: '#555',
    fontFamily: 'Muli-Bold',
    fontSize: 18,
  },
  cardBodyText: {
    fontSize: 15,
    fontFamily: 'Muli-Regular',
    color: '#000',
    marginVertical: 10,
  },
  cardFooterText: {
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    color: '#0066F5',
  },
  cardContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginBottom: 10,
    borderColor: '#fff',
    ...elevationShadowStyle(2),
    shadowColor: 'rgba(196, 196, 196, 0.7)',
  },
  cardHeaderView: {
    justifyContent: 'center',
    borderBottomColor: '#eee',
    paddingVertical: 10,
    borderBottomWidth: 2,
    marginBottom: 5,
  },
  cardFooterView: {
    justifyContent: 'center',
    borderTopColor: '#eee',
    paddingVertical: 10,
    borderTopWidth: 2,
    marginTop: 5,
  },
  pieText: {
    backgroundColor: 'transparent',
    fontFamily: 'Muli-Regular',
    color: '#506883',
    fontSize: 14,
    width: 55,
    zIndex: 2,
    position: 'absolute',
    textAlign: 'center',
  },
});

export default class AssessmentDetailPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};

    return {
      headerStyle: {
        backgroundColor: '#fff',
        ...elevationShadowStyle(2),
        borderBottomColor: '#fff',
      },
      headerLayoutPreset: 'center',
      headerTitleStyle: {
        fontFamily: 'Muli-ExtraBold',
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
      },
      headerRight: <View />,
      title: params.title,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
    };
  }

  UNSAFE_componentWillMount() {
    const {navigation} = this.props;
    const assessment = navigation.getParam('assessment', {title: ''});
    this.setState({title: assessment.title});
    this.props.navigation.setParams({
      title: assessment.title,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginBottom: 50}}>
            <Card
              containerStyle={styles.cardContainer}
              title={
                <View style={styles.cardHeaderView}>
                  <Text style={styles.cardHeaderText}>Description</Text>
                </View>
              }>
              <View>
                <Text style={styles.cardBodyText}>
                  The common cold is a viral infection of the nose and throat.
                  It usually leads to symptoms such as runny nose and cough. The
                  viruses responsible are spread by droplets which are released
                  into the air....
                </Text>
              </View>
              <TouchableHighlight
                underlayColor="rgba(0, 0, 0, 0.03)"
                onPress={() => {
                  this.props.navigation.navigate(
                    `${this.props.navigation.state.routeName}More`,
                  );
                }}>
                <View style={styles.cardFooterView}>
                  <Text style={styles.cardFooterText}>Continue reading</Text>
                </View>
              </TouchableHighlight>
            </Card>

            <Card
              containerStyle={styles.cardContainer}
              title={
                <View style={styles.cardHeaderView}>
                  <Text style={styles.cardHeaderText}>Steps to take</Text>
                </View>
              }>
              <View>
                <Text style={styles.cardBodyText}>
                  If you think you have this condition, you can probably manage
                  your symptoms safely at home. You could also seek advice from
                  a pharmacist. However, if you are worried, if your symptoms
                  persist or get worse, or if you notice new symptoms, you
                  should seek advice from a medical professional.
                </Text>
                <Text />
              </View>
            </Card>

            <Card
              containerStyle={styles.cardContainer}
              title={
                <View style={styles.cardHeaderView}>
                  <Text style={styles.cardHeaderText}>Possibility</Text>
                </View>
              }>
              <View>
                <Text style={styles.cardBodyText}>
                  3 out of 100 people with these symptoms had this condition.
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    marginVertical: 20,
                    justifyContent: 'center',
                  }}>
                  <Pie
                    radius={100}
                    innerRadius={45}
                    series={[97, 3]}
                    colors={['#1B2CC1', '#0066F5']}
                  />
                  <Text style={styles.pieText}>3 out of 100 people.</Text>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }
}
