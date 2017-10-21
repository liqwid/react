import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = ({ to, from, currenciesById }) => {
  const fromCurrency = currenciesById[from];
  const toCurrency   = currenciesById[to];

  return {
    from,
    to,
    error : Boolean(toCurrency.showRatesError || toCurrency.showRatesError),
    rate  : toCurrency.rate && fromCurrency.rate && (toCurrency.rate / fromCurrency.rate),
    hide  : Boolean(
         toCurrency.rateIsLoading
      || fromCurrency.rateIsLoading
      || from === to
    )
  };
};

export function RateButton({ rate, from, to, hide }) {
  return <button hidden={hide}>{from} 1 = {to} {rate}</button>;
}

RateButton.propTypes = {
  rate  : PropTypes.number,
  from  : PropTypes.string,
  to    : PropTypes.string,
  hide  : PropTypes.bool.isRequired,
  error : PropTypes.bool.isRequired
};

RateButton.defaultProps = {
  rate : null,
  from : null,
  to   : null
};

export const ConnectedRateButton = connect(mapStateToProps)(RateButton);
