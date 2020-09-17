import {IMAGE__URL, SEARCH_PATTERN} from 'react-native-dotenv';

export const IMAGE_URL = IMAGE__URL;

export function isURLFromAegle(url) {
  if (url !== null) {
    const searchPattern = SEARCH_PATTERN;
    let fileIsFromAegle = false;
    if (url.includes(searchPattern)) {
      fileIsFromAegle = true;
    }
    return fileIsFromAegle;
  }
}
