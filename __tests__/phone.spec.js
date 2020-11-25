import {numberFormatter} from '../src/screens/Auth/Phone';

describe('numberFormatter', () => {
  it('returns the formatted phone number', () => {
    const formattedValue = '+23408138242433';
    const country = 'NG';

    const result = numberFormatter(formattedValue, country);
    const expected = '+2348138242433';

    expect(result).toEqual(expected);
  });

  it('returns the formatted UK phone number', () => {
    const formattedValue = '+44508138242433';
    const country = 'GB';

    const result = numberFormatter(formattedValue, country);
    const expected = '+44508138242433';

    expect(result).toEqual(expected);
  });
});
