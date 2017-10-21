import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { currencySymbols, formatFixed } from 'utils';

const mapStateToProps = (state, { currencyId }) =>
  ({ from, currenciesById }) => {
    const rate = (currenciesById[from].rate / currenciesById[currencyId].rate);
    return {
      currencyId,
      from,
      rate   : formatFixed(rate, 2),
      amount : formatFixed(
        Number(currenciesById[from].exchangeAmount) / rate,
        2
      ),
      sameCurrencies: currencyId === from
    };
  };

export function IncomingAmount({ currencyId, from, rate, amount, sameCurrencies }) {
  const amountEl = amount ? <h1>+{amount}</h1> : <div/>;
  return (
    <div hidden={sameCurrencies}>
      {amountEl}
      <p>{currencySymbols[currencyId]}1 = {currencySymbols[from]}{rate}</p>
    </div>
  );
}

IncomingAmount.propTypes = {
  currencyId     : PropTypes.string.isRequired,
  from           : PropTypes.string.isRequired,
  rate           : PropTypes.number.isRequired,
  amount         : PropTypes.number.isRequired,
  sameCurrencies : PropTypes.bool.isRequired
};

export const ConnectedIncomingAmount = connect(mapStateToProps)(IncomingAmount);
