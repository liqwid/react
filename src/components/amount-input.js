import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = (state, { currencyId }) =>
  ({ currenciesById, to }) => ({
    sameCurrencies : currencyId === to,
    amount         : currenciesById[currencyId].exchangeAmount
  });

export function AmountInput({ amount, sameCurrencies }) {
  let formattedAmount = amount;

  if (amount.length) formattedAmount = `-${amount}`;
  return <input readOnly value={formattedAmount} autoFocus hidden={sameCurrencies} />;
}

AmountInput.propTypes = {
  amount         : PropTypes.string.isRequired,
  sameCurrencies : PropTypes.bool.isRequired
};

export const ConnectedAmountInput = connect(mapStateToProps)(AmountInput);
