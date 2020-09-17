import moment from 'moment';

// export const disabled = (date, time) => {
//   if (!date || !time) {
//     console.log('kikikik');
//   } else {
//     console.warn(date, time, 'd');
//   }
//   console.log(time, 'll');
//   // let date = '2020-07-04';
//   // let time = '01:15AM';

//   // let time = '00:45 AM';
// };

///////////////////
// OPTION 1
// export const disabled = (date, time) => {
//   //  console.log(time, 'll');
//   // let date = '2020-07-04';
//   // let time = '01:15AM';
//   console.warn(date, time, 'd');
//   // let time = '00:45 AM';
//   let timePassed;
//   // get current Hour
//   const currentHour = new Date().getHours();
//   let appointmentHour;
//   let isPassed;
//   // check if its pm
//   if (time.includes('PM')) {
//     // remOve PM
//     const numberTime = time && time.slice(0, 5);
//     // convert string time to number
//     let integer = parseInt(numberTime, 10);
//     // set new hour to the integer
//     appointmentHour = integer + 12;
//     // console.log('PM');
//   } else {
//     const numberTime = time.slice(0, 5);
//     let integer = parseInt(numberTime, 10);
//     appointmentHour = integer;
//     // console.log('AM');
//   }

//   // compare hours
//   if (currentHour > appointmentHour) {
//     // console.log(currentHour, appointmentHour, 'cuurr');
//     timePassed = true;
//   } else if (currentHour === appointmentHour) {
//     timePassed = false;
//   } else {
//     timePassed = false;
//   }

//   const dayPassed = moment(date).isBefore(moment().subtract(1, 'days'));
//   console.log(date, moment().subtract(1, 'days'));
//   // const isPassed = dayPassed && timePassed;
//   if (timePassed === true && dayPassed === true) {
//     isPassed = true;
//   } else {
//     isPassed = false;
//   }
//   // const t = dayPassed && timePassed;
//   console.log(dayPassed, 'dayPassed');
//   console.log(currentHour, appointmentHour, 'cuurr');
//   console.log(timePassed, 'timePassed');
//   console.log(isPassed, 'isPassed');
//   // console.log(dayPassed && timePassed, 'jjjjjjjjjjjj');

//   return isPassed ? true : false;
// };

////////////////////////////////////
// OPTION 2
export const disabled = (date, time) => {
  // console.log(date, 'date');
  let AMPM = time.slice(-2);
  let timeArr = time.slice(0, -2).split(':');
  if (AMPM === 'AM' && timeArr[0] === '12') {
    // catching edge-case of 12AM
    timeArr[0] = '00';
  } else if (AMPM === 'PM') {
    // everything with PM can just be mod'd and added with 12 - the max will be 23
    timeArr[0] = (timeArr[0] % 12) + 12;
  }
  // console.log(date);
  // console.log(date.split('T'));
  const newTime = timeArr.join(':').trim();
  const validTime = `${newTime}:00.000Z`;
  // console.log(validTime, 'new');
  const splitDate = date.split('T');
  const spliceDate = splitDate.splice(1, 1, validTime);
  const newDate = splitDate.join('T');
  // console.log(newDate, 'newDate');

  // return moment(newDate).isBefore(moment().subtract(1, 'days'));
  // return moment(newDate).isBefore();
  // console.log(new Date(), 'hhhhh');
  // console.log(new Date(newDate), 'lll');
  return new Date(newDate) <= new Date();
};
