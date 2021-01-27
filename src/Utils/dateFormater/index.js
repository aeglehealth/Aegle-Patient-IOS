import moment from 'moment';
import {compareAsc} from 'date-fns';

export const date1 = date => moment(date).format('YYYY-MM-DD');

export const date2 = date => moment(date).format('DD-MM-YYYY');

export const date3 = date => moment(date).format('YYYY/MM/DD');

export const date4 = date => moment(date).format('DD/MM/YYYY');

export const date5 = date => moment(date).format('DD-MM-YYYY HH:mm');

export const date6 = date => moment(date).format('DD-MM-YYYY HH:mm:ss');

export const LocaleDateString = () => {
  const date = new Date();
  return moment(date).format('DD/MM/YYYY');
};

export const UTCStringDate = () => new Date().toUTCString();

export const utcDateToString = momentInUTC => {
  let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  return s;
};

export const date7 = date => moment(date).format('YYYY-MM-DD HH:mm:ss');

export const date8 = date => moment(date).format('dddd, MMMM Do YYYY');

export const yesterday = moment().subtract(1, 'days');

export const dateFormatter = date => {
  const dater = date2(date);
  const day = dater.substr(0, 2);
  const monthNum = dater.substr(3, 2);
  const year = dater.substr(6, 4);

  let month;

  switch (monthNum) {
    case '01':
      month = 'January';
      break;

    case '02':
      month = 'February';
      break;

    case '03':
      month = 'March';
      break;

    case '04':
      month = 'April';
      break;

    case '05':
      month = 'May';
      break;

    case '06':
      month = 'June';
      break;

    case '07':
      month = 'July';
      break;

    case '08':
      month = 'August';
      break;

    case '09':
      month = 'September';
      break;

    case '10':
      month = 'October';
      break;

    case '11':
      month = 'November';
      break;

    case '12':
      month = 'December';
      break;

    default:
      break;
  }
  return `${day} ${month} ${year}`;
};

export const dateFormatter2 = date => {
  const dater = date2(date);
  const day = dater.substr(0, 2);
  const monthNum = dater.substr(3, 2);
  const year = dater.substr(6, 4);

  let month;

  switch (monthNum) {
    case '01':
      month = 'Jan.';
      break;

    case '02':
      month = 'Feb.';
      break;

    case '03':
      month = 'Mar.';
      break;

    case '04':
      month = 'Apr.';
      break;

    case '05':
      month = 'May';
      break;

    case '06':
      month = 'June';
      break;

    case '07':
      month = 'July';
      break;

    case '08':
      month = 'Aug.';
      break;

    case '09':
      month = 'Sep.';
      break;

    case '10':
      month = 'Oct.';
      break;

    case '11':
      month = 'Nov.';
      break;

    case '12':
      month = 'Dec.';
      break;

    default:
      break;
  }
  return `${day} ${month} ${year}`;
};

export const timeConversion = s => {
  let index = s.split(':')[0];
  let format = s.slice(-2);
  let firstIndex;

  if (format === 'AM' || format === 'am') {
    if (index === '12') {
      firstIndex = '00';
    } else if (index.length === 1) {
      firstIndex = '0' + index;
    } else {
      firstIndex = index;
    }
  } else {
    if (index === '12') {
      firstIndex = '12';
    } else {
      firstIndex = Number(index) + 12;
    }
  }
  let arr = [...s];
  index.length === 2 ? arr.splice(0, 2) : arr.splice(0, 1);
  arr.splice(-2);
  return firstIndex + arr.join('');
};

export const formatAMPM = date => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

export const checkFreeTrial = async date => {
  const expiryTime = new Date(new Date(date).getTime() + 60 * 60000 * 24 * 7);
  const currentTime = new Date(new Date().getTime());

  const option = compareAsc(expiryTime, currentTime);

  if (option == 1) {
    return false;
  }
  return true;
};
