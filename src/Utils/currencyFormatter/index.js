import numbro from 'numbro';

export const CurrencyFormat = value => {
  return numbro(value).format({
    thousandSeparated: true,
  });
};
