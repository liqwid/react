import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { currencySymbols, formatFixed } from 'utils';

const mapStateToProps = ({ to, from, currenciesById }) => {
  const fromCurrency = currenciesById[from];
  const toCurrency   = currenciesById[to];

  return {
    from,
    to,
    rate : Number(toCurrency.rate && fromCurrency.rate && (toCurrency.rate / fromCurrency.rate)),
    hide : Boolean(
         from === to
      || toCurrency.rateIsLoading
      || fromCurrency.rateIsLoading
      || toCurrency.showRatesError
      || toCurrency.showRatesError
    )
  };
};

export function RateButton({ rate, from, to, hide }) {
  return (
    <button hidden={hide}>
      {currencySymbols[from]}1 = {currencySymbols[to]}{formatFixed(rate, 4)}
    </button>
  );
}

RateButton.propTypes = {
  rate : PropTypes.number,
  from : PropTypes.string,
  to   : PropTypes.string,
  hide : PropTypes.bool.isRequired
};

RateButton.defaultProps = {
  rate : 0,
  from : null,
  to   : null
};

export const ConnectedRateButton = connect(mapStateToProps)(RateButton);
