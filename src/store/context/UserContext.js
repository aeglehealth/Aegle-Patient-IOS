import React from 'react';

export const UserContext = React.createContext({
  signin: () => console.log('week link'),
  data: '',
});
