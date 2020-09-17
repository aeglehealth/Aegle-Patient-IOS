/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import shortid from 'shortid';
import {FloatingAction} from 'react-native-floating-action';
import {Icon} from 'react-native-elements';
import ListScrollView from '../../Components/ListScrollView';
import CommonListItem from '../../Components/CommonListItem';
import {HeaderLeft} from '../../Components/HeaderLeft';
import {GET_ALL_ASSESSMENTS} from '../../QueryAndMutation';
import {withApollo} from 'react-apollo';
import {date4} from '../../Utils/dateFormater';
import ActivityIndicatorPage from '../App/ActivityIndicatorPage';

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
  imageIcon: {
    maxHeight: 30,
    maxWidth: 30,
    alignSelf: 'center',
  },
  careCard: {
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    ...elevationShadowStyle(2),
    shadowColor: 'rgba(196, 196, 196, 0.7)',
  },
  cardImageContainer: {
    justifyContent: 'center',
    backgroundColor: '#03CCAA',
    width: 60,
    height: 60,
    borderRadius: 40,
    alignItems: 'center',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
});

class MyAssessmentsPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: styles.headerStyle,
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  nextPage = me => {
    this.props.navigation.navigate('Question2', {
      questions: [
        {
          id: 1,
          question: `${me && me.profile.firstName} who is the assessment for?`,
          options: [
            {
              text: 'Myself',
              value: 1,
            },
            {
              text: 'Someone else',
              value: 2,
            },
          ],
        },
      ],
      nextPage: () => this.props.navigation.navigate('SymptomSearch', {me}),
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      listOptions: [],
      loading: true,
    };
  }

  async UNSAFE_componentWillMount() {
    const {id, profile} = this.props.navigation.state.params.data.me;

    const age = profile.age ? `, ${profile.age}` : '';

    const data = await this.props.client.query({
      query: GET_ALL_ASSESSMENTS,
      variables: {data: id},
      fetchPolicy: 'no-cache',
    });

    let listOptions;

    if (data) {
      listOptions = data.data.getPatientAssesmentsByPerson.map(sym => {
        return (
          sym.PatientAssesmentSymptomsList.filter(
            w => w.SymptomType === 'PRESENT_SYMPTOMS',
          ).map(s => s.Name).length > 0 && {
            id: sym.Id,
            name: `${profile.firstName}${age}`,
            date: date4(sym.DateCreated),
            mainTitle: sym.PatientAssesmentSymptomsList.filter(
              w => w.SymptomType === 'PRESENT_SYMPTOMS',
            ).map(s => s.Name),
            title:
              sym.PatientAssesmentSymptomsList.filter(
                w => w.SymptomType === 'PRESENT_SYMPTOMS',
              ).map(s => s.Name).length > 1
                ? `${
                    sym.PatientAssesmentSymptomsList.filter(
                      w => w.SymptomType === 'PRESENT_SYMPTOMS',
                    ).map(s => s.Name)[0]
                  }, ...`
                : sym.PatientAssesmentSymptomsList.filter(
                    w => w.SymptomType === 'PRESENT_SYMPTOMS',
                  )
                    .map(s => s.Name)
                    .toString(),
            absentSymptoms: sym.PatientAssesmentSymptomsList.filter(
              w => w.SymptomType === 'ABSENT_SYMPTOMS',
            ).map(s => s.Name),
            causes:
              sym &&
              sym.PatientAssesmentCausesList &&
              typeof sym.PatientAssesmentCausesList !== 'undefined' &&
              sym.PatientAssesmentCausesList.length > 0
                ? sym.PatientAssesmentCausesList.map(w => w.Name)
                : [],
          }
        );
      });
    }
    this.setState({listOptions, loading: false});
  }

  render() {
    const {me} = this.props.navigation.state.params.data;
    const cards = this.state.listOptions.map(d => {
      return (
        <CommonListItem
          key={shortid.generate()}
          title={d.title}
          firstDesc={d.name}
          secondDesc={d.date}
          onPress={() =>
            this.props.navigation.navigate('AssessmentReportage', {
              id: d.id,
              me,
              causes: d.causes,
              symptomArr: d.mainTitle,
              absentSymptoms: d.absentSymptoms,
            })
          }
          staticImage={true}
          imageContainerStyle={styles.cardImageContainer}
          imageIconStyle={styles.imageIcon}
          cardStyle={styles.careCard}
        />
      );
    });

    return (
      <>
        {this.state.loading ? (
          <ActivityIndicatorPage />
        ) : (
          <View style={{flex: 1}}>
            <ListScrollView
              emptyIcon={require('../../assets/empty-prescription.png')}
              emptyMessage="You do not have any assessments"
              title="My Assessments"
              listItems={cards}
            />
            <FloatingAction
              color="#1B2CC1"
              onPressItem={() => this.nextPage(me)}
              distanceToEdge={20}
              overrideWithAction
              actions={[
                {
                  text: 'Next',
                  name: 'bt_next',
                  icon: (
                    <Icon type="material-community" name="plus" color="#fff" />
                  ),
                  position: 1,
                },
              ]}
              floatingIcon={
                <Icon type="material-community" name="plus" color="#fff" />
              }
            />
          </View>
        )}
      </>
    );
  }
}

export default withApollo(MyAssessmentsPage);
