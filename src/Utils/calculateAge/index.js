import {date2} from '../dateFormater';
export const age = dob => {
  if (!age) return '-';
  const today = new Date();
  const currentYear = today.getFullYear();
  const formatDoB = date2(dob);
  const getDoBYear = Number(formatDoB.split('-')[2]);
  const age = `${currentYear - getDoBYear} years old`;
  return age;
};
