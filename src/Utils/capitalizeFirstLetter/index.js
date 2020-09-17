export const capitalize = string => {
  if (typeof string !== 'string') return 'Not a string';
  const wordToLowerCase = string.toLowerCase();
  const capitalise =
    wordToLowerCase.charAt(0).toUpperCase() + wordToLowerCase.slice(1);
  return capitalise;
};

export const capitalizeEachWord = str => {
  var wordsArray = str.toLowerCase().split(/\s+/);
  var upperCased = wordsArray.map(function(word) {
    return word.charAt(0).toUpperCase() + word.substr(1);
  });
  return upperCased.join(' ');
};
