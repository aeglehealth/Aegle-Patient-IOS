import {capitalize} from '../capitalizeFirstLetter';
export const splitWord = str => {
  var res = str && str.split('_').join(' ');
  return capitalize(res);
};
