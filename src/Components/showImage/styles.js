import {StyleSheet} from 'react-native';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2CC1',
    color: '#fff',
    justifyContent: 'center',
  },
  iconImage: {
    height: 95,
    width: 95,
    alignSelf: 'center',
  },
  iconCircle: {
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20,
    height: 95,
    width: 95,
    ...elevationShadowStyle(3),
  },
  headText: {
    color: '#000',
    fontFamily: 'Muli-ExtraBold',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 24,
    marginBottom: 10,
  },
  mainBox: {
    backgroundColor: '#fff',
    flex: 5,
    // paddingHorizontal: 45,
    // paddingVertical: 25,
    borderRadius: 10,
  },
  bodyText: {
    color: '#828282',
    fontFamily: 'Muli-Regular',
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonStyle: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Muli-Bold',
  },
  backgroundImage: {
    paddingLeft: 25,
    paddingEnd: 25,
    flex: 1,
    justifyContent: 'center',
  },
  headerImageIcon: {
    // height: "100%",
    // width: "100%",
    flex: 1,
    // borderRadius: 80 / 2,
    // alignSelf: 'center',
    resizeMode: 'cover'
  },
});

