import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingLeft: 10,
    // paddingEnd: 10,
    justifyContent: 'flex-start',
    alignSelf: 'center',
    width: '99%',
  },
  bodyText: {
    color: '#000',
    fontFamily: 'Muli',
    fontSize: 16,
    marginTop: 15,
    // fontWeight: 'bold',
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#fff',
    shadowOpacity: 0,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Muli',
    fontSize: 30,
    marginBottom: 5,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonSolidStyle: {
    backgroundColor: '#1B2CC1',
    marginHorizontal: 60,
    marginBottom: 20,
    paddingVertical: 15,
    marginTop: 40,
    borderRadius: 5,
  },
  selectBtn: {
    backgroundColor: '#fff',
    marginHorizontal: 60,
    marginBottom: 20,
    paddingVertical: 15,
    marginTop: 40,
    borderRadius: 5,
    borderColor: '#1B2CC1',
    borderWidth: 1,
  },
  buttonSolidTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Muli',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  subAmountText: {
    color: '#1B2CC1',
    fontFamily: 'Muli',
    fontSize: 46,
    marginBottom: -2,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectText: {
    color: '#1B2CC1',
    fontSize: 20,
    fontFamily: 'Muli',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  smallHeaderSubText: {
    fontSize: 16,
    fontFamily: 'Muli-Regular',
    color: '#ccc',
    textAlign: 'center',
    marginLeft: 35,
  },
  smallSubText: {
    fontSize: 16,
    marginVertical: 5,
    fontFamily: 'Muli-Regular',
    color: '#000',
    textAlign: 'left',
    flex: 20,
  },
  cardContainer: {
    justifyContent: 'center',
    borderRadius: 6,
    marginHorizontal: 5,
    marginBottom: 20,
    padding: 0,
    alignSelf: 'center',
    width: '100%',
    ...elevationShadowStyle(2),
  },
  cardSubHeaderView: {
    justifyContent: 'center',
    // borderBottomColor: '#eee',
    // borderBottomWidth: 1,
    // paddingBottom: 20,
    // marginBottom: 20,
    padding: 10,
  },
  cardActiveSubHeaderView: {
    justifyContent: 'center',
    paddingBottom: 10,
    marginBottom: 5,
    padding: 10,
  },
  cardTitleName: {
    fontSize: 18,
    fontFamily: 'Muli',
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pointIcon: {
    // fontFamily: 'Muli',
    fontSize: 20,
    // color: '#1B2CC1',
    marginHorizontal: 10,
    // flex: 1,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  markIcon: {
    alignSelf: 'center',
    height: 65,
    width: 65,
    marginTop: 5,
    marginBottom: 30,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 29,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  eachTab: {
    backgroundColor: '#EEF3F7',
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1,
    borderRadius: 35,
    padding: 8,
    width: '31%',
  },
  activeStyle: {
    backgroundColor: '#1B2CC1',
  },
  activeText: {
    color: '#fff',
  },
  tabText: {
    fontSize: 12,
    color: '#1B2CC1',
  },
  runningTab: {
    backgroundColor: '#EEF3F7',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  //hasPlan
  hasPlanContainer: {
    backgroundColor: '#3A84FF',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 30,
  },
  view1: {
    padding: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    width: 80,
    height: 50,
    resizeMode: 'contain',
  },
  img2: {
    width: 80,
    height: 32,
    resizeMode: 'contain',
    position: 'relative',
    top: -12,
  },
  dateEnd: {
    width: '50%',
    alignSelf: 'flex-start',
    backgroundColor: '#80A8E8',
  },
  btnStyleAdjust: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    width: '50%',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  cardStyle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    width: '99%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 1,
    alignSelf: 'center',
    ...elevationShadowStyle(2),
  },
  innerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    marginLeft: 20.27,
  },
});
