import React from 'react';
import {Text} from 'react-native';
import {render} from 'react-native-testing-library';

const Hello = () => <Text>Hello, world!</Text>;

// describe('truth', () => {
//   it('is true', () => {
//     expect(1).toEqual(1);
//   });
// });

describe('Hello', () => {
  it('renders the correct message', () => {
    const {queryByText} = render(<Hello />);
    expect(queryByText('Hello, world!')).not.toBeNull();
  });
});
