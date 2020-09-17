import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import {HeaderLeft} from '../../Components/HeaderLeft';

export default class ChoosePassword extends React.Component {
  state = {
    loading: false,
    showPassword: true,
    password: '',
  };

  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {
        backgroundColor: '#fff',
        shadowColor: '#fff',
        elevation: 0,
        borderBottomColor: '#fff',
        shadowOpacity: 0,
      },
      headerLeft: <HeaderLeft navigation={navigation} />,
    };
  };

  render() {
    const item = this.props.navigation.state.params;
    const validationSchema = yup.object().shape({
      password: yup.string().required(),
    });
    return (
      <Formik
        initialValues={{
          password: '',
        }}
        onSubmit={values => {
          this.props.navigation.navigate('Phone', {
            item: item,
            password: values.password,
          });
        }}
        validationSchema={validationSchema}>
        {({
          values,
          handleChange,
          errors,
          setFieldValue,
          setFieldTouched,
          touched,
          isValid,
          handleBlur,
          handleSubmit,
        }) => (
          <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps={'handled'}>
              <View style={styles.container}>
                <View>
                  <View style={{marginRight: 60, width: 295}}>
                    <Text style={styles.head}>Choose a password</Text>
                    <Text style={styles.subText}>
                      Use atleast 8 characters, including a number, an uppercase
                      and a lowercase number
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 57,
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#B4B4B4',
                        alignItems: 'center',
                      }}>
                      {values.password ? (
                        <FontAwesome name="lock" color="#A7A6A6" size={20} />
                      ) : (
                        <AntDesign name="lock" color="#A7A6A6" size={20} />
                      )}
                      <TextInput
                        style={styles.input}
                        placeholderTextColor="#B4B4B4"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        placeholder="Password"
                        name="password"
                        autoCapitalize="none"
                        secureTextEntry
                      />
                    </View>
                    {touched.password && errors.password && (
                      <Text style={{fontSize: 10, color: 'red'}}>
                        {errors.password}
                      </Text>
                    )}
                    <View style={styles.circle}>
                      <View style={styles.circle2}></View>
                      <View style={styles.circle2}></View>
                      <View style={styles.circle1}></View>
                      <View style={styles.circle2}></View>
                    </View>
                    <View>
                      <TouchableOpacity onPress={handleSubmit}>
                        <View style={styles.signupbox}>
                          <Text style={styles.signuptext}>NEXT</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Formik>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '85%',
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  passwordMenu: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: 'white',
    alignItems: 'center',
    marginTop: 35,
  },
  input: {
    width: '50%',
    color: 'rgba(0, 0, 0, 0.7)',
    fontFamily: 'Muli-Regular',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
    fontStyle: 'normal',
    marginLeft: 14,
  },
  head: {
    color: '#1D1C1C',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 8,
  },
  subText: {
    color: 'yellow',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Muli-Regular' : 'Proxima Nova',
    lineHeight: 12,
    color: '#828282',
  },
  signupbox: {
    backgroundColor: '#1B2CC1',
    height: 48,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 56.9,
    marginBottom: 39,
  },
  signuptext: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Muli-Regular' : 'Proxima Nova',
    alignSelf: 'center',
  },
  alreadyhaveanaccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  opacity: {
    textAlign: 'center',
    color: 'yellow',
    fontSize: 14,
  },
  circle: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 91,
  },
  circle1: {
    flexDirection: 'row',
    backgroundColor: '#1B2CC1',
    borderRadius: 100,
    width: 9.9,
    height: 9.9,
    borderColor: '#1B2CC1',
    margin: 6,
  },
  circle2: {
    flexDirection: 'row',
    borderRadius: 100,
    width: 9.9,
    height: 9.9,
    borderWidth: 1,
    borderColor: '#1B2CC1',
    margin: 6,
  },
});
