import {format, isFuture} from 'date-fns';
import eachMinuteOfInterval from './EachMinuteInterval';
import curry from 'lodash/fp/curryRight';

const curriedFormat = curry(format)({});

export const timeIntervals = (start, end, interval, format = 'h:mm a') =>
  eachMinuteOfInterval({start, end}, {step: interval})
    .filter(isFuture)
    .map(date => curriedFormat(format)(date));
